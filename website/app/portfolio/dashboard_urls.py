"""
Dashboard URL patterns for Professional Portfolio
Modern admin dashboard with comprehensive content management
"""
from django.urls import path
from . import dashboard_views

app_name = 'dashboard'

urlpatterns = [
    # Main dashboard
    path('', dashboard_views.dashboard_home, name='home'),
    
    # Content management sections
    path('projects/', dashboard_views.project_management, name='projects'),
    path('blog/', dashboard_views.blog_management, name='blog'),
    path('experience/', dashboard_views.experience_management, name='experience'),
    path('news/', dashboard_views.news_management, name='news'),
    path('media/', dashboard_views.media_library, name='media'),
    path('settings/', dashboard_views.settings_management, name='settings'),
    path('messages/', dashboard_views.messages_management, name='messages'),
    path('analytics/', dashboard_views.analytics_dashboard, name='analytics'),
    
    # AJAX endpoints
    path('ajax/project/<int:project_id>/toggle-featured/', 
         dashboard_views.toggle_project_featured, name='toggle_project_featured'),
    path('ajax/project/<int:project_id>/toggle-status/', 
         dashboard_views.toggle_project_status, name='toggle_project_status'),
    path('ajax/message/<int:message_id>/mark-read/', 
         dashboard_views.mark_message_read, name='mark_message_read'),
    path('ajax/bulk-action/', dashboard_views.bulk_action, name='bulk_action'),
]
