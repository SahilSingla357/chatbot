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

    def get(self, **kwargs):
        api_endpoint = Application.objects.get(application_id=kwargs['application_id'])['end_url']
        data = {"name":self.request.GET['name'],
                "email":self.request.GET['email'],
                "mobile":self.request.GET['mobile']
               }
        requests.post(url=api_endpoint, data=data)
        results = UserDetailSerializer(data).data
        return Response(results)



