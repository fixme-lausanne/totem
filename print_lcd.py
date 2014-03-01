import RPIO
from RPLCD import CharLCD

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

lcd.write_string('Hello world')
