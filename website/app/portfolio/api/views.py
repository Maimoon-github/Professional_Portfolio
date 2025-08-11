from rest_framework import viewsets, permissions, filters
from .. import models
from . import serializers


class StaffOrReadOnly(permissions.BasePermission):
	def has_permission(self, request, view):
		if request.method in permissions.SAFE_METHODS:
			return True
		return request.user and request.user.is_staff


class ProjectViewSet(viewsets.ModelViewSet):
	queryset = models.Project.objects.all().select_related('category').prefetch_related('tags')
	serializer_class = serializers.ProjectSerializer
	permission_classes = [StaffOrReadOnly]
	filter_backends = [filters.SearchFilter, filters.OrderingFilter]
	search_fields = ['title', 'summary', 'description']
	ordering_fields = ['published_at', 'order', 'title']
	ordering = ['order', '-published_at']


class BlogPostViewSet(viewsets.ModelViewSet):
	queryset = models.BlogPost.objects.all().select_related('category').prefetch_related('tags')
	serializer_class = serializers.BlogPostSerializer
	permission_classes = [StaffOrReadOnly]
	filter_backends = [filters.SearchFilter, filters.OrderingFilter]
	search_fields = ['title', 'excerpt', 'content']
	ordering_fields = ['published_at', 'title']
	ordering = ['-published_at']


class NewsItemViewSet(viewsets.ModelViewSet):
	queryset = models.NewsItem.objects.all().select_related('category')
	serializer_class = serializers.NewsItemSerializer
	permission_classes = [StaffOrReadOnly]
	filter_backends = [filters.SearchFilter, filters.OrderingFilter]
	search_fields = ['title', 'summary', 'content']
	ordering_fields = ['published_at', 'important']
	ordering = ['-published_at']


class ExperienceViewSet(viewsets.ModelViewSet):
	queryset = models.Experience.objects.all()
	serializer_class = serializers.ExperienceSerializer
	permission_classes = [StaffOrReadOnly]
	filter_backends = [filters.OrderingFilter]
	ordering = ['-start_date']


class SkillViewSet(viewsets.ModelViewSet):
	queryset = models.Skill.objects.all()
	serializer_class = serializers.SkillSerializer
	permission_classes = [StaffOrReadOnly]
	filter_backends = [filters.OrderingFilter]
	ordering = ['order']
