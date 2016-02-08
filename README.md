Totem
=====

Let's show messages in the Hackerspace!

Installation
------------

### print_lcd.py

- Install RPIO: https://pythonhosted.org/RPIO/#installation (you may need python-setuptools)
- Install RPLCD: https://github.com/dbrgn/RPLCD#installing
- Install RPi.GPIO: `pip install RPi.GPIO`

### Web Manager

- https://www.meteor.com/install

### Tweet-getter

`npm install -g`

JSON
----

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
	"title": "@Fixme",
	"text": "The space is open! Feel free to come!",
	"screens": [ 0, 2, 3 ],
	"priority": 2,
	"blink": true,
	"duration": 600
}
```
