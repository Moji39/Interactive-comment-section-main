from rest_framework import serializers
from django.contrib.auth.hashers import make_password
import datetime
from ..models import(
    User,
    Comment,
    Score_hist
)
from django.core.exceptions import ObjectDoesNotExist

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('id', 'username', 'image_link', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data.pop('password'))
        return User.objects.create(**validated_data)

    def update(self, instance, validated_data):
        validated_data['password'] = make_password(validated_data.pop('password'))
        return instance.update(**validated_data)

class UserForCommentSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('id', 'username', 'image_link')

class ScoreRatingSerializer(serializers.ModelSerializer):

    class Meta:
        model = Score_hist
        fields = ('id', 'rating')

class CommentSerializer(serializers.ModelSerializer):

    score = serializers.SerializerMethodField()
    created_since = serializers.SerializerMethodField()
    comment_rating = serializers.SerializerMethodField()

    def get_score(self, obj):
        return Score_hist.objects.filter(comment=obj.id, rating=True).count() - Score_hist.objects.filter(comment=obj.id, rating=False).count()

    def get_created_since(self, obj):
        seconds = (datetime.datetime.now(datetime.timezone.utc) - Comment.objects.get(id=obj.id).created_at).total_seconds()
        years = int(seconds / (365.25*24*60*60))
        seconds -= int(years*365.25*24*60*60)
        months = int(seconds / (30.43*24*60*60))
        seconds -= int(months*30*24*60*60)
        weeks = int(seconds / (7*24*60*60))
        seconds -= int(weeks*7*24*60*60)
        days = int(seconds / (24*60*60))
        seconds -= int(days*24*60*60)
        hours = int(seconds / (60*60))
        seconds -= int(hours*60*60)
        minutes = int(seconds / 60)
        seconds -= int(minutes * 60)
        return str(years) + 'y ' + str(months) + 'm ' + str(weeks) + 'w ' + str(days) + 'd ' + str(hours) + 'h ' + str(minutes) + 'i ' + str(int(seconds)) + 's'

    def get_comment_rating(self, obj):
        user = self.context['request'].user
        if user.id != None:
            try:
                query = Score_hist.objects.get(comment=obj.id, user=user.id)
                result = ScoreRatingSerializer(query).data
                return result['rating']
            except ObjectDoesNotExist:
                return None
        return None
        
    class Meta:
        model = Comment
        exclude = ('created_at',)
        extra_fields = ('replies', 'created_since', 'comment_rating')
        read_only_fields = ('score', 'replies', 'created_since', 'comment_rating')

    def to_representation(self, instance):
        self.fields['user'] = UserForCommentSerializer(read_only=True)
        self.fields['replies'] = serializers.PrimaryKeyRelatedField(read_only=True, many=True, source='replying')
        return super(CommentSerializer, self).to_representation(instance)

    def create(self, validated_data):
        if(validated_data.get('replying_to') == None):
            return Comment.objects.create(user=User.objects.get(pk=validated_data.pop('user')), **validated_data)
        return Comment.objects.create(user=User.objects.get(pk=validated_data.pop('user')), replying_to=Comment.objects.get(pk=validated_data.pop('replying_to')), **validated_data)

class ScoreSerializer(serializers.ModelSerializer):

    class Meta:
        model = Score_hist
        fields = ('comment', 'user', 'rating')

    def create(self, validated_data):
        obj, created = Score_hist.objects.get_or_create(user=User.objects.get(pk=validated_data.get('user')), comment=Comment.objects.get(pk=validated_data.get('comment')))
        setattr(obj, 'rating', validated_data.get('rating'))
        obj.save()

class CommentContentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Comment
        fields = ('id', 'content')

    def update(self, instance, validated_data):
        setattr(instance, 'content', validated_data.get('content'))
        instance.save()