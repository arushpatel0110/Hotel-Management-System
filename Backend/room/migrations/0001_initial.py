# Generated by Django 5.0.4 on 2024-09-22 03:01

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('account', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Room',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('type', models.CharField(max_length=15)),
                ('price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('room_count', models.IntegerField()),
                ('size', models.IntegerField()),
                ('extra_bed_capacity', models.IntegerField(choices=[(1, 1), (2, 2), (3, 3)])),
                ('extra_cost', models.DecimalField(decimal_places=2, max_digits=6)),
                ('description', models.TextField(max_length=500)),
                ('image1', models.ImageField(upload_to='Room_Images')),
                ('image2', models.ImageField(upload_to='Room_Images')),
                ('image3', models.ImageField(blank=True, null=True, upload_to='Room_Images')),
                ('image4', models.ImageField(blank=True, null=True, upload_to='Room_Images')),
            ],
        ),
        migrations.CreateModel(
            name='Facility',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=25)),
                ('description', models.CharField(max_length=200)),
                ('image', models.ImageField(upload_to='Facility_Images')),
                ('room', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='facilities', to='room.room')),
            ],
        ),
        migrations.CreateModel(
            name='RoomInstance',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('room_number', models.CharField(max_length=10, unique=True)),
                ('is_available', models.BooleanField(default=True)),
                ('room', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='instances', to='room.room')),
            ],
        ),
        migrations.CreateModel(
            name='Booking',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('booking_time', models.DateTimeField(auto_now_add=True)),
                ('total_payment', models.DecimalField(decimal_places=2, max_digits=10)),
                ('phone_number', models.CharField(max_length=15)),
                ('check_in', models.DateTimeField()),
                ('check_out', models.DateTimeField()),
                ('person_count', models.IntegerField()),
                ('extra_bed_count', models.IntegerField(default=0)),
                ('status', models.CharField(choices=[('confirmed', 'Confirmed'), ('pending', 'Pending'), ('canceled', 'Canceled')], default='pending', max_length=10)),
                ('add_ons', models.JSONField(default=dict)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='bookings', to='account.user')),
                ('room_instance', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='bookings', to='room.roominstance')),
            ],
        ),
        migrations.CreateModel(
            name='Availability',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('is_available', models.BooleanField(default=True)),
                ('room_instance', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='availability', to='room.roominstance')),
            ],
        ),
        migrations.CreateModel(
            name='RoomReview',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('rating', models.IntegerField(choices=[(1, 1), (2, 2), (3, 3), (4, 4), (5, 5)])),
                ('comment', models.TextField(blank=True, max_length=500, null=True)),
                ('review_date', models.DateTimeField(auto_now_add=True)),
                ('room', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reviews', to='room.room')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reviews', to='account.user')),
            ],
        ),
    ]