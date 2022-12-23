from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    username = models.CharField(max_length=50, unique=True)
    password = models.CharField(max_length=250)
    image_link = models.CharField(max_length=50)
    USERNAME_FIELD = 'username'

class Comment(models.Model):
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True, auto_now=False)
    score = models.ManyToManyField(User, through='Score_hist', through_fields=('comment', 'user'))
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user')
    replying_to = models.ForeignKey('self', blank=True, null=True, on_delete=models.CASCADE, related_name='replying')

class Score_hist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE)
    rating = models.BooleanField(blank=True, null=True)