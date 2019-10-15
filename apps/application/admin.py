from django.contrib import admin
from . import models


class ApplicationAdmin(admin.ModelAdmin):
    model = models.Application
    def get_readonly_fields(self, request, obj=None):
        if obj:
            return ['script']
        else:
            return []

admin.site.register(models.Application, ApplicationAdmin);