from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(Room)
admin.site.register(RoomInstance)
admin.site.register(Facility)
admin.site.register(Booking)
admin.site.register(RoomReview)
admin.site.register(Availability)
admin.site.register(BookingRoomInstance)
