#import django
from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.conf import settings
from django.db.models.signals import post_save

from jsmin import jsmin
import htmlmin
from cssmin import cssmin

import os

# def generate_script(pk, image_url, title):

#     logo_path = image_url[1:]

#     path_to_js = settings.MEDIA_ROOT + "/script2.js"
#     path_to_html = settings.MEDIA_ROOT + "/basic.html"
#     path_to_css = settings.MEDIA_ROOT + "/style.css"

#     file_js = open(path_to_js, "r")
#     file_html = open(path_to_html, "r")
#     file_css = open(path_to_css, "r")

#     text_js = file_js.read()
#     text_html = file_html.read()
#     text_html = text_html.replace("CHATBOT_TITLE", title)
#     text_html = htmlmin.minify(text_html)
#     text_css = file_css.read()
#     text_css = text_css.replace("LOGO_PATH", logo_path)
#     text_css = cssmin(text_css)

#     text_js = text_js.replace("HTML_CODE", text_html)
#     text_js = text_js.replace("CSS_CODE", text_css)
#     text_js = text_js.replace("VENDOR_ID", str(pk))

#     minified = jsmin(text_js)

#     return minified

def path_and_rename(instance, filename):
    upload_to = 'chatbotImage/'
    ext = filename.split('.')[-1]
    if instance.pk:
        filename = '{}.{}'.format(instance.name,ext)
    return os.path.join(upload_to,filename) 
    

class Vendor(models.Model):
    name = models.CharField(
        _('Name'), max_length=100,
        unique=True,
        help_text=_('Unique name going to decide the slug'))
    email = models.EmailField(
        _('Email'),
        max_length=255, help_text=_('Email Address'))
    mobile = models.CharField(
        _('Mobile Number'), blank=True,
        max_length=20, help_text=_('Mobile Number'))

    def __str__(self):
        return self.name


class VendorHierarchy(models.Model):
    vendee = models.ForeignKey(Vendor)
    employee = models.ForeignKey(settings.AUTH_USER_MODEL)
    is_active = models.BooleanField(
        default=False, help_text='Designates whether a vendor hierarchy is active or not')
