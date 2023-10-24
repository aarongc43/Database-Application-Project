# COSC 4415 Database Project
## Ecommerce Admin portal

### Relational Table Schema

**Customers**(<u>CustomerID</u>, FirstName, LastName, AddressID(FK to Address))

**Address**(<u>AddressID</u>, StreetNumber, StreetName, APT/STE, City, Zipcode, State)

**Payments**(<u>PaymentID</u>, CustomerID(FK to Customers), Amount, Date, PaymentStatus, PaymentMethod)

**Orders**(<u>OrderID</u>, PaymentID(FK to Payments), Date, TotalAmount, OrderStatus, CreatedAt, UpdatedAt)

**OrderDetails**(<u>OrderDetailID</u>, OrderID(FK to Orders), ProductID(FK to Products), Quantity, Subtotal)

**Products**(<u>ProductID</u>, CategoryID(FK to Categories), VendorID(FK to Vendors), ProductName, Price, StockQuantity, ProductDescription)

**Categories**(<u>CategoryID</u>, CategoryName)

**Vendors**(<u>VendorID</u>, VendorName)

**Employee**(<u>EmployeeID</u>, LoginCredID(FK to LoginCreds), FirstName, LastName)

**LoginCreds**(<u>LoginCredID</u>, Username, Password, AccountStatus)

