from rest_framework.serializers import ModelSerializer

from ..models import Feedback

class FeedbackSerializer(ModelSerializer):

    class Meta:
        model = Feedback
        fields = ("first_name","last_name","feedback")