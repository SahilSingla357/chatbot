# -*- coding: utf-8 -*-
# Generated by Django 1.11.8 on 2019-07-16 06:07
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('vendor', '0001_initial'),
        ('quesresp', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='response',
            name='vendor',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='vendor.Vendor'),
        ),
        migrations.AddField(
            model_name='question',
            name='vendor',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='vendor.Vendor'),
        ),
        migrations.AddField(
            model_name='quesresprelation',
            name='question',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='quesresp.Question'),
        ),
        migrations.AddField(
            model_name='quesresprelation',
            name='question_next',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='questionnextrelation', to='quesresp.Question'),
        ),
        migrations.AddField(
            model_name='quesresprelation',
            name='response',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='quesresprelation', to='quesresp.Response'),
        ),
        migrations.AddField(
            model_name='quesresprelation',
            name='vendor',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='vendor.Vendor'),
        ),
    ]
