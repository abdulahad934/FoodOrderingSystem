

from django.shortcuts import render
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework import status
from .models import *
from .serializers import CategorySerializer, FoodItemSerializer
from django.contrib.auth.hashers import make_password


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
    """Add new category"""
    category_name = request.data.get('category_name')

    if not category_name:
        return Response({"message": "Category name is required"}, status=400)

    Category.objects.create(category_name=category_name)
    return Response({"message": "Category has been created"}, status=201)


@api_view(['GET'])
def list_categories(request):
    """Get all categories (for dropdown)"""
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def add_food_item(request):
    
    try:
        category_id = request.data.get('category')
        item_name = request.data.get('item_name')
        item_description = request.data.get('item_description')
        item_price = request.data.get('item_price')
        item_quantity = request.data.get('item_quantity')
        image = request.FILES.get('image')
        
    
        if not all([category_id, item_name, item_description, item_price, item_quantity]):
            return Response(
                {"message": "All fields are required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        
        try:
            category = Category.objects.get(id=category_id)
        except Category.DoesNotExist:
            return Response(
                {"message": "Category not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        
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
        
      
        food_item = Food.objects.create(
            category=category,
            item_name=item_name.strip(),
            item_description=item_description.strip(),
            item_price=price,
            item_quantity=item_quantity.strip(),
            image=image
        )
       
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
def list_foods(request):
    
    foods = Food.objects.all()
    serializer = FoodItemSerializer(foods, many=True)
    return Response(serializer.data)



@api_view(['GET'])

def food_search(request):
    query = request.GET.get('q', '')
    foods = Food.objects.filter(item_name__icontains=query)
    serializer = FoodItemSerializer(foods, many=True)
    return Response(serializer.data)


import random
@api_view(['GET'])
def random_foods(request):
    foods = list(Food.objects.all())
    random.shuffle(foods)
    limited_foods = foods[0:9]
    serializer = FoodItemSerializer(limited_foods, many=True)
    return Response(serializer.data)


@api_view(['POST'])

def register_User(request):
    first_name = request.data.get('firstname')
    last_name = request.data.get('lastname')
    phone_number = request.data.get('mobilenumber')
    email= request.data.get('email')
    password = request.data.get('password')
    

    if User.objects.filter(email=email).exists() or User.objects.filter(phone_number=phone_number).exists():
        return Response({"message": "Email or mobile already registered"}, status=400)
    User.objects.create(first_name = first_name, last_name = last_name, phone_number = phone_number, email=email, password = make_password(password))
    return Response({"message": "User register successfully"}, status=201)


from django.db.models import Q
from django.contrib.auth.hashers import check_password

@api_view(['POST'])
def user_login(request):
    identifier = request.data.get('identifier')
    password = request.data.get('password')

    try:
        user = User.objects.get(Q(email=identifier) | Q(phone_number=identifier))
        if check_password(password, user.password):
            return Response(
                {
                    "message": "Login Succesfull",
                    "userId": user.id,
                    "userName": f"{user.first_name} {user.last_name}"
                },
                status=200
            )
        else:
            return Response({"message": "Invalid Credentials"}, status=401)
    except:
        return Response({"message": "Invalid Credentials"}, status=401)
    





from django.shortcuts import get_object_or_404

@api_view(['GET'])
def food_detail(request, id):
 
    food = get_object_or_404(Food, id=id)
    serializer = FoodItemSerializer(food)
    return Response(serializer.data)



@api_view(['POST'])
def add_to_cart(request):
    user_id = request.data.get('userId')
    food_id = request.data.get('foodId')

    if not user_id or not food_id:
        return Response({"message": "User ID and Food ID are required"}, status=400)

    try:
        user = User.objects.get(id=user_id)
        food = Food.objects.get(id=food_id)

        order, created = Order.objects.get_or_create(
            user=user,
            food=food,
            is_order_placed=False,
            defaults={'quantity': 1} 
        )
        
        if not created:
            order.quantity += 1
            order.save()
            return Response({"message": "Item quantity updated in cart"}, status=200)
        
        return Response({"message": "Food added to cart successfully"}, status=201)
        
    except User.DoesNotExist:
        return Response({"message": "User not found"}, status=404)
    except Food.DoesNotExist:
        return Response({"message": "Food item not found"}, status=404)
    except Exception as e:
        print(f"Error in add_to_cart: {str(e)}")  
        return Response({"message": "Something went wrong", "error": str(e)}, status=500)