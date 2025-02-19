import re
import json
import os


def main():
    for lang in '{{cookiecutter.localizations}}'.split(','):
        [code, lang_name] = lang.split(':')
        with open(f'locale/messages.xlf', 'r') as file:
            messages = file.read()
        if code != '{{cookiecutter.default_localization}}':
            with open(f'locale/messages.{code}.xlf', 'w') as file:
                # add the target-language attribute after the source-language attribute
                targeted = re.sub(r'(source-language="[^"]+"[^>]*)', f'\\g<1> target-language="{code}"', messages)
                try:
                    with open(f'locale/messages.{code}.json', 'r') as pretranslated:
                        translations = json.load(pretranslated)
                        for key, value in translations.items():
                            targeted = targeted.replace(f'<source>{key}</source>', f'<source>{key}</source>\n        <target state="translated">{value}</target>')
                            os.remove(f'locale/messages.{code}.json')
                except FileNotFoundError:
                    pass
                file.write(targeted)


if __name__ == '__main__':
    main()
