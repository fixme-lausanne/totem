totem
=====

Let's show some tweets on a tree in the hackerspace

Installation
------------

- Install RPIO: https://pythonhosted.org/RPIO/#installation (you may need python-setuptools)
- Install RPLCD: https://github.com/dbrgn/RPLCD#installing
- Install RPi.GPIO: `pip install RPi.GPIO`


JSON
----

### Required

- **title** _String_ : Title
- **text** _String_ : Text 
- **tags** _Array_ : Tags corresponding to LCD screens

### Optional

- **priority** _Int_ :
- **blink** _Boolean_ :
- **duration** _Int_ : Duration in seconds
