from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status
from django.shortcuts import get_object_or_404
from ..models import (
    User,
    Comment
)
from .seriaizers import (
    UserSerializer,
    CommentSerializer,
    ScoreSerializer,
    CommentContentSerializer
)
from .permissions import IsOwnerOrReadOnly
from rest_framework.permissions import (
    IsAuthenticatedOrReadOnly,
    AllowAny
)

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['username'] = user.username
        token['image_link'] = user.image_link

        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class UsersView(APIView):

    permission_classes = (AllowAny, )

    def get(self, request):
        queryset = User.objects.all()
        serializer = UserSerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid(raise_exception=ValueError):
            serializer.create(validated_data=request.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.error_messages, status=status.HTTP_400_BAD_REQUEST)

class UserView(APIView):

    def put(self, request, pk=None):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid(raise_exception=ValueError):
            user = User.objects.filter(pk=pk)
            serializer.update(instance=user, validated_data=request.data)
            return Response(serializer.data)
        return Response(serializer.error_messages, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk=None):
        queryset = User.objects.all()
        user = get_object_or_404(queryset, pk=pk)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class CommentsView(APIView):

    permission_classes = (IsAuthenticatedOrReadOnly, )

    def get(self, request):
        queryset = Comment.objects.all().order_by('id')
        serializer = CommentSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid(raise_exception=ValueError):
            serializer.create(validated_data=request.data)
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.error_messages, status=status.HTTP_400_BAD_REQUEST)

class CommentView(APIView):

    permission_classes = (IsOwnerOrReadOnly, )

    def put(self, request, pk=None):
        serializer = CommentContentSerializer(data=request.data)
        if serializer.is_valid(raise_exception=ValueError):
            queryset = Comment.objects.all()
            comment = get_object_or_404(queryset, pk=pk)
            serializer.update(instance=comment, validated_data=request.data)
            return Response(status=status.HTTP_206_PARTIAL_CONTENT)
        return Response(serializer.error_messages, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk=None):
        queryset = Comment.objects.all()
        comment = get_object_or_404(queryset, pk=pk)
        comment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class ScoreView(APIView):

    permission_classes = (IsAuthenticatedOrReadOnly, )

    def post(self, request):
        serializer = ScoreSerializer(data=request.data)
        if serializer.is_valid(raise_exception=ValueError):
            serializer.create(validated_data=request.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.error_messages, status=status.HTTP_400_BAD_REQUEST)

class NextIdView(APIView):

    permission_classes = (IsAuthenticatedOrReadOnly, )

    def get(self, request):
        from django.db import connection
        cursor = connection.cursor()
        cursor.execute( "SELECT last_value + 1 FROM base_comment_id_seq")
        res = cursor.fetchone()
        cursor.close()
        return Response({'id': res[0]}, status=status.HTTP_200_OK)