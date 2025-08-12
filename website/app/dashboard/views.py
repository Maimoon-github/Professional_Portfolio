from django.shortcuts import render, get_object_or_404
from django.contrib.admin.views.decorators import staff_member_required
from django.http import JsonResponse
from django.db.models import Q, Count
from django.core.paginator import Paginator
from django.utils import timezone
import json

from app.portfolio.models import (
    Project, BlogPost, NewsItem, Experience, Skill, Education,
    Category, MediaAsset, SocialLink, SiteSetting, ContactMessage
)

# Consolidated lightweight wrappers of prior dashboard_views functions

@staff_member_required
def home(request):
    total_projects = Project.objects.count()
    published_projects = Project.objects.filter(status=Project.PUBLISHED).count()
    draft_projects = Project.objects.filter(status=Project.DRAFT).count()
    featured_projects = Project.objects.filter(featured=True).count()
    total_blog_posts = BlogPost.objects.count()
    published_posts = BlogPost.objects.filter(status=BlogPost.PUBLISHED).count()
    draft_posts = BlogPost.objects.filter(status=BlogPost.DRAFT).count()
    total_news = NewsItem.objects.count()
    published_news = NewsItem.objects.filter(status=NewsItem.PUBLISHED).count()
    important_news = NewsItem.objects.filter(important=True).count()
    total_experiences = Experience.objects.count()
    current_experiences = Experience.objects.filter(is_current=True).count()
    total_skills = Skill.objects.count()
    contact_messages = ContactMessage.objects.filter(is_read=False).count()

    recent_projects = Project.objects.order_by('-created_at')[:5]
    recent_posts = BlogPost.objects.order_by('-created_at')[:5]
    recent_news = NewsItem.objects.order_by('-created_at')[:5]
    recent_messages = ContactMessage.objects.order_by('-created_at')[:5]

    from datetime import timedelta
    from django.db.models.functions import TruncMonth
    six_months_ago = timezone.now() - timedelta(days=180)
    monthly_projects = Project.objects.filter(created_at__gte=six_months_ago).annotate(month=TruncMonth('created_at')).values('month').annotate(count=Count('id')).order_by('month')
    monthly_posts = BlogPost.objects.filter(created_at__gte=six_months_ago).annotate(month=TruncMonth('created_at')).values('month').annotate(count=Count('id')).order_by('month')

    context = {
        'analytics': {
            'projects': {'total': total_projects,'published': published_projects,'draft': draft_projects,'featured': featured_projects},
            'blog_posts': {'total': total_blog_posts,'published': published_posts,'draft': draft_posts},
            'news': {'total': total_news,'published': published_news,'important': important_news},
            'experiences': {'total': total_experiences,'current': current_experiences},
            'skills': {'total': total_skills},
            'messages': {'unread': contact_messages}
        },
        'recent_activity': {'projects': recent_projects,'posts': recent_posts,'news': recent_news,'messages': recent_messages},
        'monthly_data': {'projects': list(monthly_projects),'posts': list(monthly_posts)}
    }
    return render(request, 'portfolio/dashboard/home.html', context)

@staff_member_required
def projects(request):
    view_type = request.GET.get('view', 'grid')
    status_filter = request.GET.get('status', 'all')
    category_filter = request.GET.get('category', 'all')
    search_query = request.GET.get('q', '')
    qs = Project.objects.select_related('category').prefetch_related('tags')
    if status_filter != 'all':
        qs = qs.filter(status=status_filter)
    if category_filter != 'all':
        qs = qs.filter(category_id=category_filter)
    if search_query:
        qs = qs.filter(Q(title__icontains=search_query) | Q(summary__icontains=search_query) | Q(description__icontains=search_query))
    qs = qs.order_by('order', '-created_at')
    paginator = Paginator(qs, 12 if view_type == 'grid' else 20)
    page_obj = paginator.get_page(request.GET.get('page'))
    categories = Category.objects.filter(projects__isnull=False).distinct()
    return render(request, 'portfolio/dashboard/projects.html', {
        'projects': page_obj,'view_type': view_type,'status_filter': status_filter,'category_filter': category_filter,'search_query': search_query,'categories': categories,'status_choices': Project.STATUS_CHOICES,
    })

