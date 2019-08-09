from django import forms

class FeedbackForm(forms.Form):
    first_name = forms.CharField(
        max_length=100,
        widget=forms.TextInput(attrs={
            "class":"form-control",
            "placeholder":"First name"
            })
        )
    last_name = forms.CharField(
        max_length=100,
        widget=forms.TextInput(attrs={
            "class":"form-control",
            "placeholder":"last name"
            })
        )
    Feedback = forms.CharField(
        widget=forms.Textarea(
        attrs={
             "class":"form-control",
             "placeholder":"enter your feedback here"
        })
        )