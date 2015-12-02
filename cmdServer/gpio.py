from port import *
if __name__ == '__main__':
    import sys
    if (len(sys.argv) != 3 or (sys.argv[2] <> 'on' and sys.argv[2] <> 'off')):
        print """
                usage: gpio.py port# newState
                       port# - gpio port number to operate on
                       newState - new state to set, could be 'on' or 'off'
              """
        exit(1)
    else:
        nPort = int(sys.argv[1])
        state = sys.argv[2]

        INIT()

        port = GPIOPort(nPort, True)
        if state == 'on':
            print 'Port ' + str(nPort) + ' is ON'
            port.on()
        else:
            print 'Port ' + str(nPort) + ' is OFF'
            port.off()
        CLEANUP()
