from django.http import JsonResponse
from .models import *


def createResponse(success, data=None, message=None, error=None, status=200):
    response = {'success': success}
    if data:
        response['data'] = data
    if message:
        response['message'] = message
    if error:
        response['error'] = error
    response = JsonResponse(response)
    response.status_code = status
    return response


def getAllDetails(req):
    try:
        data = [
            {
                'id': i.id,
                'type': i.type,
                'image': i.image1.url,
                'price': i.price,
                'size': i.size,
                'description': i.description,
                'withAC': i.include_ac,
                'available_rooms': RoomInstance.objects.filter(room=i, is_available=True).count()
            } for i in Room.objects.all()]

        return createResponse(success=True, data=data)
    except Exception as e:
        return createResponse(False, error=str(e), status=404)


def getRoomDetails(req, id):
    try:
        room = Room.objects.get(id=id)
        available_rooms = RoomInstance.objects.filter(
            room=room, is_available=True).count()
        data = {
            'type': room.type,
            'price': room.price,
            'withAC': room.include_ac,
            'size': room.size,
            'available_rooms': available_rooms,
            'extra_bed_capacity': room.extra_bed_capacity,
            'extra_cost': room.extra_cost,
            'description': room.description,
            'image1': room.image1.url,
            'image2': room.image2.url,
            'image3': room.image3.url,
            'image4': room.image4.url
        }
        return createResponse(True, data=data)
    except Exception as e:
        response = JsonResponse({'success': False, 'error': str(e)})
        response.status_code = 404
        return response


def getFilteredRooms(request):
    try:
        min_price = request.GET.get('minPrice', 0)
        max_price = request.GET.get('maxPrice', 100)
        min_size = request.GET.get('minSize', 0)
        max_size = request.GET.get('maxSize', 100)
        min_available = request.GET.get('minAvailable')
        with_ac = request.GET.get('withAC', 'false').lower() == 'true'

        queryset = Room.objects.all()

        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        if min_size:
            queryset = queryset.filter(size__gte=min_size)
        if max_size:
            queryset = queryset.filter(size__lte=max_size)
        if min_available:
            queryset = queryset.filter(room_count__gte=min_available)
        if with_ac is not None:
            queryset = queryset.filter(include_ac=with_ac)

        data = [
            {
                'id': i.id,
                'type': i.type,
                'image': i.image1.url,
                'price': i.price,
                'description': i.description,
                'withAC': i.include_ac,
                'available_rooms': RoomInstance.objects.filter(room=i, is_available=True).count()
            } for i in queryset]

        return createResponse(success=True, data=data)
    except Exception as e:
        return createResponse(False, error=str(e), status=404)


def getRoomNames(req):
    try:
        names = [{'type': i.type, 'id': i.id} for i in Room.objects.all()]
        return createResponse(True, data=names, status=200)
    except Exception as e:
        return createResponse(False, status=404)


def getAvailableRooms(req, id):
    try:
        room = Room.objects.get(id=id)
        names = [i.room_number for i in RoomInstance.objects.filter(
            room=room, is_available=True)]
        return createResponse(True, data=names, status=200)
    except Exception as e:
        return createResponse(False, status=404)


def getBedDetails(req, id):
    try:
        room = Room.objects.get(id=id)
        data = {
            'room_charge': room.price,
            'extra_bed_count': room.extra_bed_capacity,
            'extra_bed_charge': room.extra_cost
        }
        return createResponse(True, data=data, status=200)
    except Exception as e:
        return createResponse(False, status=404)
