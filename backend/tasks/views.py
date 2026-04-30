from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Task
from datetime import date


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_task(request):
    task = Task.objects.create(
        title=request.data['title'],
        description=request.data.get('description', ''),
        assigned_to_id=request.data['assigned_to'],
        project_id=request.data['project_id'],
        due_date=request.data['due_date']
    )
    return Response({"message": "Task created"})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard(request):
    tasks = Task.objects.all()

    total = tasks.count()
    completed = tasks.filter(status="DONE").count()
    overdue = tasks.filter(due_date__lt=date.today()).exclude(status="DONE").count()

    return Response({
        "total": total,
        "completed": completed,
        "overdue": overdue
    })