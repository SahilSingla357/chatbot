#import django
from django.db import models
from django.utils.translation import ugettext_lazy as _
from django.conf import settings
from django.db.models.signals import post_save

from jsmin import jsmin
import htmlmin
from cssmin import cssmin

def generate_script(pk):
    path_to_js = settings.MEDIA_ROOT + "/script.html"
    path_to_html = settings.MEDIA_ROOT + "/basic.html"
    path_to_css = settings.MEDIA_ROOT + "/style.css"

    file_js = open(path_to_js,"r")
    file_html = open(path_to_html,"r")
    file_css = open(path_to_css,"r")

    text_js = file_js.read()
    text_html = file_html.read()
    text_html = htmlmin.minify(text_html)
    text_css = file_css.read()
    text_css = cssmin(text_css)

    text_js = text_js.replace("HTML_CODE",text_html)
    text_js = text_js.replace("CSS_CODE",text_css)
    text_js = text_js.replace("VENDOR_ID",str(pk))

    minified = jsmin(text_js)

    return minified



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
    script = models.TextField(_('Script'), blank=True)
    is_active = models.BooleanField(
        default=False, help_text='Designates whether a vendor is active or not')

    self_save = False
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.self_save == False:
            self.script = generate_script(self.pk)
            self.self_save = True
            super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class VendorHierarchy(models.Model):
    vendee = models.ForeignKey(Vendor)
    employee = models.ForeignKey(settings.AUTH_USER_MODEL)
    is_active = models.BooleanField(
        default=False, help_text='Designates whether a vendor hierarchy is active or not')
