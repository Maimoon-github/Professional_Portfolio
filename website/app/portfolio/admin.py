from django.contrib import admin
from django.utils.html import format_html
from . import models


class ProjectImageInline(admin.TabularInline):
	model = models.ProjectImage
	extra = 1
	fields = ('image', 'caption', 'order', 'preview')
	readonly_fields = ('preview',)

	def preview(self, obj):
		if obj.image:
			return format_html('<img src="{}" style="height:60px;" />', obj.image.url)
		return ''


@admin.register(models.Project)
class ProjectAdmin(admin.ModelAdmin):
	list_display = ('title', 'status', 'featured', 'category', 'published_at', 'order')
	list_filter = ('status', 'featured', 'category', 'tags')
	search_fields = ('title', 'summary', 'description')
	prepopulated_fields = {"slug": ("title",)}
	inlines = [ProjectImageInline]
	autocomplete_fields = ('category', 'author')
	ordering = ('order', '-published_at')
	actions = ['make_published', 'make_draft', 'mark_featured', 'unmark_featured']
	fieldsets = (
		(None, {"fields": ("title", "slug", "summary", "description", "hero_image", "category", "tags", "order", "featured")}),
		("Publication", {"fields": ("status", "published_at", "author")}),
		("Links", {"fields": ("repository_url", "live_url")}),
		("SEO", {"classes": ("collapse",), "fields": ("seo_title", "seo_description")}),
	)

	@admin.action(description="Publish selected projects")
	def make_published(self, request, queryset):
		for obj in queryset:
			obj.publish()

	@admin.action(description="Move selected to draft")
	def make_draft(self, request, queryset):
		queryset.update(status=models.Project.DRAFT)

	@admin.action(description="Mark as featured")
	def mark_featured(self, request, queryset):
		queryset.update(featured=True)

	@admin.action(description="Unmark featured")
	def unmark_featured(self, request, queryset):
		queryset.update(featured=False)


@admin.register(models.BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
	list_display = ('title', 'status', 'category', 'published_at')
	list_filter = ('status', 'category', 'tags')
	search_fields = ('title', 'excerpt', 'content')
	prepopulated_fields = {"slug": ("title",)}
	autocomplete_fields = ('category', 'author')
	actions = ['make_published', 'make_draft']
	fieldsets = (
		(None, {"fields": ("title", "slug", "excerpt", "content", "cover_image", "category", "tags")}),
		("Publication", {"fields": ("status", "published_at", "author")}),
		("SEO", {"classes": ("collapse",), "fields": ("seo_title", "seo_description")}),
	)

	@admin.action(description="Publish selected posts")
	def make_published(self, request, queryset):
		for obj in queryset:
			obj.publish()

	@admin.action(description="Move selected to draft")
	def make_draft(self, request, queryset):
		queryset.update(status=models.BlogPost.DRAFT)


@admin.register(models.NewsItem)
class NewsItemAdmin(admin.ModelAdmin):
	list_display = ('title', 'status', 'important', 'category', 'published_at')
	list_filter = ('status', 'important', 'category')
	search_fields = ('title', 'summary', 'content')
	prepopulated_fields = {"slug": ("title",)}
	autocomplete_fields = ('category', 'author')
	actions = ['make_published', 'make_draft', 'mark_important', 'unmark_important']
	fieldsets = (
		(None, {"fields": ("title", "slug", "summary", "content", "category", "link", "important")}),
		("Publication", {"fields": ("status", "published_at", "author")}),
	)

	@admin.action(description="Publish selected news")
	def make_published(self, request, queryset):
		for obj in queryset:
			obj.publish()

	@admin.action(description="Move selected to draft")
	def make_draft(self, request, queryset):
		queryset.update(status=models.NewsItem.DRAFT)

	@admin.action(description="Mark important")
	def mark_important(self, request, queryset):
		queryset.update(important=True)

	@admin.action(description="Unmark important")
	def unmark_important(self, request, queryset):
		queryset.update(important=False)


@admin.register(models.Skill)
class SkillAdmin(admin.ModelAdmin):
	list_display = ('name', 'category', 'proficiency', 'order')
	list_editable = ('proficiency', 'order')
	search_fields = ('name', 'category')
	list_filter = ('category',)


@admin.register(models.Experience)
class ExperienceAdmin(admin.ModelAdmin):
	list_display = ('role', 'company', 'start_date', 'end_date', 'is_current')
	list_filter = ('company', 'is_current')
	search_fields = ('role', 'company', 'description')


@admin.register(models.Education)
class EducationAdmin(admin.ModelAdmin):
	list_display = ('degree', 'institution', 'start_year', 'end_year')
	search_fields = ('degree', 'institution', 'field_of_study')


@admin.register(models.MediaAsset)
class MediaAssetAdmin(admin.ModelAdmin):
	list_display = ('title', 'file_type', 'file', 'created_at')
	list_filter = ('file_type',)
	search_fields = ('title', 'alt_text', 'description', 'file')


@admin.register(models.SocialLink)
class SocialLinkAdmin(admin.ModelAdmin):
	list_display = ('platform', 'url', 'order')
	list_editable = ('order',)
	search_fields = ('platform', 'url')
	ordering = ('order',)


@admin.register(models.SiteSetting)
class SiteSettingAdmin(admin.ModelAdmin):
	fieldsets = (
		(None, {"fields": ("site_name", "tagline", "logo", "favicon")}),
		("Meta", {"fields": ("meta_description", "google_analytics_id")}),
		("Contact", {"fields": ("contact_email",)}),
	)

	def has_add_permission(self, request):
		# Enforce singleton (only one settings row)
		if models.SiteSetting.objects.exists():
			return False
		return super().has_add_permission(request)


@admin.register(models.ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
	list_display = ('subject', 'name', 'email', 'created_at', 'is_read')
	list_filter = ('is_read', 'created_at')
	search_fields = ('name', 'email', 'subject', 'message')
	actions = ['mark_read']

	@admin.action(description="Mark selected messages as read")
	def mark_read(self, request, queryset):
		queryset.update(is_read=True)


@admin.register(models.Category)
class CategoryAdmin(admin.ModelAdmin):
	prepopulated_fields = {"slug": ("name",)}
	search_fields = ('name',)
	list_display = ('name', 'slug')

