def test_{{cookiecutter.slug}}_frontend(browser, base_address):
    browser.get(base_address)
    assert '{{cookiecutter.project_title}}' in browser.title


def test_{{cookiecutter.slug}}_admin(browser, admin_address):
    browser.get(admin_address)
    assert 'Django' in browser.title


def test_{{cookiecutter.slug}}_api(browser, api_address):
    browser.get(api_address)
    assert 'Api Root' in browser.title


def test_{{cookiecutter.slug}}_api_auth(browser, api_auth_address):
    browser.get(api_auth_address + 'login/')
    assert 'Django REST framework' in browser.title
