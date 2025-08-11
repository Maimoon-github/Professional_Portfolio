from django.db import models
from django.utils import timezone
from django.utils.text import slugify
from django.contrib.auth import get_user_model
from simple_history.models import HistoricalRecords
from taggit.managers import TaggableManager

User = get_user_model()


class TimeStampedModel(models.Model):
	"""Abstract base model adding created/updated timestamps."""
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		abstract = True


class PublishableModel(TimeStampedModel):
	"""Adds draft/published status and publication date for preview workflow."""
	DRAFT = 'draft'
	PUBLISHED = 'published'
	STATUS_CHOICES = [
		(DRAFT, 'Draft'),
		(PUBLISHED, 'Published'),
	]
	status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=DRAFT, db_index=True)
	published_at = models.DateTimeField(null=True, blank=True, help_text="Auto-set when status changes to Published if empty")

	class Meta:
		abstract = True

	def publish(self):
		self.status = self.PUBLISHED
		if not self.published_at:
			self.published_at = timezone.now()
		self.save()


class Category(models.Model):
	name = models.CharField(max_length=100, unique=True)
	slug = models.SlugField(max_length=120, unique=True, blank=True)

	class Meta:
		verbose_name_plural = 'Categories'
		ordering = ['name']

	def __str__(self):
		return self.name

	def save(self, *args, **kwargs):
		if not self.slug:
			self.slug = slugify(self.name)
		super().save(*args, **kwargs)


class Skill(TimeStampedModel):
	name = models.CharField(max_length=100)
	proficiency = models.PositiveSmallIntegerField(default=0, help_text="Percentage 0-100")
	category = models.CharField(max_length=100, blank=True)
	order = models.PositiveIntegerField(default=0, help_text="Ordering priority")
	history = HistoricalRecords()

	class Meta:
		ordering = ['order', 'name']
		unique_together = ('name', 'category')

	def __str__(self):
		return f"{self.name} ({self.proficiency}%)"


class Experience(TimeStampedModel):
	role = models.CharField(max_length=150)
	company = models.CharField(max_length=150)
	location = models.CharField(max_length=150, blank=True)
	start_date = models.DateField()
	end_date = models.DateField(null=True, blank=True)
	is_current = models.BooleanField(default=False)
	description = models.TextField(blank=True)
	order = models.PositiveIntegerField(default=0)
	history = HistoricalRecords()

	class Meta:
		ordering = ['-is_current', '-start_date']

	def __str__(self):
		return f"{self.role} - {self.company}"


class Education(TimeStampedModel):
	institution = models.CharField(max_length=150)
	degree = models.CharField(max_length=150)
	field_of_study = models.CharField(max_length=150, blank=True)
	start_year = models.PositiveIntegerField()
	end_year = models.PositiveIntegerField(null=True, blank=True)
	description = models.TextField(blank=True)
	order = models.PositiveIntegerField(default=0)
	history = HistoricalRecords()

	class Meta:
		ordering = ['-start_year']

	def __str__(self):
		return f"{self.degree} - {self.institution}"


class Project(PublishableModel):
	title = models.CharField(max_length=200)
	slug = models.SlugField(max_length=220, unique=True, blank=True)
	summary = models.CharField(max_length=300, blank=True)
	description = models.TextField(blank=True)
	hero_image = models.ImageField(upload_to='projects/hero/', blank=True, null=True)
	repository_url = models.URLField(blank=True)
	live_url = models.URLField(blank=True)
	category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='projects')
	tags = TaggableManager(blank=True)
	order = models.PositiveIntegerField(default=0)
	featured = models.BooleanField(default=False)
	author = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL)
	seo_title = models.CharField(max_length=70, blank=True)
	seo_description = models.CharField(max_length=160, blank=True)
	history = HistoricalRecords()

	class Meta:
		ordering = ['order', '-published_at', 'title']

	def __str__(self):
		return self.title

	def save(self, *args, **kwargs):
		if not self.slug:
			self.slug = slugify(self.title)
		if self.status == self.PUBLISHED and not self.published_at:
			self.published_at = timezone.now()
		super().save(*args, **kwargs)

	def get_absolute_url(self):
		from django.urls import reverse
		return reverse('portfolio:project_detail', args=[self.slug])


