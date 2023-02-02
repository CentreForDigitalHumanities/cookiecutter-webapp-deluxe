from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response
from django.conf import settings
from django.utils import translation


@api_view(['GET'])
def get(request: Request):
    return Response({
        'current': request.LANGUAGE_CODE,
        'supported': settings.LANGUAGES
    })


@api_view(['POST'])
def set(request: Request):
    language = request.data['language']
    translation.activate(language)
    response = Response(language)
    response.set_cookie(settings.LANGUAGE_COOKIE_NAME, language)
    return response
