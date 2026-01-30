# serializers.py - CORRECT VERSION (after model fix)

from rest_framework import serializers
from .models import Category, Food


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for Category model"""
    
    class Meta:
        model = Category
        fields = ['id', 'category_name', 'creation_date']
        read_only_fields = ['id', 'creation_date']


class FoodItemSerializer(serializers.ModelSerializer):
    """Serializer for Food model with category details"""
    
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
    
    def validate_item_price(self, value):
        """Validate that price is positive"""
        if value <= 0:
            raise serializers.ValidationError("Price must be greater than 0")
        return value
    
    def validate_item_name(self, value):
        """Validate item name is not empty"""
        if not value or not value.strip():
            raise serializers.ValidationError("Item name cannot be empty")
        return value.strip()


class FoodItemCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating food items"""
    
    class Meta:
        model = Food
        fields = [
            'category',
            'item_name',
            'item_description',
            'item_price',
            'item_quantity',
            'image',
            'is_available'
        ]
    
    def validate(self, data):
        """Custom validation"""
        if data.get('item_price') and data['item_price'] <= 0:
            raise serializers.ValidationError({
                'item_price': 'Price must be greater than 0'
            })
        
        if not data.get('item_name', '').strip():
            raise serializers.ValidationError({
                'item_name': 'Item name cannot be empty'
            })
        
        if not data.get('category'):
            raise serializers.ValidationError({
                'category': 'Category is required'
            })
        
        return data
    
    def create(self, validated_data):
        """Create food item"""
        return Food.objects.create(**validated_data)
    
    def update(self, instance, validated_data):
        """Update food item"""
        instance.category = validated_data.get('category', instance.category)
        instance.item_name = validated_data.get('item_name', instance.item_name)
        instance.item_description = validated_data.get('item_description', instance.item_description)
        instance.item_price = validated_data.get('item_price', instance.item_price)
        instance.item_quantity = validated_data.get('item_quantity', instance.item_quantity)
        instance.is_available = validated_data.get('is_available', instance.is_available)
        
        if 'image' in validated_data:
            instance.image = validated_data['image']
        
        instance.save()
        return instance