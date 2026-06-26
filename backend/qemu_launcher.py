import subprocess
import sys

def launch_qemu(arch):
    if arch == 'ARM':
        cmd = ['qemu-system-arm', '-M', 'versatilepb', '-nographic']
    elif arch == 'MIPS':
        cmd = ['qemu-system-mips', '-M', 'malta', '-nographic']
    elif arch == 'x86':
        cmd = ['qemu-system-x86_64', '-nographic']
    else:
        print("Unknown architecture - cannot launch QEMU")
        return

    print(f"Launching QEMU for {arch}...")
    print(f"Command: {' '.join(cmd)}")

if __name__ == "__main__":
    arch = sys.argv[1]
    launch_qemu(arch)

