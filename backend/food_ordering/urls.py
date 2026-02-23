from django.urls import path
from .views import *

urlpatterns = [
    # ========== ADMIN ==========
    path('admin-login/', admin_login_api, name='admin_login'),
    
    # ========== CATEGORY ==========
    path('add-category/', add_category, name='add_category'),
    path('categories/', list_categories, name='list_categories'),
    path('category/<int:id>/', category_detail, name='category_detail'),
    
    # ========== FOOD ==========
    path('add-food-item/', add_food_item, name='add_food_item'),
    path('foods/', list_foods, name='list_foods'),
    path('food/<int:id>/', food_detail, name='food_detail'),
    path('food/update/<int:id>/', update_food_item, name='update_food_item'),  # ✅ NEW
    path('food/delete/<int:id>/', delete_food_item, name='delete_food_item'),  # ✅ NEW
    path('food_search/', food_search, name='food_search'),
    path('random_foods/', random_foods, name='random_foods'),
    
    # ========== USER AUTH ==========
    path('register/', register_User, name='register_user'),
    path('login/', user_login, name='user_login'),
    
    # ========== USER PROFILE ==========
    path('user/<int:user_id>/', get_user_profile, name='get_user_profile'),
    path('user/update/<int:user_id>/', update_user_profile, name='update_user_profile'),
    path('change-password/<int:user_id>/', change_password, name='change_password'),
    path('registered-users/', registered_users, name='registered_users'),
    
    # ========== CART ==========
    path('cart/<int:user_id>/', get_cart_items, name='get_cart_items'),
    path('cart/add/', add_to_cart, name='add_to_cart'),
    
    # ========== ORDERS ==========
    path('place_order/', place_order, name='place_order'),
    path('orders/<int:user_id>/', user_orders, name='user_orders'),
    path('orders/by_order_number/<str:order_number>/', get_order_by_number, name='get_order_by_number'),
    path('order-address/<str:order_number>/', get_order_address, name='get_order_address'),
    path('payment-details/<str:order_number>/', get_payment_details, name='get_payment_details'),
    
    # ========== ADMIN ORDER MANAGEMENT ==========
    path('orders-not-confirmed/', get_orders_not_confirmed, name='orders_not_confirmed'),
    path('orders-confirmed/', orders_confirmed, name='orders_confirmed'),
    path('food_being_prepared/', food_being_prepared, name='food_being_prepared'),
    path('foodpickup/', food_pickup, name='food_pickup'),
    path('orders-delivered/', food_delivered, name='orders_delivered'),
    path('order-cancelled/', order_cancelled, name='order_cancelled'),
    path('all-orders/', all_orders, name='all_orders'),
    path('search-orders/', search_orders, name='search_orders'),
    path('view-order-details/<str:order_number>/', view_order_details, name='view_order_details'),
    path('update-order-status/<str:order_number>/', update_order_status, name='update_order_status'),
    path('orders/confirm/<str:order_number>/', confirm_order, name='confirm_order'),
    path('orders/reject/<str:order_number>/', reject_order, name='reject_order'),
    path('order_between_dates/', order_between_dates, name='order_between_dates'),
    
    # ========== INVOICE ==========
    path('invoice/<str:order_number>/', get_invoice, name='get_invoice'),
]
