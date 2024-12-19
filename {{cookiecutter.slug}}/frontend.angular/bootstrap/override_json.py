import os
import sys


def merge_json(target, source):
    for key, value in source.items():
        if value is None:
            del target[key]
        elif key in target and isinstance(target[key], dict) and \
                isinstance(source[key], dict):
            merge_json(target[key], source[key])
        else:
            target[key] = value
    return target


def override_json(filename):
    if os.path.isfile(f'{filename}.overwrite.json'):
        print(f'Overriding {filename}.json')
        with open(f'{filename}.overwrite.json', 'r') as file:
            overwrite = json.load(file)
        with open(f'{filename}.json', 'r') as file:
            data = json.load(file)
        with open(f'{filename}.json', 'w') as file:
            merge_json(data, overwrite)
            json.dump(data, file, indent=4)
        os.remove(f'{filename}.overwrite.json')


if __name__ == '__main__':
    override_json(sys.argv[1])
