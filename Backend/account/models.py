from django.db import models
from django.contrib.auth.hashers import make_password, check_password
import hashlib


class User(models.Model):
    id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=20)
    email = models.EmailField(unique=True)
    mobile_number = models.CharField(max_length=15)
    password = models.CharField(max_length=255)
    token = models.CharField(max_length=255, null=True, default=None)
    dob = models.DateField()
    gender = models.CharField(
        max_length=10,
        choices=[('male', 'Male'), ('female', 'Female'), ('other', 'Other')]
    )

    def save(self, *args, **kwargs):
        if not self.password.startswith('pbkdf2_'):
            self.password = make_password(self.password)

        if not self.token:
            self.token = hashlib.sha256(
                self.email.lower().split('@')[0].encode()
            ).hexdigest()

        super(User, self).save(*args, **kwargs)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)


class VerifyEmail(models.Model):
    first_name = models.CharField(max_length=20)
    last_name = models.CharField(max_length=20)
    email = models.EmailField(unique=True)
    mobile_number = models.CharField(max_length=15)
    password = models.CharField(max_length=255)
    token = models.CharField(max_length=255, null=True, default=None)
    dob = models.DateField()
    gender = models.CharField(
        max_length=10,
        choices=[('male', 'Male'), ('female', 'Female'), ('other', 'Other')]
    )

    def save(self, *args, **kwargs):
        try:
            if not self.password.startswith('pbkdf2_'):
                self.password = make_password(self.password)
            if not self.token:
                self.token = hashlib.sha256(
                    self.email.lower().split('@')[0].encode()).hexdigest()
            super(VerifyEmail, self).save(*args, **kwargs)
        except Exception as e:
            print('error3', str(e))
