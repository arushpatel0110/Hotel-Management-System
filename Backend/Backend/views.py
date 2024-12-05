import datetime
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from django.http import JsonResponse

from django.utils import timezone
from decimal import Decimal

from room.models import Booking, RoomInstance, Room, BookingRoomInstance, RoomReview
from account.models import User


from datetime import datetime, timedelta
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
import json
from decimal import Decimal
from room.models import Room, RoomInstance, Booking, BookingRoomInstance, Availability


@csrf_exempt
def create_booking(request):
    if request.method == 'POST':
        try:
            token = request.headers.get('token')
            user = User.objects.get(token=token)
            data = json.loads(request.body)

            id = data['room_instance']
            check_in = data['check_in']
            days_count = int(data['daysCount'])
            check_out = data['check_out']
            phone_number = data['phone_number']
            add_ons = data['add_ons']
            rooms_data = data['rooms']

            total_payment = Decimal(0)
            room = get_object_or_404(Room, id=id)
            room_price = room.price

            # Create a booking instance
            booking = Booking.objects.create(
                user=user,
                check_in=datetime.strptime(check_in, '%Y-%m-%d'),
                check_out=datetime.strptime(check_out, '%Y-%m-%d'),
                phone_number=phone_number,
                total_payment=0,
                add_ons=add_ons,
                status='confirmed',
            )

            # Process each room in the booking
            for room_data in rooms_data:
                room_number = room_data.get('room_number')
                extra_beds = int(room_data.get('extra_beds', 0))
                room_instance = get_object_or_404(
                    RoomInstance, room_number=room_number, is_available=True
                )

                # Calculate price with extra beds
                extra_bed_price = room.extra_cost * extra_beds
                room_total = room_price + extra_bed_price
                total_payment += room_total * days_count

                # Create a BookingRoomInstance entry
                BookingRoomInstance.objects.create(
                    booking=booking,
                    room_instance=room_instance,
                    extra_bed_count=extra_beds
                )

                # Check if the room is available for each day between check_in and check_out
                current_date = datetime.strptime(check_in, '%Y-%m-%d').date()
                end_date = datetime.strptime(check_out, '%Y-%m-%d').date()

                while current_date < end_date:
                    # Check if the room is already marked as unavailable for any of these dates
                    if Availability.objects.filter(room_instance=room_instance, date=current_date, is_available=False).exists():
                        return JsonResponse({'success': False, 'message': f'Room {room_number} is unavailable on {current_date}'})

                    # Mark the room as unavailable for the current date
                    Availability.objects.create(
                        room_instance=room_instance,
                        date=current_date,
                        is_available=False
                    )
                    current_date += timedelta(days=1)

                # Mark the room as unavailable overall
                room_instance.is_available = False
                room_instance.save()

            # Finalize total payment and save the booking
            booking.total_payment = total_payment
            booking.save()

            return JsonResponse({'success': True,'payment':total_payment, 'message': 'Booking created successfully'})

        except Exception as e:
            print(str(e))
            return JsonResponse({'success': False, 'error': str(e)})

    return JsonResponse({'success': False, 'message': 'Invalid request method'})


def get_reviews(request):
    reviews = [
        {'rating': i.rating, 'comment': i.comment,
            'date': i.review_date, 'room_type': i.room.type}
        for i in RoomReview.objects.all()]
    print(reviews)
    return JsonResponse(list(reviews), safe=False)


@csrf_exempt
def add_review(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        token = request.headers.get('token')
        user = get_object_or_404(User, token=token)
        room = get_object_or_404(Room, id=data.get('room_id'))

        review = RoomReview.objects.create(
            user=user,
            room=room,
            rating=data['rating'],
            comment=data.get('comment', ''),
            review_date=timezone.now(),
        )
        return JsonResponse({'message': 'Review added successfully', 'id': review.id})
    return JsonResponse({'error': 'Invalid request'}, status=400)
