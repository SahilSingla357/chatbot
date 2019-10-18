from rest_framework.serializers import Serializer
from rest_framework import serializers


class UserDetailSerializer(Serializer):
    name = serializers.CharField(max_length= 50, allow_blank=True, trim_whitespace= True)
    email = serializers.CharField(max_length= 100, allow_blank=True)
    mobile = serializers.IntegerField()
