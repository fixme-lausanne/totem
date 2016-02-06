Totem
=====

Let's show messages in the Hackerspace!

Installation
------------

- Install RPIO: https://pythonhosted.org/RPIO/#installation (you may need python-setuptools)
- Install RPLCD: https://github.com/dbrgn/RPLCD#installing
- Install RPi.GPIO: `pip install RPi.GPIO`


JSON
----

### Required

- **text** _String_ : Text 
- **tags** _Array_ : Tags corresponding to LCD screens. _Not working yet_.

### Optional

- **title** _String_ : Title. _Not working yet_.
- **priority** _Int_ : From 0 (lowest) to 5 (highest) (default: 0). _Not working yet_.
- **blink** _Boolean_ : Make the screen blink on new messages (default: true). _Not working yet_.
- **duration** _Int_ : Duration in seconds. (0 = Forever) (default: 0). _Not working yet_.

### Example

```json
{
	"title": "@Fixme",
	"text": "The space is open! Feel free to come!",
	"tags": [ '@Fixme', 'Twitter' ],
	"priority": 2,
	"blink": true,
	"duration": 600
}
```
