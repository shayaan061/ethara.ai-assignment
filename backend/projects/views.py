from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Project

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_project(request):
    if request.user.role != "ADMIN":
        return Response({"error": "Only admin can create project"}, status=403)

    project = Project.objects.create(
        title=request.data['title'],
        description=request.data.get('description', ''),
        created_by=request.user
    )

    return Response({"id": project.id, "message": "Project created"})