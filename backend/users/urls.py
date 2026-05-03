from django.urls import path
from .views import RegisterView, LoginView, MeView, LogoutView, ForgotPasswordView, ResetPasswordView

urlpatterns = [
    path('register/',       RegisterView.as_view(),       name='register'),
    path('login/',          LoginView.as_view(),          name='login'),
    path('me/',             MeView.as_view(),             name='me'),
    path('logout/',         LogoutView.as_view(),         name='logout'),

    # Forgot password — user submits their email, receives reset link
    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot-password'),

    # Reset password — user submits token + new password
    path('reset-password/',  ResetPasswordView.as_view(),  name='reset-password'),
]