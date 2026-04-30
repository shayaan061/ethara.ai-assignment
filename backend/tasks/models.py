from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL

class Task(models.Model):
    STATUS_CHOICES = (
        ('TODO', 'Todo'),
        ('IN_PROGRESS', 'In Progress'),
        ('DONE', 'Done'),
    )

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='TODO')
    assigned_to = models.ForeignKey(User, on_delete=models.CASCADE)
    project = models.ForeignKey('projects.Project', on_delete=models.CASCADE)
    due_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title