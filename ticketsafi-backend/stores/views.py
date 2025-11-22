from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Store
from .serializers import StoreSerializer
from events.models import Event
from events.serializers import EventListSerializer
from django.utils import timezone

# --- ORGANIZER MANAGEMENT VIEWS ---

class OrganizerStoreListView(generics.ListAPIView):
    """ Lists all stores owned by the logged-in organizer """
    serializer_class = StoreSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Store.objects.filter(organizer=self.request.user)

class StoreCreateView(generics.CreateAPIView):
    """ Create a new store """
    queryset = Store.objects.all()
    serializer_class = StoreSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # REMOVED: The check restricting one store per user
        serializer.save(organizer=self.request.user)

class StoreUpdateView(generics.RetrieveUpdateDestroyAPIView):
    """ Update/Delete a specific store by UUID """
    queryset = Store.objects.all()
    serializer_class = StoreSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id' # Changed from default logic to explicit ID lookup

    def get_queryset(self):
        return Store.objects.filter(organizer=self.request.user)

# --- PUBLIC VIEWS ---

class StoreListView(generics.ListAPIView):
    """ Public list of all stores """
    queryset = Store.objects.all().order_by('name')
    serializer_class = StoreSerializer

class StoreDetailView(generics.RetrieveAPIView):
    """ Public store page with events """
    queryset = Store.objects.all()
    serializer_class = StoreSerializer
    lookup_field = 'slug'

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        
        # Fetch events linked to THIS specific store
        events = Event.objects.filter(
            store=instance, # CHANGED: Filter by store, not just organizer
            is_published=True,
            end_datetime__gt=timezone.now()
        ).order_by('start_datetime')
        
        event_serializer = EventListSerializer(events, many=True, context={'request': request})
        
        data = serializer.data
        data['events'] = event_serializer.data
        return Response(data)