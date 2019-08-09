from rest_framework.serializers import ModelSerializer
from rest_framework import serializers

from ..models import Question, Response, QuesRespRelation


class QuestionSerializer(ModelSerializer):
    response_data = serializers.ListField()

    class Meta:
        model = Question
        fields = ('id', 'vendor', 'question_text',
                  'is_first_question', 'is_active', 'response_data')


class ResponseSerializer(ModelSerializer):

    class Meta:
        model = Response
        fields = ('id', 'vendor', 'response_text', 'is_active')


class QuesRespRelSerializer(ModelSerializer):

    class Meta:
        model = QuesRespRelation
        fields = ('id', 'question', 'response', 'question_next', 'is_active')
