from django.db import models
from apps.vendor.models import Vendor


class AdminAction():
    pub_date = models.DateTimeField('date published')
    pub_by = models.CharField(max_length=180)
    modified_date = models.DateTimeField('date modified')
    modified_by = models.CharField(max_length=180)


class Question(AdminAction, models.Model):
    vendor = models.ForeignKey(Vendor, blank=True, null=True)
    question_text = models.TextField()
    is_first_question = models.BooleanField(
        default=False, help_text="Designates if the question is the first question in the decision tree")
    is_active = models.BooleanField(
        default=False, help_text='Designates whether a question is active or not')

    def __str__(self):
        return self.question_text
    
    #note this carefully
    @property
    def response_data(self):
        return self.quesresprelation_set.values('question_next', response_text=models.F('response__response_text'))


class Response(AdminAction, models.Model):
    vendor = models.ForeignKey(Vendor, blank=True, null=True)
    response_text = models.TextField()
    is_active = models.BooleanField(
        default=False, help_text='Designates whether a resposne is active or not')

    def __str__(self):
        return self.response_text


class QuesRespRelation(AdminAction, models.Model):
    vendor = models.ForeignKey(Vendor, blank=True, null=True)
    question = models.ForeignKey(Question, blank=True, null=True)
    response = models.ForeignKey(
        Response, related_name='quesresprelation', blank=True, null=True)
    question_next = models.ForeignKey(
        Question, related_name='questionnextrelation', blank=True, null=True)
    is_active = models.BooleanField(
        default=False, help_text='Designates whether a question resposne relation is active or not')

    def __str__(self):
        return "When '" + self.question.question_text + "' is responded by '" + self.response.response_text + "'"
