from dispatcher import Dispatcher

def by_tag(tag):
    return lambda x: tag in x.get('tags', [])

def print_to_lcd_fixme(string):
    print(string)

dis = Dispatcher('test_input')
dis.read()
dis.dispatch(print_to_lcd_fixme, by_tag('fixme'))
