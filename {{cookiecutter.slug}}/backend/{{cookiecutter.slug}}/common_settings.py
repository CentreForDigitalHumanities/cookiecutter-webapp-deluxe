INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'livereload',
    'django.contrib.staticfiles',
    'rest_framework',
    'revproxy',
    'example'
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
{% if cookiecutter.frontend == "backend" %}
    'livereload.middleware.LiveReloadScript',
{% endif %}
]

# Internationalization
# https://docs.djangoproject.com/en/3.0/topics/i18n/
LANGUAGES = [
{% set localizations = cookiecutter.localizations.split(',') %}
{%- for loc in localizations %}
{%- set code, name = loc.split(':') %}
    ('{{code}}', '{{name}}'),
{%- endfor %}
]
LANGUAGE_CODE = '{{cookiecutter.default_localization}}'

TIME_ZONE = 'Europe/Amsterdam'

USE_I18N = True

USE_TZ = True
