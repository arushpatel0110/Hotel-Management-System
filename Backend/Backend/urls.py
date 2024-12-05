from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from .views import *

urlpatterns = [
    path('admin/', admin.site.urls),
    path('room/', include('room.urls')),
    path('auth/', include('account.urls')),
    path('create-booking/', create_booking),
    path('reviews/', get_reviews),
    path('reviews/add/', add_review),

]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
