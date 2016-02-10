from sys import stdin
from time import sleep
from sys import argv

import RPIO
from RPLCD import CharLCD

refresh_rate = 0.2 # seconds

screen = int(argv[1])
input_data = argv[2].rstrip('\n')

pins_e = [19, 5, 7, 8]

pins_out = [11, 13, 15, 16]
pin_e = pins_e[screen]
pin_rs = 3
pin_rw = 10
nb_columns=8
nb_rows=2

lcd = CharLCD(
    pin_rs=pin_rs,
    pin_e=pin_e,
    pin_rw=pin_rw,
    pins_data=pins_out,
    numbering_mode=RPIO.BOARD,
    cols=nb_columns,
    rows=nb_rows,
    dotsize=8
)

stop = False

def printToScreen(str):
    if len(str) <= nb_columns * 2:
        lcd.clear()
        lcd.home()
        lcd.write_string(str[:nb_columns])
        lcd.cursor_pos = (1, 0)
        lcd.write_string(str[nb_columns:])
    else:
        pad = ' ' * nb_columns * 2
        longStr = pad + str + pad
        
        while True:
            for i in range(len(longStr)):
                printToScreen(longStr[i:i + nb_columns * 2])
                sleep(refresh_rate)


print('printing...')

lcd.clear()

printToScreen(input_data)
