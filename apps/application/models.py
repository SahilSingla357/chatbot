from django.db import models
from apps.vendor.models import Vendor
from config import settings
from apps.core.library.gcloud.custom_cloud_storage import GCPMediaStorage
from django.core.files.uploadedfile import UploadedFile

from jsmin import jsmin
import htmlmin
from cssmin import cssmin

import os

def generate_script(pk, logo_path, title, greeting_message, end_message):

    sprite_path = settings.MEDIA_URL+'/sprite.png' 

    path_to_js = settings.MEDIA_URL + "/script.js"
    path_to_html = settings.MEDIA_URL + "/basic.html"
    path_to_css = settings.MEDIA_URL + "/style.css"

    file_js = open(path_to_js, "r")
    file_html = open(path_to_html, "r")
    file_css = open(path_to_css, "r")

    text_js = file_js.read()
    text_js = text_js.replace("DESKTOP_SITE_DOMAIN",settings.DESKTOP_SITE_DOMAIN)
    text_js = text_js.replace("MOBILE_SITE_DOMAIN",settings.MOBILE_SITE_DOMAIN)
    text_js = text_js.replace("GREETING_MESSAGE",greeting_message)
    text_js = text_js.replace("END_MESSAGE",end_message) #fix it 
    text_html = file_html.read()
    text_html = text_html.replace("CHATBOT_TITLE", title)
    text_html = htmlmin.minify(text_html)
    text_css = file_css.read()
    text_css = text_css.replace("LOGO_PATH", logo_path)
    text_css = text_css.replace("SPRITE_PATH", sprite_path)
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
            js_script = generate_script(self.pk, self.chatbot_icon.url, 
                self.chatbot_title, self.greeting_message, self.end_message)
            v_name = self.vendor.name
            v_name = v_name.replace(' ','_')
            v_name = v_name.lower()
            filename = v_name+'_'+self.application_name+'.js'
            filename = filename.replace(' ','_')
            filename = filename.lower()
            f=open(filename,"wb+")
            f.write(str.encode(js_script))
            # js_script = UploadedFile(js_script)
            if settings.IS_GCP:
                GCPMediaStorage().save('chatbot/' + filename, f);
            f.close();

            self.script = js_script
            self.self_save = True
            super().save(*args, **kwargs)


    def __str__(self):
        return self.application_name