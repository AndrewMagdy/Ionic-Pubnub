import RPi.GPIO as GPIO
import time
import sys
import Tkinter as tk
from pubnub import Pubnub
import json

pubnub = Pubnub(publish_key='pub-c-371bafb0-b1dc-4175-9bc0-6e68b7d512e2',
                subscribe_key='sub-c-a11f9ed6-dc88-11e5-8905-02ee2ddab7fe')

channel = 'Channel-car'

# Enable GPIO pins DECLERATION (H-Bridge 1)
H1_enable_a = 23
H1_enable_b = 24

# Enable GPIO pins DECLERATION (H-Bridge 2)
H2_enable_a = 13
H2_enable_b = 26

# IN(1-4) GPIO pins DECLERATION (H-Bridge 1)
H1_IN1 = 4
H1_IN2 = 17
H1_IN3 = 27
H1_IN4 = 22

# IN(1-4) GPIO pins DECLERATION (H-Bridge 2)
H2_IN1 = 5
H2_IN2 = 6
H2_IN3 = 12
H2_IN4 = 16
    
def init():
    GPIO.setmode (GPIO.BCM)
    GPIO.setwarnings(False)
    
    # Enable GPIO pins SETUP (H-Bridge 1)
    GPIO.setup(H1_enable_a,GPIO.OUT)
    GPIO.setup(H1_enable_b,GPIO.OUT)

    # Enable GPIO pins SETUP (H-Bridge 2)
    GPIO.setup(H2_enable_a,GPIO.OUT)
    GPIO.setup(H2_enable_b,GPIO.OUT)

    # IN(1-4) GPIO pins SETUP (H-Bridge 1)
    GPIO.setup(H1_IN1,GPIO.OUT)
    GPIO.setup(H1_IN2,GPIO.OUT)
    GPIO.setup(H1_IN3,GPIO.OUT)
    GPIO.setup(H1_IN4,GPIO.OUT)

    # IN(1-4) GPIO pins SETUP (H-Bridge 2)
    GPIO.setup(H2_IN1,GPIO.OUT)
    GPIO.setup(H2_IN2,GPIO.OUT)
    GPIO.setup(H2_IN3,GPIO.OUT)
    GPIO.setup(H2_IN4,GPIO.OUT)

#///////////////////////////////////////////////////////////////////////////////
def forward(tf):
    GPIO.cleanup()
    init()
    # Enable GPIO pins OUTPUT (H-Bridge 1)
    GPIO.output(H1_enable_a,True)
    GPIO.output(H1_enable_b,True)

    # Enable GPIO pins OUTPUT (H-Bridge 2)
    GPIO.output(H2_enable_a,True)
    GPIO.output(H2_enable_b,True)

    # IN(1-4) GPIO pins OUTPUT (H-Bridge 1)
    GPIO.output(H1_IN1,True)
    GPIO.output(H1_IN2,False)
    GPIO.output(H1_IN3,True)
    GPIO.output(H1_IN4,False)

    # IN(1-4) GPIO pins OUTPUT (H-Bridge 2)
    GPIO.output(H2_IN1,True)
    GPIO.output(H2_IN2,False)
    GPIO.output(H2_IN3,True)
    GPIO.output(H2_IN4,False)


def reverse(tf):
    GPIO.cleanup()
    init()
    # Enable GPIO pins OUTPUT (H-Bridge 1)
    GPIO.output(H1_enable_a,True)
    GPIO.output(H1_enable_b,True)

    # Enable GPIO pins OUTPUT (H-Bridge 2)
    GPIO.output(H2_enable_a,True)
    GPIO.output(H2_enable_b,True)

    # IN(1-4) GPIO pins OUTPUT (H-Bridge 1)
    GPIO.output(H1_IN1,False)
    GPIO.output(H1_IN2,True)
    GPIO.output(H1_IN3,False)
    GPIO.output(H1_IN4,True)

    # IN(1-4) GPIO pins OUTPUT (H-Bridge 2)
    GPIO.output(H2_IN1,False)
    GPIO.output(H2_IN2,True)
    GPIO.output(H2_IN3,False)
    GPIO.output(H2_IN4,True)

