from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from .models import Project, BlogPost

# Create your views here.

def index(request):
    """Portfolio home page view."""
    return HttpResponse("Welcome to the Portfolio app!")


def project_list(request):
    qs = Project.objects.filter(status=Project.PUBLISHED)
    if request.user.is_staff and request.GET.get('all') == '1':
        qs = Project.objects.all()
    return render(request, 'portfolio/project_list.html', {'projects': qs})


def project_detail(request, slug):
    if request.user.is_staff and request.GET.get('preview') == '1':
        project = get_object_or_404(Project, slug=slug)
    else:
        project = get_object_or_404(Project, slug=slug, status=Project.PUBLISHED)
    return render(request, 'portfolio/project_detail.html', {'project': project})


def blog_list(request):
    qs = BlogPost.objects.filter(status=BlogPost.PUBLISHED)
    if request.user.is_staff and request.GET.get('all') == '1':
        qs = BlogPost.objects.all()
    return render(request, 'portfolio/blog_list.html', {'posts': qs})


def blog_detail(request, slug):
    if request.user.is_staff and request.GET.get('preview') == '1':
        post = get_object_or_404(BlogPost, slug=slug)
    else:
        post = get_object_or_404(BlogPost, slug=slug, status=BlogPost.PUBLISHED)
    return render(request, 'portfolio/blog_detail.html', {'post': post})
