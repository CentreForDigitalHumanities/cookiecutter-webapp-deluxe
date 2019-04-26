from django.http import HttpResponse
from django.contrib.staticfiles import finders
from django.views.decorators.csrf import ensure_csrf_cookie
import mimetypes

@ensure_csrf_cookie
def index(request):
    """ Thin wrapper for the static index.html that adds the CSRF cookie."""
    filepath = request.path[1:] or "index.html"
    return HttpResponse(open(finders.find(filepath), 'rb'), content_type=mimetypes.guess_type(filepath)[0])
