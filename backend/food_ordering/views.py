from django.shortcuts import render
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework import status
from .models import *
from .serializers import *


@api_view(['POST'])
def admin_login_api(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)

    if user is not None and user.is_staff:
        return Response({"message": "Login successful", "username": username}, status=200)
    return Response({"message": "Invalid Credentials"}, status=401)


@api_view(['POST'])
def add_category(request):
    category_name = request.data.get('category_name')

    if not category_name:
        return Response({"message": "Category name is required"}, status=400)

    Category.objects.create(category_name=category_name)
    return Response({"message": "Category has been created"}, status=201)


@api_view(['GET'])
def list_categories(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def add_food_item(request):
    """
    Add a new food item
    POST /api/add-food-item/
    """
    try:
        # Get data from request
        category_id = request.data.get('category')
        item_name = request.data.get('item_name')
        item_description = request.data.get('item_description')
        item_price = request.data.get('item_price')
        item_quantity = request.data.get('item_quantity')
        image = request.FILES.get('image')
        
        # Validation
        if not all([category_id, item_name, item_description, item_price, item_quantity]):
            return Response(
                {"message": "All fields are required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if category exists
        try:
            category = Category.objects.get(id=category_id)
        except Category.DoesNotExist:
            return Response(
                {"message": "Category not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Validate price
        try:
            price = float(item_price)
            if price <= 0:
                return Response(
                    {"message": "Price must be greater than 0"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except ValueError:
            return Response(
                {"message": "Invalid price format"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create food item
        food_item = Food.objects.create(
            category=category,
            item_name=item_name.strip(),
            item_description=item_description.strip(),
            item_price=price,
            item_quantity=item_quantity.strip(),
            image=image
        )
        
        # Serialize and return response
        serializer = FoodItemSerializer(food_item, context={'request': request})
        
        return Response(
            {
                "message": "Food item added successfully!",
                "data": serializer.data
            },
            status=status.HTTP_201_CREATED
        )
    
    except Exception as e:
        return Response(
            {
                "message": "Failed to add food item",
                "error": str(e)
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def list_food_items(request):
    """Get all food items with optional category filter"""
    category_id = request.query_params.get('category')
    
    if category_id:
        food_items = Food.objects.filter(category_id=category_id).select_related('category')
    else:
        food_items = Food.objects.all().select_related('category')
    
    serializer = FoodItemSerializer(food_items, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['GET'])
def get_food_item(request, pk):
    """Get a single food item by ID"""
    try:
        food_item = Food.objects.get(pk=pk)
        serializer = FoodItemSerializer(food_item, context={'request': request})
        return Response(serializer.data)
    except Food.DoesNotExist:
        return Response(
            {"message": "Food item not found"},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['PUT'])
@parser_classes([MultiPartParser, FormParser])
def update_food_item(request, pk):
    """Update a food item"""
    try:
        food_item = Food.objects.get(pk=pk)
    except Food.DoesNotExist:
        return Response(
            {"message": "Food item not found"},
            status=status.HTTP_404_NOT_FOUND
        )
    
    serializer = FoodItemCreateSerializer(food_item, data=request.data, partial=True)
    
    if serializer.is_valid():
        serializer.save()
        response_serializer = FoodItemSerializer(food_item, context={'request': request})
        return Response(
            {
                "message": "Food item updated successfully",
                "data": response_serializer.data
            },
            status=status.HTTP_200_OK
        )
    
    return Response(
        {
            "message": "Validation failed",
            "errors": serializer.errors
        },
        status=status.HTTP_400_BAD_REQUEST
    )


@api_view(['DELETE'])
def delete_food_item(request, pk):
    """Delete a food item"""
    try:
        food_item = Food.objects.get(pk=pk)
        food_item.delete()
        return Response(
            {"message": "Food item deleted successfully"},
            status=status.HTTP_204_NO_CONTENT
        )
    except Food.DoesNotExist:
        return Response(
            {"message": "Food item not found"},
            status=status.HTTP_404_NOT_FOUND
        )