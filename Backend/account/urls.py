from django.urls import path
from . import views


urlpatterns = [
    path('login/', views.login),  # done
    path('signup/', views.signup),  # done
    path('token-login/', views.tokenLogin),  # done
]
