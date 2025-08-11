from rest_framework import serializers
from .. import models


class TagListField(serializers.Field):
	def to_representation(self, value):
		return [t.name for t in value.all()]

	def to_internal_value(self, data):
		if isinstance(data, list):
			return data
		raise serializers.ValidationError('Tags must be a list of strings')


class ProjectImageSerializer(serializers.ModelSerializer):
	class Meta:
		model = models.ProjectImage
		fields = ['id', 'image', 'caption', 'order']


class ProjectSerializer(serializers.ModelSerializer):
	tags = TagListField(required=False)
	images = ProjectImageSerializer(many=True, read_only=True)

	class Meta:
		model = models.Project
		fields = ['id', 'title', 'slug', 'summary', 'description', 'hero_image', 'repository_url', 'live_url', 'category', 'tags', 'order', 'featured', 'status', 'published_at', 'seo_title', 'seo_description', 'images']
		read_only_fields = ['slug', 'published_at']

	def create(self, validated_data):
		tags = validated_data.pop('tags', [])
		project = super().create(validated_data)
		if tags:
			project.tags.set(tags)
		return project

	def update(self, instance, validated_data):
		tags = validated_data.pop('tags', None)
		project = super().update(instance, validated_data)
		if tags is not None:
			project.tags.set(tags)
		return project


class BlogPostSerializer(serializers.ModelSerializer):
	tags = TagListField(required=False)

	class Meta:
		model = models.BlogPost
		fields = ['id', 'title', 'slug', 'excerpt', 'content', 'cover_image', 'category', 'tags', 'status', 'published_at', 'seo_title', 'seo_description']
		read_only_fields = ['slug', 'published_at']


class NewsItemSerializer(serializers.ModelSerializer):
	class Meta:
		model = models.NewsItem
		fields = ['id', 'title', 'slug', 'summary', 'content', 'category', 'link', 'important', 'status', 'published_at']
		read_only_fields = ['slug', 'published_at']


class ExperienceSerializer(serializers.ModelSerializer):
	class Meta:
		model = models.Experience
		fields = ['id', 'role', 'company', 'location', 'start_date', 'end_date', 'is_current', 'description']


class SkillSerializer(serializers.ModelSerializer):
	class Meta:
		model = models.Skill
		fields = ['id', 'name', 'category', 'proficiency', 'order']
