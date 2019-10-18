from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework import views
from rest_framework.response import Response
from shared.constants import stringToBool
import requests

from apps.application.models import Application
from ..models import Application
from .serializers import UserDetailSerializer

import logging; 




class UserDetail(views.APIView):
    serializer_class = UserDetailSerializer

    def get(self,request, *arg, **kwargs):
        api_endpoint = Application.objects.get(id=int(kwargs['application_id'])).end_url
        data = {"name":self.request.GET.get('name',),
                "email":self.request.GET.get('email',),
                "mobile":self.request.GET.get('mobile',)
               }
        if api_endpoint:
            requests.post(url=api_endpoint, data=data)
        results = UserDetailSerializer(data).data
        return Response(results)



