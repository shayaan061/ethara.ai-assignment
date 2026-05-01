from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Task
from projects.models import Project
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


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_task(request, pk):
    try:
        task = Task.objects.get(id=pk)
        user = request.user

        # ✅ Permission check
        if user.role != "ADMIN" and task.assigned_to != user:
            return Response({"error": "Not allowed"}, status=403)

        # ✅ Only allow status change
        task.status = request.data.get('status', task.status)
        task.save()

        return Response({"message": "Task updated"})

    except Task.DoesNotExist:
        return Response({"error": "Not found"}, status=404)


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

    project_list = [
        {
            "id": project.id,
            "title": project.title
        }
        for project in Project.objects.all()
    ]

    return Response({
        "total": total,
        "completed": completed,
        "overdue": overdue,
        "tasks": task_list,
        "projects": project_list
    })