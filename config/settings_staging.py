from .settings import *

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'chatbot',
        'USER': 'root',
        'PASSWORD': 'root',
        'HOST': '',
        'PORT': '',
    },
    'master': {
        'NAME': 'chatbot',
        'ENGINE': 'django.db.backends.mysql',
        'USER': 'root',
        'PASSWORD': 'root',
        'HOST': '',
        'PORT': '',
    },
    'slave': {
        'NAME': 'chatbot',
        'ENGINE': 'django.db.backends.mysql',
        'USER': 'root',
        'PASSWORD': 'root',
        'HOST': '',
        'PORT': '',
    }
}

SITE_DOMAIN = 'https://learning1.shine.com/chatbot/'

###### STORAGE SETTINGS #############
DEFAULT_FILE_STORAGE = 'core.library.gcloud.custom_cloud_storage.GCPMediaStorage'
GS_BUCKET_NAME = 'learning-media-staging-189607'

PRIVATE_MEDIA_FILE_STORAGE = 'core.library.gcloud.custom_cloud_storage.GCPPrivateMediaStorage'
GCP_PRIVATE_MEDIA_BUCKET = 'learning--misc-staging-189607'
GCP_RESUME_BUILDER_BUCKET = 'learning--misc-staging-189607'
CRM_PRIVATE_MEDIA_BUCKET = 'learningcrm-misc-staging-189607'

COMPRESS_STORAGE = STATICFILES_STORAGE = 'core.library.gcloud.custom_cloud_storage.GCPStaticStorage'
GS_PROJECT_ID = 'shine-staging-189607'
GCP_STATIC_BUCKET = 'learning-static-staging-189607'

INVOICE_FILE_STORAGE = 'core.library.gcloud.custom_cloud_storage.GCPInvoiceStorage'
GCP_INVOICE_BUCKET = 'learning-invoices-staging-189607'

GCP_MEDIA_LOCATION = "c/m/"
GCP_STATIC_LOCATION = "c/s/"