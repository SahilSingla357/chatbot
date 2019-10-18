from django.db import models
from apps.vendor.models import Vendor
from apps.application.models import Application

from .config import RESPONSE_TYPE_CHOICES
from config import settings


class AdminAction():
    pub_date = models.DateTimeField('date published')
    pub_by = models.CharField(max_length=180)
    modified_date = models.DateTimeField('date modified')
    modified_by = models.CharField(max_length=180)


class Question(AdminAction, models.Model):
    application = models.ForeignKey(Application, blank=True, null=True)
    question_text = models.TextField()
    is_first_question = models.BooleanField(
        default=False, 
        help_text="Designates if the question is the first question in the decision tree")
    category = models.PositiveIntegerField(
        default=1, choices=RESPONSE_TYPE_CHOICES , help_text=('type of response to be stored'))
    next_default_question = models.ForeignKey("self", blank=True, null=True)
    is_active = models.BooleanField(
        default=False, help_text='Designates whether a question is active or not')

    def __str__(self):
        return self.question_text
    
    #note this carefully
    @property
    def response_data(self):
        fields_to_fetch = ['response_text','comment','response_image_url','response_url','send_user_info']
        all_further_responses = QuesRespRelation.objects.filter(question_id=self.id)
        d = []
        for response in all_further_responses:
            res = Response.objects.get(id=response.response_id)
            di = {key:getattr(res,key,"") for key in fields_to_fetch}
            di.update({'question_next':response.question_next_id})
            di.update({'response_id':response.response_id})
            d.append(di)
        return d



class Response(AdminAction, models.Model):
    application = models.ForeignKey(Application, blank=True, null=True)
    response_text = models.TextField()
    comment = models.TextField(blank=True, null=True, help_text ='used to show comment per response if available')
    response_image = models.ImageField(upload_to='images/', blank=True, null=True)
    response_url = models.URLField(max_length=300, blank=True, null=True)
    is_active = models.BooleanField(
        default=False, help_text='Designates whether a resposne is active or not')
    send_user_info = models.BooleanField(
        default=False, help_text='Designates whether the response_message sends request to vendor or not')

    @property
    def response_image_url(self):
        if self.response_image.name:
            return settings.MEDIA_ROOT+self.response_image.url[6:]
        return None

    def __str__(self):
        return self.response_text


class QuesRespRelation(AdminAction, models.Model):
    application = models.ForeignKey(Application, blank=True, null=True)
    question = models.ForeignKey(Question, blank=True, null=True)
    response = models.ForeignKey(
        Response, related_name='quesresprelation', blank=True, null=True)
    question_next = models.ForeignKey(
        Question, related_name='questionnextrelation', blank=True, null=True)
    is_active = models.BooleanField(
        default=False, help_text='Designates whether a question resposne relation is active or not')

    def __str__(self):
        return "When '" + self.question.question_text + "' is responded by '" + self.response.response_text + "'"

