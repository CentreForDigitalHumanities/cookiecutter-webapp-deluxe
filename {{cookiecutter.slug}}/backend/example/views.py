from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view()
def hooray(request):
    response = [{ 'message': 'https://media.giphy.com/media/yoJC2GnSClbPOkV0eA/source.gif' }]
    return Response(response)
