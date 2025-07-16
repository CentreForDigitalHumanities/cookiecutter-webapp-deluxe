""" SAML settings for testing purposes """

from os.path import dirname, join
from os import environ

from cdh.federated_auth.saml.settings import create_saml_config
from django.urls import reverse_lazy

USER_AUTH_DIR = join(dirname(dirname(__file__)), 'user')
APP_NAME = '{{cookiecutter.slug}}'
IDP_ADDRESS = environ.get('IDP_ADDRESS', 'localhost')

SAML_CONFIG = create_saml_config(
    base_url='localhost:8000',
    name=APP_NAME,
    key_file=join(USER_AUTH_DIR, 'tests', 'saml', 'sp_certificates', 'private.key'),
    cert_file=join(USER_AUTH_DIR, 'tests', 'saml', 'sp_certificates', 'public.cert'),
    idp_metadata=f'http://{IDP_ADDRESS}:7000/saml/idp/metadata/',
    contact_given_name='Research Software Lab, Utrecht University Centre for Digital Humanities',
    contact_email='digitalhumanities@uu.nl',
)

AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
    'djangosaml2.backends.Saml2Backend',
)

LOGIN_URL = reverse_lazy('saml2_login')
