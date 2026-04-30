from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL

class Project(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    members = models.ManyToManyField(User, related_name="projects")

    def __str__(self):
        return self.title