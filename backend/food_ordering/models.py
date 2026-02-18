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
    

class OrderAddress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    order_number = models.CharField(max_length=100, null=True)
    address = models.TextField()
    order_time = models.DateTimeField(auto_now_add=True)
    order_final_status = models.CharField(max_length=200, null=True)

    def __str__(self):
        return f"{self.order_number} {self.user}"


class FoodTracking(models.Model):

    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    remark = models.CharField(max_length=200, null=True)
    status = models.CharField(max_length=200, null=True)
    status_date = models.DateTimeField(auto_now_add=True)
    order_cancelled_by_user = models.BooleanField(null=True)

    def __str__(self):
        return f"{self.order} - {self.status}"
    

class PaymentDetail(models.Model):
    PAYMENT_CHOICES = [
        ('cod', 'Cash on Delivery'),
        ('online', 'Online payment ')
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    order_number = models.CharField(max_length=100, null=True)
    payment_mode = models.CharField(max_length=20, null=True, choices=PAYMENT_CHOICES)
    card_number = models.CharField(max_length=20, null=True, blank=True)
    expiry_date = models.CharField(max_length=10, null=True, blank=True)
    cvv = models.CharField(max_length=5, null=True, blank=True)
    payment_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.order_number} - {self.payment_mode}"




class Review(models.Model):

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    food = models.ForeignKey(Food, on_delete=models.CASCADE)
    rating = models.PositiveBigIntegerField(default=1)
    comment = models.TextField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return f" Review by {self.user.first_name} for {self.food.item_name} - {self.rating} stars"


class Wishlist(models.Model):

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    food = models.ForeignKey(Food, on_delete=models.CASCADE)
    
    added_on = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'food')


    def __str__(self):
        return f"{self.user.first_name} - {self.food.item_name}"