from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^vendors/$', views.VendorList.as_view(), name='get-all-vendors'),
    url(r'^vendor/(?P<pk>\d+)/$',
        views.VendorDetails.as_view(), name='get-vendor-by-pk')
]
