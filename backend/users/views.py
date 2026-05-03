from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
from .serializers import RegisterSerializer, UserSerializer, ForgotPasswordSerializer, ResetPasswordSerializer
from .models import CustomUser, PasswordResetToken


# Helper function: generate tokens for a user
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


# POST /api/auth/register/
class RegisterView(APIView):
    permission_classes = [AllowAny]  # anyone can register, no login needed

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'message': 'Registration successful! Wait for admin approval.',
                'user': UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        
        # If validation failed, return the errors
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# POST /api/auth/login/
class LoginView(APIView):
    permission_classes = [AllowAny]  # anyone can try to login

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        # Check if email and password were provided
        if not email or not password:
            return Response(
                {'error': 'Email and password are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if user exists and password is correct
        user = authenticate(request, username=email, password=password)

        if user is None:
            return Response(
                {'error': 'Invalid email or password.'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Check if admin has approved this account
        if not user.is_approved:
            return Response(
                {'error': 'Your account is pending admin approval.'},
                status=status.HTTP_403_FORBIDDEN
            )

        # Generate JWT tokens
        tokens = get_tokens_for_user(user)

        return Response({
            'message': 'Login successful!',
            'tokens': tokens,
            'user': UserSerializer(user).data
        }, status=status.HTTP_200_OK)


# GET /api/auth/me/
class MeView(APIView):
    permission_classes = [IsAuthenticated]  # must be logged in

    def get(self, request):
        # request.user is automatically set by JWT authentication
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


# POST /api/auth/logout/
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            token = RefreshToken(refresh_token)
            token.blacklist()  # invalidate the token
            return Response({'message': 'Logged out successfully.'})
        except Exception:
            return Response({'error': 'Invalid token.'}, status=status.HTTP_400_BAD_REQUEST)


# POST /api/auth/forgot-password/
class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]  # no login needed

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email']
        user  = CustomUser.objects.get(email=email)

        # Delete any old unused tokens for this user (clean slate)
        PasswordResetToken.objects.filter(user=user, is_used=False).delete()

        # Create a fresh reset token
        reset_token = PasswordResetToken.objects.create(user=user)

        # Build the reset link — frontend will open this page
        reset_link = f"{settings.FRONTEND_URL}/reset-password?token={reset_token.token}"

        # Send email with the reset link
        send_mail(
            subject='Campus Placement — Password Reset Request',
            message=(
                f"Hi {user.full_name},\n\n"
                f"You requested to reset your password.\n\n"
                f"Click the link below to reset it (valid for 15 minutes):\n"
                f"{reset_link}\n\n"
                f"If you did not request this, please ignore this email.\n\n"
                f"— Campus Placement Team"
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False,
        )

        return Response(
            {'message': 'Password reset link sent to your email.'},
            status=status.HTTP_200_OK
        )


# POST /api/auth/reset-password/
class ResetPasswordView(APIView):
    permission_classes = [AllowAny]  # no login needed — user is resetting because they forgot

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        token_value   = serializer.validated_data['token']
        new_password  = serializer.validated_data['password']

        # Find the token in the database
        try:
            reset_token = PasswordResetToken.objects.get(token=token_value, is_used=False)
        except PasswordResetToken.DoesNotExist:
            return Response(
                {'error': 'Invalid or expired reset link.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check token is not older than 15 minutes
        expiry_time = reset_token.created_at + timedelta(minutes=15)
        if timezone.now() > expiry_time:
            reset_token.delete()  # clean up expired token
            return Response(
                {'error': 'Reset link has expired. Please request a new one.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Set the new password
        user = reset_token.user
        user.set_password(new_password)
        user.save()

        # Mark token as used so it cannot be reused
        reset_token.is_used = True
        reset_token.save()

        return Response(
            {'message': 'Password reset successful! You can now log in.'},
            status=status.HTTP_200_OK
        )