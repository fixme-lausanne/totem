Totem
=====

Let's show messages in the Hackerspace!

Installation
------------

### print_lcd.py

- Install RPIO: https://pythonhosted.org/RPIO/#installation (the github method seems to work better. You may need python-setuptools)
- Install RPLCD: https://github.com/dbrgn/RPLCD#installing
- Install RPi.GPIO: `pip install RPi.GPIO`

### Web Manager

- https://www.meteor.com/install

### Tweet-getter

`npm install -g`

How to Run
----------

First, start the dispatcher with: `python /root/totem/dispatcher.py` (we don't live in the past so it's python 3).  
And then, start the Web Manager with: `cd web-manager` and `meteor`.

_Note: you may need to change the IP address of the dispatcher in Web Manager global file: `web-manager/00_globals.js`_

JSON for the Web Manager
------------------------

### Required

- **text** _String_ : Text 
- **tags** _Array_ : Tags that will be handle, filter, dispatch by the Web Manager.

### Optional

- **priority** _Int_ : From 0 (lowest) to 5 (highest) (default: 0). _Not working yet_.
- **blink** _Boolean_ : Make the screen blink on new messages (default: true). _Not working yet_.
- **duration** _Int_ : Duration in seconds. (0 = Forever) (default: 0). _Not working yet_.

### Example

```json
{
	"title": "@_fixme",
	"text": "The space is open! Feel free to come!",
	"tags": [ "Twitter", "@_fixme" ],
	"priority": 2,
	"blink": true,
	"duration": 600
}
```

JSON for the Dispatcher
-----------------------

### Required

- **text** _String_ : Text 
- **screens** _Array_ : Identification number corresponding to LCD screens.

### Optional

- **priority** _Int_ : From 0 (lowest) to 5 (highest) (default: 0). _Not working yet_.
- **blink** _Boolean_ : Make the screen blink on new messages (default: true). _Not working yet_.
- **duration** _Int_ : Duration in seconds. (0 = Forever) (default: 0). _Not working yet_.

### Example

```json
{
	"title": "@_fixme",
	"text": "The space is open! Feel free to come!",
	"screens": [ 0, 2, 3 ],
	"priority": 2,
	"blink": true,
	"duration": 600
}
```

How does it works?
------------------

### Diagram

![Totem Diagram](/doc/totem-diagram.png)
