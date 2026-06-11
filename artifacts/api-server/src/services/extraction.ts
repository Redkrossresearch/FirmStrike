import { mkdir, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { commandExists, runCommand } from "./shell.js";

export type ExtractedFileInfo = {
  path: string;
  type: string;
  size: number;
  permissions: string;
  isSuspicious: boolean;
};

export type ExtractionResult = {
  extractPath: string;
  files: ExtractedFileInfo[];
  architecture: string;
  components: string[];
};

const IOT_BINARIES = ["busybox", "httpd", "telnetd", "dropbear", "udhcpc", "dnsmasq", "lighttpd", "boa"];

async function walkDir(dir: string, root: string, files: ExtractedFileInfo[]): Promise<void> {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    const rel = path.relative(root, full).replace(/\\/g, "/");
    if (entry.isDirectory()) {
      if (entry.name === ".git") continue;
      await walkDir(full, root, files);
      continue;
    }
    const info = await stat(full);
    const lower = entry.name.toLowerCase();
    const isElf = lower.endsWith(".so") || !lower.includes(".") || lower.endsWith(".bin");
    const isSuspicious = IOT_BINARIES.some((b) => lower.includes(b)) ||
      lower.includes("cgi") || lower.includes("passwd") || lower.includes("config");
    let type = "file";
    if (lower.endsWith(".cgi") || lower.endsWith(".sh")) type = "script";
    else if (lower.endsWith(".so")) type = "Shared library";
    else if (lower.endsWith(".conf") || lower.includes("config") || lower === "passwd") type = "Configuration";
    else if (isElf) type = "ELF binary";

    files.push({
      path: `/${rel}`,
      type,
      size: info.size,
      permissions: info.mode.toString(8).slice(-4),
      isSuspicious,
    });
  }
}

async function extractGzipChunks(firmwarePath: string, extractPath: string): Promise<number> {
  const { readFile } = await import("node:fs/promises");
  const { gunzipSync } = await import("node:zlib");
  const buf = await readFile(firmwarePath);
  let count = 0;
  for (let i = 0; i < buf.length - 2; i++) {
    if (buf[i] === 0x1f && buf[i + 1] === 0x8b) {
      try {
        const decompressed = gunzipSync(buf.subarray(i, Math.min(i + 1024 * 1024, buf.length)));
        await writeFile(path.join(extractPath, `extracted_${count}.bin`), decompressed);
        count++;
      } catch {
        // not a valid gzip at this offset
      }
    }
  }
  return count;
}

function detectArchitectureFromBuffer(buf: Buffer): string {
  if (buf.length >= 4) {
    if (buf[0] === 0x7f && buf[1] === 0x45 && buf[2] === 0x4c && buf[3] === 0x46) {
      const arch = buf[18];
      if (arch === 0x28) return "ARM";
      if (arch === 0x08) return "MIPS";
      if (arch === 0x03) return "x86";
      if (arch === 0x3e) return "x86_64";
    }
    if (buf[0] === 0xea || buf[1] === 0xff) return "ARM";
    if (buf.subarray(0, 4).toString() === "\x7fELF") return "ARM";
  }
  return "UNKNOWN";
}

function detectComponents(files: ExtractedFileInfo[], stringsOutput: string): string[] {
  const found = new Set<string>();
  const haystack = `${files.map((f) => f.path).join(" ")} ${stringsOutput}`.toLowerCase();
  const patterns = [
    "openssl", "busybox", "openssh", "dropbear", "lighttpd", "boa", "uhttpd",
    "telnetd", "httpd", "libssl", "libcrypto", "zlib", "squashfs", "uboot",
  ];
  for (const p of patterns) {
    if (haystack.includes(p)) found.add(p);
  }
  const versionMatch = stringsOutput.match(/OpenSSL\s+[\d.]+[a-z]?/gi);
  if (versionMatch) found.add(versionMatch[0]);
  return [...found];
}

export async function extractFirmware(
  firmwarePath: string,
  extractPath: string,
): Promise<ExtractionResult> {
  await mkdir(extractPath, { recursive: true });

  const hasBinwalk = await commandExists("binwalk");
  if (hasBinwalk) {
    try {
      await runCommand("binwalk", ["-e", "-C", extractPath, "--run-as=root", firmwarePath], {
        timeoutMs: 300_000,
      });
    } catch {
      // fall through to built-in extraction
    }
  }

  const rawCopy = path.join(extractPath, "firmware.bin");
  const { copyFile, readFile } = await import("node:fs/promises");
  await copyFile(firmwarePath, rawCopy);
  await extractGzipChunks(firmwarePath, extractPath);

  let stringsOutput = "";
  if (await commandExists("strings")) {
    try {
      const { stdout } = await runCommand("strings", ["-a", firmwarePath], { timeoutMs: 60_000 });
      stringsOutput = stdout;
      await writeFile(path.join(extractPath, "_strings_dump.txt"), stringsOutput);
    } catch {
      stringsOutput = "";
    }
  }

  const files: ExtractedFileInfo[] = [];
  await walkDir(extractPath, extractPath, files);

  const buf = await readFile(firmwarePath);
  const architecture = detectArchitectureFromBuffer(buf);
  const components = detectComponents(files, stringsOutput);

  return { extractPath, files, architecture, components };
}
