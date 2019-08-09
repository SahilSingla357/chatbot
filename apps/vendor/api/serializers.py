from rest_framework.serializers import ModelSerializer

from ..models import Vendor, VendorHierarchy


class VendorSerializer(ModelSerializer):

    class Meta:
        model = Vendor
        fields = ('id','name', 'email', 'mobile', 'is_active')


class VendorHierarchySerializer(ModelSerializer):

    class Meta:
        model = VendorHierarchy
        fields = ('vendee', 'employee', 'is_active')
