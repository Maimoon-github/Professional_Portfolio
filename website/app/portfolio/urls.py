from django.urls import path, include
from . import views

app_name = 'portfolio'

urlpatterns = [
    path('', views.index, name='index'),
    path('projects/', views.project_list, name='project_list'),
    path('projects/<slug:slug>/', views.project_detail, name='project_detail'),
    path('blog/', views.blog_list, name='blog_list'),
    path('blog/<slug:slug>/', views.blog_detail, name='blog_detail'),
    path('news/<slug:slug>/', views.news_detail, name='news_detail'),
    path('experience/', views.experience, name='experience'),
    path('news/', views.news, name='news'),
    path('contact/', views.contact, name='contact'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('api/', include('app.portfolio.api.urls')),
]
