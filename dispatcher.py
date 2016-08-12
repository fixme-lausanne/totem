import RPIO
from RPLCD import CharLCD

import socketserver
import sys
import json
from threading import Thread, Lock
from time import sleep

HOST = ''
if len(sys.argv) > 1:
    PORT = int(sys.argv[1])
else:
    PORT = 4000 

REFRESH_RATE = 0.15 # seconds
NB_COLUMNS = 8

screensMutex = Lock()
screens = [{
    'text': ''
}, {
    'text': ''
}, {
    'text': ''
}, {
    'text': ''
}]

current_texts = ['', '', '', '']
offset_texts = [0, 0, 0, 0]

pins_e = [19, 5, 7, 8]

pins_out = [11, 13, 15, 16]
pin_rs = 3
pin_rw = 10
nb_columns = 8
nb_rows = 2

for i in range(0, 4):
    lcds.insert(CharLCD(
        pin_rs = pin_rs,
        pin_e = pins_e[i],
        pin_rw = pin_rw,
        pins_data = pins_out,
        numbering_mode = RPIO.BOARD,
        cols = nb_columns,
        rows = nb_rows,
        dotsize = 8
    ))

# Set screen data using a mutex
def setScreen(id, s):
    global screens

    screensMutex.acquire()
    try:
        screens[id] = s
    finally:
        screensMutex.release()

# Get screens data using a mutex
def getScreens():
    global screens

    screensMutex.acquire()
    try:
        return screens
    finally:
        screensMutex.release()

# Handle recieved data
class TCPHandler(socketserver.BaseRequestHandler):
    def handle(self):
        self.data = self.request.recv(1024).strip()

        data = json.loads(self.data.decode('utf-8'))

        for screenId in data['screens']:
            setScreen(screenId, data)

        print("Update!")

        self.request.sendall('goodby\n'.encode('utf-8'))

# Launch TCP server
def runServer():
    if __name__ == "__main__":
        server = socketserver.TCPServer((HOST, PORT), TCPHandler)
        server.serve_forever()

# Write text on LCD screens
def write():
    def printLongText(str, i):
        separator = "  |  "
        longStr = str + separator + str
        off = offset_texts[i]

        printOnLCD(longStr[off:off + NB_COLUMNS * 2], i)

        offset_texts[i] += 1
        if (offset_texts[i] > len(str) + len(separator) - 1):
            offset_texts[i] = 0
    while 1:
        sleep(REFRESH_RATE)
        screens = getScreens()
        for i, screen in enumerate(screens):
            # On new text
            newText = screen['text']
            if (current_texts[i] != newText):
                current_texts[i] = newText

                # If the new text fit into the screen
                if (len(newText) <= NB_COLUMNS * 2):
                    printOnLCD(newText, i)
                else:
                    offset_texts[i] = 0
                    printLongText(newText, i)
            else:
                if (len(newText) > NB_COLUMNS * 2):
                    printLongText(newText, i)

def printOnLCD(str, i):
    lcd = lcds[i]
    lcd.clear()
    lcd.home()
    lcd.write_string(str[:NB_COLUMNS])
    lcd.cursor_pos = (1, 0)
    lcd.write_string(str[NB_COLUMNS:])

serverThread = Thread(target=runServer)
serverThread.start()

writerThread = Thread(target=write)
writerThread.start()