@staff_member_required
def blog(request):
    status_filter = request.GET.get('status', 'all')
    category_filter = request.GET.get('category', 'all')
    search_query = request.GET.get('q', '')
    posts = BlogPost.objects.select_related('category', 'author').prefetch_related('tags')
    if status_filter != 'all':
        posts = posts.filter(status=status_filter)
    if category_filter != 'all':
        posts = posts.filter(category_id=category_filter)
    if search_query:
        posts = posts.filter(Q(title__icontains=search_query) | Q(excerpt__icontains=search_query) | Q(content__icontains=search_query))
    posts = posts.order_by('-created_at')
    paginator = Paginator(posts, 20)
    page_obj = paginator.get_page(request.GET.get('page'))
    categories = Category.objects.filter(blog_posts__isnull=False).distinct()
    return render(request, 'portfolio/dashboard/blog.html', {'posts': page_obj,'status_filter': status_filter,'category_filter': category_filter,'search_query': search_query,'categories': categories,'status_choices': BlogPost.STATUS_CHOICES})

@staff_member_required
def experience(request):
    experiences = Experience.objects.order_by('-is_current', '-start_date')
    skills = Skill.objects.order_by('order', 'category')
    education = Education.objects.order_by('-start_year')
    skill_categories = {}
    for skill in skills:
        skill_categories.setdefault(skill.category or 'Other', []).append(skill)
    return render(request, 'portfolio/dashboard/experience.html', {'experiences': experiences,'skill_categories': skill_categories,'education': education})

@staff_member_required
def news(request):
    status_filter = request.GET.get('status', 'all')
    search_query = request.GET.get('q', '')
    items = NewsItem.objects.select_related('category', 'author')
    if status_filter != 'all':
        items = items.filter(status=status_filter)
    if search_query:
        items = items.filter(Q(title__icontains=search_query) | Q(summary__icontains=search_query) | Q(content__icontains=search_query))
    items = items.order_by('-created_at')
    paginator = Paginator(items, 20)
    page_obj = paginator.get_page(request.GET.get('page'))
    return render(request, 'portfolio/dashboard/news.html', {'news_items': page_obj,'status_filter': status_filter,'search_query': search_query,'status_choices': NewsItem.STATUS_CHOICES})

@staff_member_required
def media(request):
    file_type_filter = request.GET.get('type', 'all')
    search_query = request.GET.get('q', '')
    assets = MediaAsset.objects.all()
    if file_type_filter != 'all':
        assets = assets.filter(file_type=file_type_filter)
    if search_query:
        assets = assets.filter(Q(title__icontains=search_query) | Q(description__icontains=search_query) | Q(file__icontains=search_query))
    assets = assets.order_by('-created_at')
    paginator = Paginator(assets, 24)
    page_obj = paginator.get_page(request.GET.get('page'))
    return render(request, 'portfolio/dashboard/media.html', {'media_assets': page_obj,'file_type_filter': file_type_filter,'search_query': search_query,'file_type_choices': MediaAsset.TYPE_CHOICES})

@staff_member_required
def settings_view(request):
    site_setting, _ = SiteSetting.objects.get_or_create(pk=1)
    social_links = SocialLink.objects.order_by('order')
    categories = Category.objects.order_by('name')
    return render(request, 'portfolio/dashboard/settings.html', {'site_setting': site_setting,'social_links': social_links,'categories': categories})

@staff_member_required
def messages_view(request):
    status_filter = request.GET.get('status', 'all')
    search_query = request.GET.get('q', '')
    qs = ContactMessage.objects.all()
    if status_filter == 'unread':
        qs = qs.filter(is_read=False)
    elif status_filter == 'read':
        qs = qs.filter(is_read=True)
    if search_query:
        qs = qs.filter(Q(name__icontains=search_query) | Q(email__icontains=search_query) | Q(subject__icontains=search_query) | Q(message__icontains=search_query))
    qs = qs.order_by('-created_at')
    paginator = Paginator(qs, 20)
    page_obj = paginator.get_page(request.GET.get('page'))
    return render(request, 'portfolio/dashboard/messages.html', {'messages': page_obj,'status_filter': status_filter,'search_query': search_query})

