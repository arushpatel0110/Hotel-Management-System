from django.urls import path
from .views import *

urlpatterns = [
    path('room-all-details/', getAllDetails),
    path('filter-rooms/', getFilteredRooms),
    path('room-details/<int:id>/', getRoomDetails),
    path('get-rooms-name/', getRoomNames),
    path('get-available-rooms/<int:id>/', getAvailableRooms),
    path('get-charges-details/<int:id>/', getBedDetails)
]
