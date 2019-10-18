from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^(?P<application_id>\d+)/user-detail/$',
        views.UserDetail.as_view(), name='passes information about logged in user'),
]