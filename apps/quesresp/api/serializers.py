from rest_framework.serializers import ModelSerializer
from rest_framework import serializers

from ..models import Question, Response, QuesRespRelation


class QuestionSerializer(ModelSerializer):
    response_data = serializers.ListField()

    class Meta:
        model = Question
        fields = ('id', 'application', 'question_text', 'category', 'next_default_question_id',
                  'is_first_question', 'is_active', 'response_data')


class ResponseSerializer(ModelSerializer):

    class Meta:
        model = Response
        fields = ('id', 'application', 'response_text', 'comment', 'response_image_url',
                  'response_url', 'is_active')


class QuesRespRelSerializer(ModelSerializer):

    class Meta:
        model = QuesRespRelation
        fields = ('id', 'question', 'response', 'question_next', 'is_active')
