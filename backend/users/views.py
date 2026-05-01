from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import make_password

User = get_user_model()


# ✅ REGISTER
@api_view(['POST'])
def register(request):
    username = request.data.get('username')
    password = request.data.get('password')
    role = request.data.get('role', 'MEMBER')

    if not username or not password:
        return Response({"error": "Username and password required"}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({"error": "User already exists"}, status=400)

    user = User.objects.create(
        username=username,
        password=make_password(password),
        role=role
    )

    return Response({
        "message": "User created",
        "id": user.id
    })


# ✅ LOGIN
@api_view(['POST'])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = User.objects.filter(username=username).first()

    if user and user.check_password(password):
        refresh = RefreshToken.for_user(user)
        return Response({
            "access": str(refresh.access_token),
            "role": user.role
        })

    return Response({"error": "Invalid credentials"}, status=400)


# ✅ LIST USERS (PROTECTED)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_users(request):
    users = User.objects.all()

    data = [
        {
            "id": u.id,
            "username": u.username,
            "role": u.role
        }
        for u in users
    ]

    return Response(data)


# ✅ AUTO CREATE ADMIN (SAFE VERSION)
@api_view(['GET'])
def init_admin(request):
    """
    Call this ONCE from browser:
    /api/init-admin
    """
    if not User.objects.filter(username="admin").exists():
        User.objects.create_superuser(
            username="admin",
            email="admin@test.com",
            password="admin123"
        )
        return Response({"message": "Admin created"})

    return Response({"message": "Admin already exists"})