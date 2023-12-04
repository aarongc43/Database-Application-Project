package main

type NewProduct struct {
	Category    string `json:"category"`
	Vendor      string `json:"vendor"`
	Name        string `json:"productName"`
	Price       string `json:"price"`
	Quantity    string `json:"quantity"`
	Description string `json:"description"`
}

type OrderDetails struct {
	OrderID   int `json:"orderID"`
	ProductID int `json:"productID"`
	Quantity  int `json:"quantity"`
}

type Product struct {
	ID          int    `json:"productID"`
	Vendor      string `json:"vendor"`
	Category    string `json:"category"`
	Name        string `json:"productName"`
	Price       string `json:"price"`
	Quantity    string `json:"quantity"`
	Description string `json:"description"`
}

type Category struct {
	ID   int    `json:"categoryID"`
	Name string `json:"categoryName"`
}

type NewVendor struct {
	Name string `json:"vendor"`
}

type NewCategory struct {
	Name   string `json:"category"`
	Vendor string `json:"vendor"` //need to add this to front end option
}

type SuccessResponse struct {
	Success bool   `json:"success"`
	Error   string `json:"error,omitempty"`
}
