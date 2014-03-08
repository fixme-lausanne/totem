from sys import stdin
from time import sleep
import RPIO
from RPLCD import CharLCD


refresh_rate = 0.2 # seconds
input_data = stdin.read()

pins_out = [11, 13, 15, 16]
pin_e = 8
pin_rs = 10
pin_rw = 3
nb_columns=20
nb_rows=4


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



def each_cons(x, size):
    return [x[i:i+size] for i in range(len(x)-size+1)]

while True:
    for x in each_cons(input_data, 20):
        lcd.clear()
        lcd.home()
        lcd.write_string(' '.join(x.split()))
        sleep(refresh_rate)
