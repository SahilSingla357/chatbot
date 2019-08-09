from django.contrib import admin
from . import models

class VendorHierarchyInline(admin.TabularInline):
    model = models.VendorHierarchy
    extra = 1


class VendorAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'email', 'mobile')
    inlines = [VendorHierarchyInline]
    model = models.VendorHierarchy
    fk_name = 'vendee'
    extra = 0

    def get_readonly_fields(self, request, obj=None):
        if obj:
            return ['script']
        else:
            return []


admin.site.register(models.Vendor, VendorAdmin)
