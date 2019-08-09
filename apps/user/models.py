from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.utils.translation import ugettext_lazy as _
from django.utils import timezone
from apps.vendor.models import Vendor
from django.contrib.auth.models import AbstractUser


class Feedback(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    feedback = models.TextField()

    def __str__(self):
        return self.first_name + " " +self.last_name

class User(AbstractUser):

    @property
    def is_vendor_user(self):
        if self.vendorhierarchy_set.all():
            return True
        return False

    def __str__(self):
        return self.first_name + " " + self.last_name
