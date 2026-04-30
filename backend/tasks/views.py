from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Task
from datetime import date


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_task(request):
    try:
        task = Task.objects.create(
            title=request.data['title'],
            description=request.data.get('description', ''),
            assigned_to_id=request.data['assigned_to'],
            project_id=request.data['project_id'],
            due_date=request.data['due_date']
        )
        return Response({"message": "Task created"})
    except Exception as e:
        return Response({"error": str(e)}, status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard(request):
    tasks = Task.objects.select_related('project', 'assigned_to').all()

    total = tasks.count()
    completed = tasks.filter(status="DONE").count()
    overdue = tasks.filter(due_date__lt=date.today()).exclude(status="DONE").count()

    task_list = [
        {
            "id": task.id,
            "title": task.title,
            "status": task.status,
            "project": task.project.title,
            "assigned_to": task.assigned_to.username,
            "due_date": task.due_date,
        }
        for task in tasks
    ]

    return Response({
        "total": total,
        "completed": completed,
        "overdue": overdue,
        "tasks": task_list
    })