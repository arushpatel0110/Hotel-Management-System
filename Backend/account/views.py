import hashlib
import json
from django.core.exceptions import ObjectDoesNotExist
from django.core.files.storage import default_storage
from django.core.mail import EmailMultiAlternatives
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from account.models import User, VerifyEmail
from room.models import *
from django.contrib.auth.hashers import make_password


def create_json_response(success, message=None, data=None, error=None, status=200):
    response = {'success': success}
    if message:
        response['message'] = message
    if data:
        response['data'] = data
    if error:
        response['error'] = error

    return JsonResponse(response, status=status)


@ csrf_exempt
def login(req):
    if req.method == 'POST':
        try:
            data = json.loads(req.body)
            email = data.get('email')
            password = data.get('password')
            user = User.objects.filter(email=email).first()
            print(user)

            if not user:
                return create_json_response(False, message='No User Found', status=404)

            if user.check_password(password):
                return JsonResponse({'success': True, 'token': user.token})

            return create_json_response(False, message='Wrong Password', status=401)
        except Exception as e:
            return create_json_response(False, message=str(e), status=400)

    return create_json_response(False, message='Invalid request method', status=405)


def sendMail(email, token):
    subject = 'Email Verification'
    msg = f'Here is your link, open it to login to HotelClub : <a href="http://localhost:5173/token-login/{
        token}">Login</a>'

    try:
        mail = EmailMultiAlternatives(subject, msg, '', [email])
        mail.attach_alternative(msg, "text/html")
        mail.send()
        return {'mail_sent': True}
    except Exception as e:
        print('error2', str(e))
        return {'mail_sent': False, 'error': str(e)}


@ csrf_exempt
def signup(request):
    first_name = request.POST.get('firstName')
    last_name = request.POST.get('lastName')
    email = request.POST.get('email')
    mobile_number = request.POST.get('mobileNumber')
    password = request.POST.get('password')
    dob = request.POST.get('dob')
    gender = request.POST.get('gender')

    if not all([first_name, last_name, email, password]):
        return JsonResponse({'error': 'Please fill in all required fields.'}, status=400)

    try:
        print(1)
        if VerifyEmail.objects.filter(email=email):
            return create_json_response(False, error='Email Already Sent.', status=500)
        print(2)
        if User.objects.filter(email=email):
            return create_json_response(False, error='User Already Exist', status=500)
        print(3)
        user = User.objects.create(
            first_name=first_name,
            last_name=last_name,
            email=email,
            mobile_number=mobile_number,
            password=make_password(password),
            dob=dob,
            gender=gender,
        )
        print(4)
       # response = sendMail(user.email, user.token)
        print(5)
        #  if response['mail_sent']:
        return create_json_response(True, status=201)
       # else:
           # return create_json_response(False, error=response['error'], status=500)
    except Exception as e:
        print('error1', str(e))
        return create_json_response(False, error=str(e), status=500)


@ csrf_exempt
def tokenLogin(req):
    if req.method == 'POST':
        try:
            print(json.loads(req.body))
            token = json.loads(req.body)['body']['token']
            obj = VerifyEmail.objects.filter(token=token).first()
            print(1, obj)
            if obj:
                print(2, obj)
                new_user = User(
                    first_name=obj.first_name,
                    last_name=obj.last_name,
                    email=obj.email,
                    mobile_number=obj.mobile_number,
                    password=obj.password,
                    token=obj.token,
                    dob=obj.dob,
                    gender=obj.gender
                )
                new_user.save()
                obj.delete()
                print(3, obj)
                return JsonResponse({'success': True, 'token': new_user.token})

            return create_json_response(False, message='Not a Valid URL', status=500)
        except Exception as e:
            print(str(e))
            return create_json_response(False, message=str(e), status=500)
    return create_json_response(False, message='Invalid request method', status=500)
