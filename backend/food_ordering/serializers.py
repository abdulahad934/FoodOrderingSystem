# serializers.py - MINIMAL VERSION (Only for Add Food functionality)

from rest_framework import serializers
from .models import Category, Food


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
    

