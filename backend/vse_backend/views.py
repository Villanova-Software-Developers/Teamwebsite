from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from firebase_admin import auth

class VerifyTokenView(APIView):
    def post(self, request):
        token = request.data.get('token')
        try:
            decoded_token = auth.verify_id_token(token)
            return Response({'uid': decoded_token['uid']})
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
