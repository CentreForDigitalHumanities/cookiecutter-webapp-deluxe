from django.contrib import admin
from django.contrib.auth import admin as auth_admin
from . import models

@admin.register(models.User)
class UserAdmin(auth_admin.UserAdmin):
    pass
