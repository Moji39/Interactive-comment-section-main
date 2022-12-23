from django.urls import path
from .views import (
    MyTokenObtainPairView,
    UsersView,
    UserView,
    CommentsView,
    CommentView,
    ScoreView,
    NextIdView,
)
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('users/', UsersView.as_view()),
    path('user/<int:pk>/', UserView.as_view()),
    path('comments/', CommentsView.as_view()),
    path('comment/<int:pk>/', CommentView.as_view()),
    path('score/', ScoreView.as_view()),
    path('nextId/', NextIdView.as_view())
]
