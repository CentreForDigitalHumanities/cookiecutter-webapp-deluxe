from dj_rest_auth.serializers import UserDetailsSerializer
from rest_framework import serializers


class CustomUserDetailsSerializer(UserDetailsSerializer):

    class Meta(UserDetailsSerializer.Meta):
        is_staff = serializers.BooleanField(read_only=True)
        fields = (
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "is_staff",
        )
        read_only_fields = ["is_staff", "id", "email"]
