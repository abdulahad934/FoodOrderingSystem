# serializers.py - MINIMAL VERSION (Only for Add Food functionality)

from rest_framework import serializers
from .models import *


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for Category - used in dropdown"""
    
    class Meta:
        model = Category
        fields = ['id', 'category_name', 'creation_date']
        read_only_fields = ['id', 'creation_date']


class FoodItemSerializer(serializers.ModelSerializer):
    """Serializer for Food Item - used for response after adding"""
    
    category_name = serializers.CharField(source='category.category_name', read_only=True)
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Food
        fields = [
            'id',
            'category',
            'category_name',
            'item_name',
            'item_description',
            'item_price',
            'item_quantity',
            'image',
            'image_url',
            'is_available'
        ]
        read_only_fields = ['id']
    
    def get_image_url(self, obj):
        """Return full image URL"""
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None
    


class CartOrderSerializer(serializers.ModelSerializer):
    food = FoodItemSerializer()
    class Meta:
        model = Order
        fields = ['id', 'food', 'quantity']


class MyOrdersListSerializer(serializers.ModelSerializer):
    order_final_status = serializers.SerializerMethodField()
    class Meta:
        model = OrderAddress
        fields = ['order_number', 'order_time', 'order_final_status']

    
    def get_order_final_status(self, obj):
        return obj.order_final_status or "Waiting for Restaurant confirmation"
    


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'first_name',
            'last_name',
            'email',
            'phone_number',
            'reg_date'
        ]
        read_only_fields = ['id', 'email', 'phone_number', 'reg_date']



class OrderDetailSerializer(serializers.ModelSerializer):
    user_first_name = serializers.CharField(source='user.first_name')
    user_last_name = serializers.CharField(source='user.last_name')
    user_email = serializers.EmailField(source='user.email')
    user_phone_number = serializers.CharField(source='user.phone_number')
    class Meta:
        model = OrderAddress
        fields = ['order_number', 'order_time', 'order_final_status', 'address',
                   'user_first_name', 'user_last_name', 'user_email', 'user_phone_number']
        

class OrderFoodSerializer(serializers.ModelSerializer):
    item_name = serializers.CharField(source='food.item_name')
    item_price = serializers.CharField(source='food.item_price')
    image = serializers.EmailField(source='food.image')
    
    class Meta:
        model = Order
        fields = ['item_name', 'item_price', 'image']



class FoodTrackingDetailSerializer(serializers.ModelSerializer):
   
    class Meta:
        model = FoodTracking
        fields = ['remark', 'status', 'status_date', 'order_cancelled_by_user']