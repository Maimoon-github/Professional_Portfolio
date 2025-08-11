from django.shortcuts import render, get_object_or_404
from django.contrib.admin.views.decorators import staff_member_required
from django.db.models import Q
from .models import Project, BlogPost, NewsItem, Experience as ExperienceModel, Skill

# Create your views here.

def index(request):
    """Primary portfolio landing page with dynamic content sections."""
    projects = Project.objects.filter(status=Project.PUBLISHED, featured=True)[:3]
    posts = BlogPost.objects.filter(status=BlogPost.PUBLISHED)[:3]
    news_items = NewsItem.objects.filter(status=NewsItem.PUBLISHED).order_by('-published_at')[:5]
    return render(request, 'portfolio/index.html', {
        'featured_projects': projects,
        'recent_posts': posts,
        'latest_news': news_items,
    })


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


def experience(request):
    experiences = ExperienceModel.objects.all().order_by('-is_current', '-start_date')
    skills = Skill.objects.all().order_by('order')
    return render(request, 'portfolio/experience.html', {'experiences': experiences, 'skills': skills})


def news(request):
    qs = NewsItem.objects.filter(status=NewsItem.PUBLISHED)
    if request.user.is_staff and request.GET.get('all') == '1':
        qs = NewsItem.objects.all()
    search = request.GET.get('q')
    if search:
        qs = qs.filter(Q(title__icontains=search) | Q(summary__icontains=search) | Q(content__icontains=search))
    return render(request, 'portfolio/news.html', {'news_list': qs, 'search_query': search})


def news_detail(request, slug):
    if request.user.is_staff and request.GET.get('preview') == '1':
        item = get_object_or_404(NewsItem, slug=slug)
    else:
        item = get_object_or_404(NewsItem, slug=slug, status=NewsItem.PUBLISHED)
    return render(request, 'portfolio/news_detail.html', {'item': item})


def contact(request):
    """Contact page view."""
    return render(request, 'portfolio/contact.html')


@staff_member_required
def dashboard(request):
    """Simple dashboard summarising counts."""
    return render(request, 'portfolio/dashboard.html', {
        'project_count': Project.objects.count(),
        'blog_count': BlogPost.objects.count(),
        'news_count': NewsItem.objects.count(),
        'recent_projects': Project.objects.order_by('-created_at')[:5] if hasattr(Project, 'created_at') else Project.objects.order_by('-id')[:5],
        'recent_posts': BlogPost.objects.order_by('-published_at')[:5] if hasattr(BlogPost, 'published_at') else BlogPost.objects.order_by('-id')[:5],
        'recent_news': NewsItem.objects.order_by('-published_at')[:5] if hasattr(NewsItem, 'published_at') else NewsItem.objects.order_by('-id')[:5],
    })
