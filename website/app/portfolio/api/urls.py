from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('projects', views.ProjectViewSet)
router.register('blog-posts', views.BlogPostViewSet)
router.register('news', views.NewsItemViewSet)
router.register('experience', views.ExperienceViewSet)
router.register('skills', views.SkillViewSet)

urlpatterns = router.urls
