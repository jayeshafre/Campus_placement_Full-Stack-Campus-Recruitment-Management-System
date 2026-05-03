from rest_framework import serializers
from .models import CustomUser


# Used when REGISTERING a new user
class RegisterSerializer(serializers.ModelSerializer):

    # Extra field — not stored, just used to confirm password match
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['email', 'full_name', 'role', 'password', 'password2']
        extra_kwargs = {
            'password': {'write_only': True}  # never send password back in response
        }

    def validate(self, data):
        # Check passwords match
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Passwords do not match.")
        
        # Check valid role
        if data['role'] not in ['student', 'recruiter']:
            raise serializers.ValidationError("Role must be student or recruiter.")
        
        return data

    def create(self, validated_data):
        # Remove password2 before creating user (it's not a model field)
        validated_data.pop('password2')
        
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            full_name=validated_data['full_name'],
            role=validated_data['role'],
        )
        return user


# Used when returning user info (safe — no password)
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'full_name', 'role', 'is_approved', 'created_at']


# Used when user submits their email for password reset
class ForgotPasswordSerializer(serializers.Serializer):

    # Only need the email to find the user account
    email = serializers.EmailField()

    def validate_email(self, value):
        # Check if a user with this email actually exists
        if not CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("No account found with this email.")
        return value


# Used when user submits new password after clicking reset link
class ResetPasswordSerializer(serializers.Serializer):

    # The UUID token from the reset link
    token     = serializers.UUIDField()

    # New password fields
    password  = serializers.CharField(write_only=True, min_length=8)
    password2 = serializers.CharField(write_only=True)

    def validate(self, data):
        # Check both passwords match
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Passwords do not match.")
        return data