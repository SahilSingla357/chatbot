
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'chatbot',
        'USER': 'root',
        'PASSWORD': 'admin',
        'HOST': '',
        'PORT': '',
    },
    'master': {
        'NAME': 'chatbot',
        'ENGINE': 'django.db.backends.mysql',
        'USER': 'root',
        'PASSWORD': 'admin',
        'HOST': '',
        'PORT': '',
    },
    'slave': {
        'NAME': 'chatbot',
        'ENGINE': 'django.db.backends.mysql',
        'USER': 'root',
        'PASSWORD': 'admin',
        'HOST': '',
        'PORT': '',
    }
}

