from django.urls import path
from .views import (
    StoreDetailView, StoreListView, StoreCreateView, 
    StoreUpdateView, OrganizerStoreListView
)

urlpatterns = [
    # Organizer Routes
    path('organizer/list/', OrganizerStoreListView.as_view(), name='organizer-store-list'),
    path('create/', StoreCreateView.as_view(), name='organizer-store-create'),
    path('manage/<uuid:id>/', StoreUpdateView.as_view(), name='organizer-store-update'),

    # Public Routes
    path('', StoreListView.as_view(), name='public-store-list'),
    path('<slug:slug>/', StoreDetailView.as_view(), name='public-store-detail'),
]