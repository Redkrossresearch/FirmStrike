from arch_detector import detect_architecture
from qemu_launcher import launch_qemu
from port_scanner import capture_services

def run_pipeline(firmware_path):
    print("=== Firmware Analysis Started ===")
    
    arch = detect_architecture(firmware_path)
    launch_qemu(arch)
    capture_services(firmware_path)
    
    print("=== Analysis Complete ===")

if __name__ == "__main__":
    run_pipeline("test_firmware.bin")
