import subprocess
import time
import os
import shutil
import json


def scan_ports(extracted_root: str, architecture: str) -> dict:
    qemu_binary = f"/qemu-{architecture}"
    service_binary = "/usr/sbin/uhttpd"
    port = "8888"

    try:
        subprocess.Popen(
            [
                "chroot",
                extracted_root,
                qemu_binary,
                service_binary,
                "-p",
                port,
                "-h",
                "/www",
            ],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )

        time.sleep(2)

        result = subprocess.run(
            [
                "chroot",
                extracted_root,
                qemu_binary,
                "/bin/busybox",
                "netstat",
                "-tulnp",
            ],
            capture_output=True,
            text=True,
            timeout=10,
        )

        return {
            "success": True,
            "service_tested": "uhttpd",
            "port": port,
            "stdout": result.stdout.strip(),
            "stderr": result.stderr.strip(),
        }

    except Exception as e:
        return {
            "success": False,
            "stdout": "",
            "stderr": str(e),
        }
    
def detect_architecture(extracted_root: str) -> dict:
    busybox_path = os.path.join(extracted_root, "bin", "busybox")

    if not os.path.exists(busybox_path):
        return {
            "success": False,
            "error": "busybox not found in extracted firmware",
        }

    result = subprocess.run(
        ["file", busybox_path],
        capture_output=True,
        text=True,
    )

    output = result.stdout

    architecture = "unknown"

    if "MIPS" in output:
        architecture = "mips"
    elif "ARM" in output:
        architecture = "arm"
    elif "80386" in output or "x86" in output:
        architecture = "x86"

    return {
        "success": True,
        "architecture": architecture,
        "raw_output": output.strip(),
    }


def run_emulation(extracted_root: str, architecture: str) -> dict:

    qemu_binary = f"qemu-{architecture}"
    qemu_source = shutil.which(qemu_binary)

    if not qemu_source:
        return {
            "success": False,
            "error": f"{qemu_binary} not found on system",
        }

    qemu_dest = os.path.join(extracted_root, qemu_binary)

    try:
        if not os.path.exists(qemu_dest):
            shutil.copy(qemu_source, qemu_dest)
            os.chmod(qemu_dest, 0o755)

        result = subprocess.run(
            [
                "chroot",
                extracted_root,
                f"./{qemu_binary}",
                "./bin/busybox",
                "ls",
            ],
            capture_output=True,
            text=True,
            timeout=10,
        )

        return {
            "success": result.returncode == 0,
            "stdout": result.stdout.strip(),
            "stderr": result.stderr.strip(),
        }

    except subprocess.TimeoutExpired:
        return {
            "success": False,
            "error": "Emulation timed out",
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e),
        }
    
def get_emulation_report(extracted_root: str) -> dict:

    arch_result = detect_architecture(extracted_root)

    if not arch_result["success"]:
        return {
            "status": "failed",
            "stage": "architecture_detection",
            "details": arch_result,
        }

    architecture = arch_result["architecture"]

    if architecture == "unknown":
        return {
            "status": "failed",
            "stage": "architecture_detection",
            "details": "Unknown architecture",
        }

    emulation_result = run_emulation(extracted_root, architecture)

    port_result = scan_ports(extracted_root, architecture)

    return {
        "status": "success"
        if emulation_result["success"]
        else "failed",
        "stage": "emulation",
        "architecture": architecture,
        "architecture_details": arch_result["raw_output"],
        "emulation_output": emulation_result,
        "port_scan_output": port_result,
    }


if __name__ == "__main__":

    root = "/home/kali/firmware-test/_firmware.bin.extracted/squashfs-root"

    report = get_emulation_report(root)

    print(json.dumps(report, indent=2))