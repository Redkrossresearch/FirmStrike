import subprocess
import sys

def detect_architecture(firmware_path):
    result = subprocess.run(
        ['binwalk', firmware_path],
        capture_output=True,
        text=True
    )
    
    output = result.stdout.lower()
    
    if 'mips' in output:
        arch = 'MIPS'
    elif 'arm' in output:
        arch = 'ARM'
    elif 'x86' in output or 'intel' in output:
        arch = 'x86'
    else:
        arch = 'Unknown'
    
    print(f"Detected Architecture: {arch}")
    return arch

if __name__ == "__main__":
    firmware = sys.argv[1]
    detect_architecture(firmware)

