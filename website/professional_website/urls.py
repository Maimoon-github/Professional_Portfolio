"""
URL configuration for professional_website project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

# from django.contrib import admin
# from django.urls import path, include
# from django.conf import settings
# from django.conf.urls.static import static

# urlpatterns = [
#     path('admin/', admin.site.urls),
#     path('portfolio/', include('app.portfolio.urls')),  # This line correctly includes your app's URLs
#     # ... any other main project URLs
# ]

# if settings.DEBUG:
#     urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)





from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import RedirectView, TemplateView
from app.portfolio import views as portfolio_views

"""Consolidated project URLConf.

Fixes prior duplication where a second urlpatterns list overwrote the first,
removing the dashboard namespace and causing NoReverseMatch in templates.
"""

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),

    # Auth (login/logout/password reset views)
    path('accounts/', include('django.contrib.auth.urls')),

    # Public portfolio app (namespaced "portfolio")
    path('portfolio/', include('app.portfolio.urls')),

    # Dashboard removed - using Django admin interface instead

    # Root path serves portfolio landing
    path('', portfolio_views.index, name='portfolio_landing'),

    # Service worker (served as template so Django can deliver at root URL path)
    path('sw.js', TemplateView.as_view(template_name='sw.js', content_type='application/javascript'), name='service_worker'),

    # Favicon root request redirect -> existing image (avoid 404 in dev). Swap to real favicon later.
    path('favicon.ico', RedirectView.as_view(url=settings.STATIC_URL + 'media/images/ff359f387545394ba70c7f8049001d6e.jpg', permanent=False)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)