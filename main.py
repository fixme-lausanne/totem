from dispatcher import Dispatcher

def filter_fixme(data):
    return filter(
        lambda x: 'fixme' in x.get('tags', []), data
    )

def print_to_lcd_fixme(string):
    print(string)

dis = Dispatcher('test_input')
dis.read()
dis.dispatch(print_to_lcd_fixme, filter_fixme)
