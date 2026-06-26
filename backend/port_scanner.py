import subprocess
import sys

def capture_services(firmware_path):
    print(f"Scanning firmware: {firmware_path}")
    
    # Binwalk se services dhundo
    result = subprocess.run(
        ['binwalk', '--signature', firmware_path],
        capture_output=True,
        text=True
    )
    
    output = result.stdout
    services = []
    
    # Common services check karo
    keywords = ['telnet', 'ssh', 'http', 'ftp', 'smtp', 'busybox']
    for line in output.lower().split('\n'):
        for keyword in keywords:
            if keyword in line:
                services.append(keyword.upper())
    
    if services:
        print(f"Found services: {list(set(services))}")
    else:
        print("No known services found")
    
    return services

if __name__ == "__main__":
    firmware = sys.argv[1]
    capture_services(firmware)
