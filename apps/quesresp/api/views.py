from rest_framework.generics import ListAPIView, RetrieveAPIView
from shared.constants import stringToBool

from ..models import Question, Response, QuesRespRelation
from .serializers import QuestionSerializer, ResponseSerializer, QuesRespRelSerializer


class QuestionList(ListAPIView):
    serializer_class = QuestionSerializer
    queryset = Question.objects.all()

    def get_queryset(self):
        vendor_id = self.kwargs['vendor_id']
        queryset = self.queryset.filter(vendor_id=vendor_id)
        ifq = self.request.GET.get("ifq", None) #ifq= if first question
        fq = self.request.GET.get("fq", None)   #fq= is feedback question
        if ifq: 
            queryset = queryset.filter(is_first_question=stringToBool.get(ifq))
        return queryset


class QuestionDetail(RetrieveAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer


class ResponseList(ListAPIView):
    serializer_class = ResponseSerializer

    def get_queryset(self):
        vendor_id = self.kwargs['vendor_id']
        question_id = self.kwargs['question_id']
        resp_ids = QuesRespRelation.objects.all().filter(
            vendor_id=vendor_id, question_id=question_id).values_list('response_id', flat=True)
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
