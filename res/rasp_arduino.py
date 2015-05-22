import smbus
import time
import sys

bus = smbus.SMBus(1)  # for RPI version 1, use "bus = smbus.SMBus(0)"
address = 0x04   # This is the address we setup in the Arduino Program


if __name__ == '__main__':
    if sys.argv[1] == '-read':
        print bus.read_byte(address)

    elif sys.argv[1] == '-write':
        bus.write_byte(address, int(sys.argv[2]))

    else:
        print 'err'
