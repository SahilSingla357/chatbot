from apps.vendor.models import Vendor
from django.db.models.signals import post_save
# from django.dispatch import receiver

def generate_script(sender, instance):
    import ipdb;
    ipdb.set_trace();
    

post_save.connect(generate_script,sender=Vendor)