class ProjectImage(TimeStampedModel):
	project = models.ForeignKey(Project, related_name='images', on_delete=models.CASCADE)
	image = models.ImageField(upload_to='projects/gallery/')
	caption = models.CharField(max_length=200, blank=True)
	order = models.PositiveIntegerField(default=0)

	class Meta:
		ordering = ['order']

	def __str__(self):
		return f"Image for {self.project.title}"


class BlogPost(PublishableModel):
	title = models.CharField(max_length=200)
	slug = models.SlugField(max_length=220, unique=True, blank=True)
	excerpt = models.CharField(max_length=300, blank=True)
	content = models.TextField()
	cover_image = models.ImageField(upload_to='blog/covers/', blank=True, null=True)
	category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='blog_posts')
	tags = TaggableManager(blank=True)
	author = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL)
	seo_title = models.CharField(max_length=70, blank=True)
	seo_description = models.CharField(max_length=160, blank=True)
	history = HistoricalRecords()

	class Meta:
		ordering = ['-published_at', 'title']

	def __str__(self):
		return self.title

	def save(self, *args, **kwargs):
		if not self.slug:
			self.slug = slugify(self.title)
		if self.status == self.PUBLISHED and not self.published_at:
			self.published_at = timezone.now()
		super().save(*args, **kwargs)

	def get_absolute_url(self):
		from django.urls import reverse
		return reverse('portfolio:blog_detail', args=[self.slug])


class NewsItem(PublishableModel):
	"""Short news / update items."""
	title = models.CharField(max_length=200)
	slug = models.SlugField(max_length=220, unique=True, blank=True)
	summary = models.CharField(max_length=300, blank=True)
	content = models.TextField(blank=True)
	category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='news_items')
	link = models.URLField(blank=True)
	important = models.BooleanField(default=False, help_text="Mark to highlight on home page")
	author = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL)
	history = HistoricalRecords()

	class Meta:
		ordering = ['-published_at', '-created_at']

	def __str__(self):
		return self.title

	def save(self, *args, **kwargs):
		if not self.slug:
			self.slug = slugify(self.title)
		if self.status == self.PUBLISHED and not self.published_at:
			self.published_at = timezone.now()
		super().save(*args, **kwargs)

	def get_absolute_url(self):
		from django.urls import reverse
		return reverse('portfolio:news_detail', args=[self.slug])


class MediaAsset(TimeStampedModel):
	FILE_IMAGE = 'image'
	FILE_DOCUMENT = 'document'
	TYPE_CHOICES = [
		(FILE_IMAGE, 'Image'),
		(FILE_DOCUMENT, 'Document/PDF'),
	]
	file = models.FileField(upload_to='media_assets/%Y/%m/')
	file_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default=FILE_IMAGE)
	title = models.CharField(max_length=200, blank=True)
	alt_text = models.CharField(max_length=200, blank=True)
	description = models.TextField(blank=True)
	history = HistoricalRecords()

	def __str__(self):
		return self.title or self.file.name


class SocialLink(TimeStampedModel):
	platform = models.CharField(max_length=100)
	url = models.URLField()
	icon = models.CharField(max_length=50, blank=True, help_text="CSS class or icon key")
	order = models.PositiveIntegerField(default=0)
	history = HistoricalRecords()

	class Meta:
		ordering = ['order']
		unique_together = ('platform', 'url')

	def __str__(self):
		return self.platform


class SiteSetting(models.Model):
	"""Singleton style key/value settings for site-wide metadata."""
	site_name = models.CharField(max_length=200, default='My Portfolio')
	tagline = models.CharField(max_length=250, blank=True)
	logo = models.ImageField(upload_to='branding/', blank=True, null=True)
	favicon = models.ImageField(upload_to='branding/', blank=True, null=True)
	meta_description = models.CharField(max_length=160, blank=True)
	google_analytics_id = models.CharField(max_length=30, blank=True)
	contact_email = models.EmailField(blank=True)
	history = HistoricalRecords()

	class Meta:
		verbose_name = 'Site Setting'
		verbose_name_plural = 'Site Settings'

	def __str__(self):
		return 'Site Settings'


class ContactMessage(TimeStampedModel):
	name = models.CharField(max_length=150)
	email = models.EmailField()
	subject = models.CharField(max_length=200)
	message = models.TextField()
	is_read = models.BooleanField(default=False)
	history = HistoricalRecords()

	class Meta:
		ordering = ['-created_at']

	def __str__(self):
		return f"Message from {self.name}: {self.subject}"

