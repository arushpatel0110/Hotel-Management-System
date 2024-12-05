from django.db import models
from account.models import User


class Room(models.Model):
    id = models.AutoField(primary_key=True)
    type = models.CharField(max_length=15)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    include_ac = models.BooleanField()
    room_count = models.IntegerField()
    size = models.IntegerField()
    extra_bed_capacity = models.IntegerField(choices=[(1, 1), (2, 2), (3, 3)])
    extra_cost = models.DecimalField(max_digits=6, decimal_places=2)
    description = models.TextField(max_length=500)
    image1 = models.ImageField(
        upload_to='Room_Images', null=False, blank=False)
    image2 = models.ImageField(
        upload_to='Room_Images', null=False, blank=False)
    image3 = models.ImageField(upload_to='Room_Images', null=True, blank=True)
    image4 = models.ImageField(upload_to='Room_Images', null=True, blank=True)


class RoomInstance(models.Model):
    id = models.AutoField(primary_key=True)
    room = models.ForeignKey(
        Room, on_delete=models.CASCADE, related_name='instances')
    room_number = models.CharField(max_length=10, unique=True)
    is_available = models.BooleanField(default=True)


class Facility(models.Model):
    id = models.AutoField(primary_key=True)
    room = models.ForeignKey(
        Room, on_delete=models.CASCADE, related_name='facilities')
    title = models.CharField(max_length=25)
    description = models.CharField(max_length=200)
    image = models.ImageField(
        upload_to='Facility_Images', null=False, blank=False)


class Booking(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='bookings')
    room_instances = models.ManyToManyField(
        'RoomInstance', through='BookingRoomInstance')
    booking_time = models.DateTimeField(auto_now_add=True)
    total_payment = models.DecimalField(max_digits=10, decimal_places=2)
    phone_number = models.CharField(max_length=15)
    check_in = models.DateTimeField()
    check_out = models.DateTimeField()
    status = models.CharField(choices=[('confirmed', 'Confirmed'), (
        'pending', 'Pending'), ('canceled', 'Canceled')], max_length=10, default='pending')
    add_ons = models.JSONField(default=dict)


class BookingRoomInstance(models.Model):
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE)
    room_instance = models.ForeignKey(RoomInstance, on_delete=models.CASCADE)
    extra_bed_count = models.IntegerField(default=0)


class RoomReview(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='reviews')
    room = models.ForeignKey(
        Room, on_delete=models.CASCADE, related_name='reviews')
    rating = models.IntegerField(
        choices=[(1, 1), (2, 2), (3, 3), (4, 4), (5, 5)])
    comment = models.TextField(max_length=500, blank=True, null=True)
    review_date = models.DateTimeField(auto_now_add=True)


class Availability(models.Model):
    room_instance = models.ForeignKey(
        RoomInstance, on_delete=models.CASCADE, related_name='availability')
    date = models.DateField()
    is_available = models.BooleanField(default=True)
