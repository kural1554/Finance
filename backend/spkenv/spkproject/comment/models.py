from django.db import models

class Comment(models.Model):
    user_name = models.CharField(max_length=100)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user_name}: {self.text[:20]}"  # Show part of the comment
