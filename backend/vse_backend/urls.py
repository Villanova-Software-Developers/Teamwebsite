from django.urls import path
from .views import VerifyTokenView

urlpatterns = [
    path('auth/verify-token/', VerifyTokenView.as_view(), name='verify-token'),
]