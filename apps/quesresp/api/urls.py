from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^(?P<application_id>\d+)/questions/$',
        views.QuestionList.as_view(), name='get-all-questions-for-a-vendor'),
    url(r'^(?P<application_id>\d+)/question/(?P<pk>\d+)/$',
        views.QuestionDetail.as_view(), name='get-vendor-by-pk'),
    url(r'^(?P<application_id>\d+)/question/(?P<question_id>\d+)/responses/$',
        views.ResponseList.as_view(), name='get-all-responses-for-a-ques'),
]
