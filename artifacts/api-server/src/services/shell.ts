import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export async function runCommand(
  command: string,
  args: string[],
  options?: { cwd?: string; timeoutMs?: number; maxBuffer?: number },
): Promise<{ stdout: string; stderr: string }> {
  const { stdout, stderr } = await execFileAsync(command, args, {
    cwd: options?.cwd,
    timeout: options?.timeoutMs ?? 120_000,
    maxBuffer: options?.maxBuffer ?? 20 * 1024 * 1024,
  });
  return { stdout: stdout.toString(), stderr: stderr.toString() };
}

export async function commandExists(command: string): Promise<boolean> {
  try {
    await runCommand("which", [command], { timeoutMs: 5_000 });
    return true;
  } catch {
    return false;
  }
}
