INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'livereload',
    'django.contrib.staticfiles',
    'rest_framework',
{%- if cookiecutter.basic_authentication == "Yes, please!" -%}
    'django.contrib.sites',
    'rest_framework.authtoken',
    'dj_rest_auth',
    'dj_rest_auth.registration',
    'allauth',
    'allauth.account',
    # Required for deleting accounts, but not actually used,
    # cf. https://github.com/iMerica/dj-rest-auth/pull/110.
    'allauth.socialaccount',
    'user',
{% endif %}
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
{%- if cookiecutter.basic_authentication == "Yes, please!" -%}
    'allauth.account.middleware.AccountMiddleware',
{%- endif -%}
{% if cookiecutter.saml_authentication == "Yes, please!" %}
    'djangosaml2.middleware.SamlSessionMiddleware',
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

{%- if cookiecutter.basic_authentication == "Yes, please!" -%}
# Authentication
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.TokenAuthentication",
        "rest_framework.authentication.SessionAuthentication",
    ]
}

AUTH_USER_MODEL = "user.User"
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_EMAIL_VERIFICATION = 'mandatory'

SITE_ID = 1
SITE_NAME = "{{cookiecutter.slug}}"

# Remove this setting in production!
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

HOST = "localhost:8000"

REST_AUTH = {
    "USER_DETAILS_SERIALIZER": "user.serializers.CustomUserDetailsSerializer",
}
{%- endif -%}
