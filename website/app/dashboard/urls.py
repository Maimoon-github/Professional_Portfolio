from django.urls import path
from . import views

app_name = 'dashboard'

urlpatterns = [
    path('', views.home, name='home'),
    path('projects/', views.projects, name='projects'),
    path('blog/', views.blog, name='blog'),
    path('experience/', views.experience, name='experience'),
    path('news/', views.news, name='news'),
    path('media/', views.media, name='media'),
    path('settings/', views.settings_view, name='settings'),
    path('messages/', views.messages_view, name='messages'),
    path('analytics/', views.analytics, name='analytics'),
    # ajax endpoints
    path('ajax/project/<int:project_id>/toggle-featured/', views.toggle_project_featured, name='toggle_project_featured'),
    path('ajax/project/<int:project_id>/toggle-status/', views.toggle_project_status, name='toggle_project_status'),
    path('ajax/message/<int:message_id>/mark-read/', views.mark_message_read, name='mark_message_read'),
    path('ajax/bulk-action/', views.bulk_action, name='bulk_action'),
]
