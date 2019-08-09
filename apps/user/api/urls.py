from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^feedback/$', views.FeedbackList.as_view(), name='userFeedback')
]