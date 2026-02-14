# urls.py
from django.urls import path
from .views import *

urlpatterns = [
    path('admin-login/', admin_login_api),
    path('add-category/', add_category),
    path('categories/', list_categories),
    
    # Food related
    path('foods/', list_foods),
    path('foods/<int:id>/', food_detail),  # Detail view (plural)
    path('food/<int:id>/', food_detail),   # ✅ Added singular alias
    
    path("add-food-item/", add_food_item),
    path("food_search/", food_search),
    path("random_foods/", random_foods),
    
    # Auth
    path("register/", register_User),
    path("login/", user_login),
]