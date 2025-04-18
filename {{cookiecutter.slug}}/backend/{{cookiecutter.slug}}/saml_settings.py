""" SAML settings for testing purposes """

from django.urls import reverse_lazy
from os.path import dirname, join
from cdh.federated_auth.saml.settings import create_saml_config

USER_AUTH_DIR = join(dirname(dirname(__file__)), 'users')
APP_NAME = {{cookiecutter.slug}}

SAML_CONFIG = create_saml_config(
    base_url='localhost:8000',
    name=APP_NAME,
    key_file=join(USER_AUTH_DIR, 'saml_test_data/private.key'),
    cert_file=join(USER_AUTH_DIR, 'saml_test_data/public.cert'),
    idp_metadata='https://login.uu.nl/nidp/saml2/metadata',
    contact_given_name='Research Software Lab, Utrecht University Centre for Digital Humanities',
    contact_email='digitalhumanities@uu.nl',
)

AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
    'djangosaml2.backends.Saml2Backend',
)

LOGIN_URL = reverse_lazy('saml2_login')
