import RPi.GPIO as GPIO

def INIT():
    GPIO.setmode(GPIO.BCM)

def CLEANUP():
    GPIO.cleanup() # cleanup all GPIO

"""
    nPort: port num in BCM mode
    bOut: True for output, False for input
"""
class GPIOPort:
    def __init__(self, nPort, bOut):
        self.nport = nPort
        self.bout = bOut
        iotype = GPIO.IN
        if self.bout:
            iotype = GPIO.OUT
        print 'setting port: ' + str(self.nport) + '  out: ' + str(self.bout)
        GPIO.setup(self.nport, iotype)

    def on(self):
        if self.bout:
            print 'port outing...'
            GPIO.output(self.nport, GPIO.HIGH)
            print 'port outing done'
        else:
            raise Exception("Im an port for input!")

    def off(self):
        if self.bout:
            GPIO.output(self.nport, GPIO.LOW)
        else:
            raise Exception("Im an port for input!")

    def read(self):
        if self.bout:
            raise Exception("Im an port for output!")
        else:
            return GPIO.input(self.nport)
