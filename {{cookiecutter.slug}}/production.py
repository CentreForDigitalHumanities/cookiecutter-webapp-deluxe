import os
import os.path as op
from collect import *

here = op.dirname(op.abspath(__file__))

STATICFILES_DIRS = [op.join(here, 'static')]
STATIC_ROOT = None

{% if cookiecutter.frontend == "angular" %}
PROXY_FRONTEND = None  # use statically compiled files
{% endif %}
# Github Actions:
if os.environ.get('CI'):
    DEBUG = True
