from .serializers import VendorSerializer, VendorHierarchySerializer
from rest_framework.generics import ListAPIView, RetrieveAPIView

from ..models import Vendor, VendorHierarchy


class VendorList(ListAPIView):
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer


class VendorDetails(RetrieveAPIView):
    queryset = Vendor
    serializer_class = VendorSerializer

#used
class VendorHierarchyList(ListAPIView):
    queryset = VendorHierarchy
    serializer_class = VendorHierarchySerializer

#used
class VendorHierarchyDetails(RetrieveAPIView):
    queryset = VendorHierarchy
    serializer_class = VendorHierarchySerializer
