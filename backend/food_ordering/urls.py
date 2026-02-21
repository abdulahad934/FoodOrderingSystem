# urls.py
from django.urls import path
from .views import *

urlpatterns = [
    path('admin-login/', admin_login_api),
    path('add-category/', add_category),
    path('categories/', list_categories),
    path('foods/', list_foods),
    path('foods/<int:id>/', food_detail), 
    path('food/<int:id>/', food_detail),
    path("cart/<int:user_id>/", get_cart_items),
    path('cart/add/', add_to_cart),   
    path("add-food-item/", add_food_item),
    path("food_search/", food_search),
    path("random_foods/", random_foods),
    path("register/", register_User),
    path("login/", user_login),
    path("place_order/", place_order),
    path("orders/<int:user_id>/", user_orders),

    path('orders/by_order_number/<str:order_number>/', get_order_by_number),
    path('order-address/<str:order_number>/', get_order_address),
    path('payment-details/<str:order_number>/', get_payment_details),
    path('invoice/<str:order_number>/', get_invoice),
    path("user/<int:user_id>/", get_user_profile),
    path('user/update/<int:user_id>/', update_user_profile),
    path('change-password/<int:user_id>/', change_password),
    path('orders-not-confirmed/', get_orders_not_confirmed),
    path('orders-confirmed/', orders_confirmed),
    path('food_being_prepared/', food_being_prepared),
    path('foodpickup/', food_pickup),
    path('orders-delivered/', food_delivered),
    path('order-cancelled/', order_cancelled),
    path('all-foods/', all_orders),
    path('order_between_dates/', order_between_dates),
    path('view-order-details/<str:order_number>/', view_order_details),
    path('update-order-status/<str:order_number>/', update_order_status),
    path('registered-users/', registered_users),
   
    
]