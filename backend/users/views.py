from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

@api_view(['POST'])
def register(request):
    user = User.objects.create_user(
        username=request.data['username'],
        password=request.data['password'],
        role=request.data.get('role', 'MEMBER')
    )
    return Response({"message": "User created"})


@api_view(['POST'])
def login(request):
    user = User.objects.filter(username=request.data['username']).first()

    if user and user.check_password(request.data['password']):
        refresh = RefreshToken.for_user(user)
        return Response({
            "access": str(refresh.access_token),
            "role": user.role
        })

    return Response({"error": "Invalid credentials"}, status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_users(request):
    users = User.objects.all()
    data = [
        {
            "id": u.id,
            "username": u.username
        }
        for u in users
    ]
    return Response(data)