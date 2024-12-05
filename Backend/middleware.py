from django.http import JsonResponse
from account.models import User


class TokenVerify:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request, *args, **kwargs):
        print('middleware')
        try:
            token = request.headers.get('Token', None)
            user = User.objects.filter(token=token).first()

            if (request.path in ['/auth/login/', '/auth/signup/', '/auth/token-login/']) or request.path.startswith('/admin') or request.path.startswith('/media'):
                return self.get_response(request)

            if user:
                return self.get_response(request)
        except Exception as e:
            print(str(e))
        return JsonResponse({'success': False, 'error': 'Token not found'}, status=401)
