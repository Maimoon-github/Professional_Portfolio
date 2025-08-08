from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.

def index(request):
    """Portfolio home page view."""
    return HttpResponse("Welcome to the Portfolio app!")
