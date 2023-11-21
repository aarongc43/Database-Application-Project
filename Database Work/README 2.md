# COSC 4415 Database Project
## Ecommerce Admin portal

### Relational Table Schema

**Customers**(<u>Customer_ID</u>, first_name, last_name, email,)

**Payments**(<u>Payment_ID</u>, Customer_ID(FK to Customers), Amount, Date, PaymentStatus, PaymentMethod)

**Orders**(<u>Order_ID</u>, Payment_ID(FK to Payments), Date, TotalAmount, OrderStatus, CreatedAt, UpdatedAt)

**OrderDetails**(<u>OrderDetailID</u>, OrderID(FK to Orders), ProductID(FK to Products), Quantity, Subtotal)

**Products**(<u>ProductID</u>, CategoryID(FK to Categories), VendorID(FK to Vendors), ProductName, Price, StockQuantity, ProductDescription)

**Categories**(<u>Category_ID</u>, CategoryName)

**Vendors**(<u>Vendor_ID</u>, VendorName)

**Employee**(<u>Employee_ID</u>, LoginCredID(FK to LoginCreds), FirstName, LastName)

**LoginCreds**(<u>Username</u>, Employee_Id(FK to Employee), Password, AccountStatus)

