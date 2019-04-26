from collect import *

STATIC_ROOT = None

{% if cookiecutter.frontend == "angular" %}
PROXY_FRONTEND = None # use statically compiled files
{% endif %}
