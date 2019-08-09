from rest_framework.generics import ListAPIView
# from shared.constants import stringToBool
from django.http import HttpResponseRedirect
from ..forms import FeedbackForm
from ..models import Feedback
from .serializers import FeedbackSerializer

class FeedbackList(ListAPIView):
    serializer_class = FeedbackSerializer
    queryset = Feedback.objects.all()
    http_method_name = 'POST'

    def post(self, request, *arg, **kwargs):
        # import ipdb;
        # ipdb.set_trace();
        fname = request.data.get('first_name')
        lname = request.data.get('last_name')
        feedback = request.data.get('feedback')
        f=Feedback(
            first_name = fname,
            last_name = lname,
            feedback = feedback,
                )
        f.save()
        return HttpResponseRedirect('apps/templates/chatbot.html')

            #something
        

