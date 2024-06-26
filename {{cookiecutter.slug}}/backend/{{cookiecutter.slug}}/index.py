from os import path
from django.http import HttpRequest, HttpResponse
from django.contrib.staticfiles import finders
from django.views.decorators.csrf import ensure_csrf_cookie


@ensure_csrf_cookie
def index(request: HttpRequest):
    """Thin wrapper for the static index.html that adds the CSRF cookie."""
    language = request.LANGUAGE_CODE
    page = request.path[1:].split("/", 1)[0]
    # pre-rendered version available?
    location = finders.find(path.join(language, page, "index.html"))
    if not location:
        location = finders.find(path.join(language, "index.html"))

    return HttpResponse(content=open(location))