def turn_right(tf):
    GPIO.cleanup()
    init()
    # Enable GPIO pins OUTPUT (H-Bridge 1)
    GPIO.output(H1_enable_a,True)
    GPIO.output(H1_enable_b,True)

    # Enable GPIO pins OUTPUT (H-Bridge 2)
    GPIO.output(H2_enable_a,False)
    GPIO.output(H2_enable_b,False)

    # IN(1-4) GPIO pins OUTPUT (H-Bridge 1)
    GPIO.output(H1_IN1,True)
    GPIO.output(H1_IN2,False)
    GPIO.output(H1_IN3,True)
    GPIO.output(H1_IN4,False)

def turn_left(tf):
    GPIO.cleanup()
    init()
    # Enable GPIO pins OUTPUT (H-Bridge 1)
    GPIO.output(H1_enable_a,False)
    GPIO.output(H1_enable_b,False)

    # Enable GPIO pins OUTPUT (H-Bridge 2)
    GPIO.output(H2_enable_a,True)
    GPIO.output(H2_enable_b,True)

    # IN(1-4) GPIO pins OUTPUT (H-Bridge 2)
    GPIO.output(H2_IN1,True)
    GPIO.output(H2_IN2,False)
    GPIO.output(H2_IN3,True)
    GPIO.output(H2_IN4,False)

def pivot_right(tf):
    GPIO.cleanup()
    init()
    # Enable GPIO pins OUTPUT (H-Bridge 1)
    GPIO.output(H1_enable_a,True)
    GPIO.output(H1_enable_b,True)

    # Enable GPIO pins OUTPUT (H-Bridge 2)
    GPIO.output(H2_enable_a,True)
    GPIO.output(H2_enable_b,True)

    # IN(1-4) GPIO pins OUTPUT (H-Bridge 1)
    GPIO.output(H1_IN1,True)
    GPIO.output(H1_IN2,False)
    GPIO.output(H1_IN3,True)
    GPIO.output(H1_IN4,False)

    # IN(1-4) GPIO pins OUTPUT (H-Bridge 2)
    GPIO.output(H2_IN1,False)
    GPIO.output(H2_IN2,True)
    GPIO.output(H2_IN3,False)
    GPIO.output(H2_IN4,True)

def pivot_left(tf):
    GPIO.cleanup()
    init()
    # Enable GPIO pins OUTPUT (H-Bridge 1)
    GPIO.output(H1_enable_a,True)
    GPIO.output(H1_enable_b,True)

    # Enable GPIO pins OUTPUT (H-Bridge 2)
    GPIO.output(H2_enable_a,True)
    GPIO.output(H2_enable_b,True)

    # IN(1-4) GPIO pins OUTPUT (H-Bridge 1)
    GPIO.output(H1_IN1,False)
    GPIO.output(H1_IN2,True)
    GPIO.output(H1_IN3,False)
    GPIO.output(H1_IN4,True)

    # IN(1-4) GPIO pins OUTPUT (H-Bridge 2)
    GPIO.output(H2_IN1,True)
    GPIO.output(H2_IN2,False)
    GPIO.output(H2_IN3,True)
    GPIO.output(H2_IN4,False)

##def key_input(event):
##    init()
##    print 'Key:', event.char
##    key_press = event.char
##    sleep_time = 0.030
##
##    if key_press.lower() == 'w':
##        forward(sleep_time)
##    elif key_press.lower() == 's':
##        reverse(sleep_time)
##    elif key_press.lower() == 'd':
##        turn_right(sleep_time)
##    elif key_press.lower() == 'a':
##        turn_left(sleep_time)
##    elif key_press.lower() == 'e':
##        pivot_right(sleep_time)
##    elif key_press.lower() == 'q':
##        pivot_left(sleep_time)    
##    else:
##        GPIO.cleanup()
##        
##command = tk.Tk()
##command.bind('<KeyPress>', key_input)
##command.mainloop()

def _callback(m, channel):
    init()
    sleep_time = 10
    if m['car'] == 'forward':
        forward(sleep_time)
        print 'Moving Forward..'
    elif m['car'] == 'reverse':
        reverse(sleep_time)
        print 'Moving Backward..'
    elif m['car'] == 'turn_right':
        turn_right(sleep_time)
        print 'Turning Right..'
    elif m['car'] == 'turn_left':
        turn_left(sleep_time)
        print 'Turning Left..'
    elif m['car'] == 'pivot_left':
        pivot_left(sleep_time)
        print 'Pivot Left..'
    elif m['car'] == 'pivot_right':
        pivot_right(sleep_time)
        print 'Pivot Right..'
    else:
        GPIO.cleanup()

def _error(message):
    print(message)

pubnub.subscribe(channels=channel, callback=_callback, error=_error)
