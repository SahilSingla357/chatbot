from django.db import models
from apps.vendor.models import Vendor
from config import settings
from apps.core.library.gcloud.custom_cloud_storage import GCPMediaStorage


from jsmin import jsmin
import htmlmin
from cssmin import cssmin

import os

def generate_script(pk, logo_path, title, greeting_message, end_message):

    path_to_js = settings.MEDIA_ROOT + "/script.js"
    path_to_html = settings.MEDIA_ROOT + "/basic.html"
    path_to_css = settings.MEDIA_ROOT + "/style.css"

    file_js = open(path_to_js, "r")
    file_html = open(path_to_html, "r")
    file_css = open(path_to_css, "r")

    text_js = file_js.read()
    text_js = text_js.replace("SITE_DOMAIN",settings.SITE_DOMAIN)
    text_js = text_js.replace("GREETING_MESSAGE",greeting_message)
    text_js = text_js.replace("END_MESSAGE",end_message) #fix it 
    text_html = file_html.read()
    text_html = text_html.replace("CHATBOT_TITLE", title)
    text_html = htmlmin.minify(text_html)
    text_css = file_css.read()
    text_css = text_css.replace("LOGO_PATH", logo_path)
    text_css = cssmin(text_css)

    text_js = text_js.replace("HTML_CODE", text_html)
    text_js = text_js.replace("CSS_CODE", text_css)
    text_js = text_js.replace("APP_ID", str(pk))

    minified = jsmin(text_js)

    return minified

def path_and_rename(instance, filename):
    upload_to = 'chatbotImage/'
    ext = filename.split('.')[-1]
    if instance.pk:
        filename = '{}.{}'.format(instance.application_name,ext)
    return os.path.join(upload_to,filename) 

class Application(models.Model):
    application_name = models.CharField(max_length=100, unique=True)
    vendor = models.ForeignKey(Vendor)
    chatbot_icon = models.ImageField(upload_to=path_and_rename, blank=True, null=True)
    chatbot_title = models.CharField(max_length=100, help_text="title of the chatbot", 
        blank=True, null=True)
    end_url = models.URLField(max_length=300, help_text="url to send request to the vendor", blank=True, null=True)
    greeting_message = models.TextField(blank=True, null=True)
    end_message = models.TextField(blank=True, null=True)
    script = models.TextField(blank=True)
    is_active = models.BooleanField(
        default=False, help_text='Designates whether a vendor is active or not')

    self_save = False
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.self_save == False:
            js_script = generate_script(self.pk, settings.SITE_DOMAIN+self.chatbot_icon.url[1:], 
                self.chatbot_title, self.greeting_message, self.end_message)
            vendor = self.vendor.get('name','')
            filename = vendor+'_'+self.application_name
            GCPMediaStorage().save('chatbot/' + filename, js_script)
            self.script = js_script
            self.self_save = True
            super().save(*args, **kwargs)


    def __str__(self):
        return self.application_name