# -*- coding: utf-8 -*-
# Generated by Django 1.11.8 on 2019-10-14 10:07
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('vendor', '0005_auto_20191011_0627'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='vendor',
            name='chatbot_image',
        ),
        migrations.RemoveField(
            model_name='vendor',
            name='chatbot_title',
        ),
        migrations.RemoveField(
            model_name='vendor',
            name='is_active',
        ),
        migrations.RemoveField(
            model_name='vendor',
            name='script',
        ),
    ]
