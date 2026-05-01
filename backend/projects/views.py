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


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_project(request, pk):
    try:
        project = Project.objects.get(id=pk)
        if request.user.role != "ADMIN":
            return Response({"error": "Forbidden"}, status=403)

        project.title = request.data.get('title', project.title)
        project.save()

        return Response({"message": "Project updated"})
    except Project.DoesNotExist:
        return Response({"error": "Not found"}, status=404)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_projects(request):
    if request.user.role == "ADMIN":
        projects = Project.objects.all()
    else:
        projects = Project.objects.all()  # TEMP for demo
    data = [
        {
            "id": p.id,
            "title": p.title
        }
        for p in projects
    ]
    return Response(data)