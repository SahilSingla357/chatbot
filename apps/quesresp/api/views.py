from rest_framework.generics import ListAPIView, RetrieveAPIView
from shared.constants import stringToBool

from apps.application.models import Application
from ..models import Question, Response, QuesRespRelation
from .serializers import QuestionSerializer, ResponseSerializer, QuesRespRelSerializer

import logging; 

import ipdb;


class QuestionList(ListAPIView):
    serializer_class = QuestionSerializer
    queryset = Question.objects.all()

    def get_queryset(self):
        application_id = self.kwargs['application_id']
        queryset = self.queryset.filter(application_id=application_id)
        ifq = self.request.GET.get("ifq", None) #ifq= if first question
        if ifq: 
            queryset = queryset.filter(is_first_question=stringToBool.get(ifq))
        return queryset


class QuestionDetail(RetrieveAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer

    def visitor_ip_address(self,request): 
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

    def get(self, request, *args, **kwargs):
        system_ip = self.visitor_ip_address(request)
        application_id = self.kwargs.get('application_id', '')
        vendor_id = Application.objects.get(id=application_id).vendor_id
        response_id = request.GET.get('resp','')
        prev_question_id = request.GET.get('lques','')
        if response_id and prev_question_id: 
            logging.getLogger('info_log').info('System Ip - {}; Vendor Id - {}; Application Id - {};Response Id\'s - {}; Prev Question Id - {}'.format(system_ip, vendor_id,application_id,response_id, prev_question_id))
        return super(QuestionDetail,self).get(request,*args, **kwargs);


class ResponseList(ListAPIView):
    serializer_class = ResponseSerializer

    def get_queryset(self):
        application_id = self.kwargs['application_id']
        question_id = self.kwargs['question_id']
        resp_ids = QuesRespRelation.objects.all().filter(
            application_id=application_id, question_id=question_id).values_list('response_id', flat=True)
        return Response.objects.filter(id__in=resp_ids)


class ResponseDetail(RetrieveAPIView):
    queryset = Response.objects.all()
    serializer_class = ResponseSerializer


class QuesRespRelList(ListAPIView):
    queryset = QuesRespRelation.objects.all()
    serializer_class = QuesRespRelSerializer


class QuesRespRelDetails(RetrieveAPIView):
    queryset = QuesRespRelation.objects.all()
    serializer_class = QuesRespRelSerializer