@staff_member_required
def analytics(request):
    from datetime import timedelta
    from django.db.models.functions import TruncDay, TruncWeek, TruncMonth
    date_range = request.GET.get('range', '30')
    if date_range == '7':
        start_date = timezone.now() - timedelta(days=7)
        trunc_func = TruncDay
    elif date_range == '30':
        start_date = timezone.now() - timedelta(days=30)
        trunc_func = TruncDay
    elif date_range == '90':
        start_date = timezone.now() - timedelta(days=90)
        trunc_func = TruncWeek
    else:
        start_date = timezone.now() - timedelta(days=365)
        trunc_func = TruncMonth
    project_trends = Project.objects.filter(created_at__gte=start_date).annotate(period=trunc_func('created_at')).values('period').annotate(count=Count('id')).order_by('period')
    blog_trends = BlogPost.objects.filter(created_at__gte=start_date).annotate(period=trunc_func('created_at')).values('period').annotate(count=Count('id')).order_by('period')
    project_categories = Project.objects.filter(category__isnull=False).values('category__name').annotate(count=Count('id')).order_by('-count')[:10]
    blog_categories = BlogPost.objects.filter(category__isnull=False).values('category__name').annotate(count=Count('id')).order_by('-count')[:10]
    return render(request, 'portfolio/dashboard/analytics.html', {'date_range': date_range,'trends': {'projects': list(project_trends),'blog_posts': list(blog_trends)},'categories': {'projects': list(project_categories),'blog_posts': list(blog_categories)}})

# AJAX endpoints
@staff_member_required
def toggle_project_featured(request, project_id):
    if request.method == 'POST':
        project = get_object_or_404(Project, id=project_id)
        project.featured = not project.featured
        project.save()
        return JsonResponse({'success': True,'featured': project.featured})
    return JsonResponse({'success': False})

@staff_member_required
def toggle_project_status(request, project_id):
    if request.method == 'POST':
        project = get_object_or_404(Project, id=project_id)
        if project.status == Project.DRAFT:
            project.publish()
        else:
            project.status = Project.DRAFT
            project.save()
        return JsonResponse({'success': True,'status': project.status,'status_display': project.get_status_display()})
    return JsonResponse({'success': False})

@staff_member_required
def mark_message_read(request, message_id):
    if request.method == 'POST':
        msg = get_object_or_404(ContactMessage, id=message_id)
        msg.is_read = not msg.is_read
        msg.save()
        return JsonResponse({'success': True,'is_read': msg.is_read})
    return JsonResponse({'success': False})

@staff_member_required
def bulk_action(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        action = data.get('action')
        content_type = data.get('content_type')
        item_ids = data.get('item_ids', [])
        if not action or not content_type or not item_ids:
            return JsonResponse({'success': False,'error': 'Missing required parameters'})
        if content_type == 'project':
            model = Project
        elif content_type == 'blog':
            model = BlogPost
        elif content_type == 'news':
            model = NewsItem
        else:
            return JsonResponse({'success': False,'error': 'Invalid content type'})
        qs = model.objects.filter(id__in=item_ids)
        try:
            if action == 'publish':
                for item in qs:
                    item.publish()
            elif action == 'draft':
                qs.update(status=model.DRAFT)
            elif action == 'delete':
                qs.delete()
            elif action == 'feature' and content_type == 'project':
                qs.update(featured=True)
            elif action == 'unfeature' and content_type == 'project':
                qs.update(featured=False)
            return JsonResponse({'success': True,'affected_count': len(item_ids)})
        except Exception as e:
            return JsonResponse({'success': False,'error': str(e)})
    return JsonResponse({'success': False})
