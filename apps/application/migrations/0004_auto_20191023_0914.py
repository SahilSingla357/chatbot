# -*- coding: utf-8 -*-
# Generated by Django 1.11.8 on 2019-10-23 09:14
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('application', '0003_application_end_url'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='application',
            name='script',
        ),
        migrations.AddField(
            model_name='application',
            name='script_link',
            field=models.URLField(blank=True, help_text='link to the chatbot js scirpt', null=True),
        ),
    ]
