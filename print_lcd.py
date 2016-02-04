from sys import stdin
from time import sleep
import RPIO
from RPLCD import CharLCD

refresh_rate = 0.2 # seconds
input_data = stdin.read().rstrip('\n')

pins_out = [11, 13, 15, 16]
pin_e = 8
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

printToScreen('Hello Fixme!')
sleep(2)

lcd.clear()
sleep(0.5)

printToScreen(input_data)
