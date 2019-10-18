from django.contrib import admin
from .models import *


class QuesRespRelationAdmin(admin.ModelAdmin):
    models = QuesRespRelation

    def formfields_for_foriegnkey(self, db_field, request, **kwargs):
        if db_field.name == "question": 
            kwargs["queryset"] = Question.objects.filter(application_id=self.application_id)
        elif db_field.name == "response":
            kwargs["queryset"] = Response.objects.filter(application_id=self.application_id)
        elif db_field.name == "question_next":
            kwargs["queryset"] = Question.objects.filter(application_id=self.application_id)
        return super().formfields_for_foriegnkey(db_field, request, **kwargs)


admin.site.register(Question)
admin.site.register(Response)
admin.site.register(QuesRespRelation, QuesRespRelationAdmin)
# # Register your models here.
# # Register your models here.
