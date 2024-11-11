# vse_backend/models.py
from django.db import models
from django.utils.text import slugify

class TeamMember(models.Model):
    ROLE_CHOICES = [
        ('CO_PRES', 'Co-President'),
        ('MEMBER', 'Member'),
        ('ADVISOR', 'Advisor'),
    ]

    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    image = models.ImageField(upload_to='team_photos/', null=True, blank=True)
    about = models.TextField(blank=True)
    github = models.URLField(blank=True)
    linkedin = models.URLField(blank=True)
    email = models.EmailField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['role', 'name']

    def __str__(self):
        return f"{self.name} - {self.get_role_display()}"

class ProjectIdea(models.Model):
    STATUS_CHOICES = [
        ('NEW', 'New'),
        ('REVIEWING', 'Under Review'),
        ('ACCEPTED', 'Accepted'),
        ('REJECTED', 'Rejected'),
    ]

    name = models.CharField(max_length=100)
    email = models.EmailField()
    project_title = models.CharField(max_length=200)
    description = models.TextField()
    document = models.FileField(upload_to='project_docs/', null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='NEW')
    admin_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.project_title} by {self.name}"