from django.db import models


class User(models.Model):
    first_name = models.CharField(max_length= 50, blank=True, null=True)
    last_name = models.CharField(max_length=50, blank=True, null=True)
    email = models.EmailField(max_length=100, unique=True)
    password = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=15)
    reg_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class Category(models.Model):
    category_name = models.CharField(max_length=50, blank=True, null=True)
    creation_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.category_name
    

class Food(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    item_name = models.CharField(max_length=50, blank=True, null=True)
    item_price = models.DecimalField(max_digits=10,decimal_places=1)
    item_description = models.TextField(max_length=500, blank=True, null=True)
    image = models.ImageField(upload_to='food_image/', blank=True, null=True)
    item_quantity =models.CharField(max_length=100)
    is_available = models.BooleanField(default=True)
    creation_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.item_name} ({self.item_quantity})"
    

class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    food = models.ForeignKey(Food, on_delete=models.CASCADE, related_name='orders')
    is_order_placed = models.BooleanField(default=False)
    quantity = models.PositiveIntegerField(default=1)
    order_number = models.CharField(max_length=100, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True) 
    updated_at = models.DateTimeField(auto_now=True)  

    

    def __str__(self):
        return f"Order #{self.order_number or self.id} - {self.quantity}"