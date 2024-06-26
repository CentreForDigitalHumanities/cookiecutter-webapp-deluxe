from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response
from django.conf import settings
from django.utils import translation


@api_view(["GET", "POST"])
def i18n(request: Request):
    response = Response()
    if request.method == "POST":
        language = request.data["language"]
        translation.activate(language)
        response.set_cookie(settings.LANGUAGE_COOKIE_NAME, language)
    else:
        language = request.LANGUAGE_CODE

    response.data = {"current": language, "supported": settings.LANGUAGES}
    return response
