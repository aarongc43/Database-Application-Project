package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/go-sql-driver/mysql"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

type NewProduct struct {
	Category    string `json:"category"`
	Name        string `json:"productName"`
	Price       int    `json:"price"`
	Quantity    int    `json:"quantity"`
	Description string `json:"description"`
}

type NewProductResponse struct {
	Success bool   `json:"success"`
	Error   string `json:"error,omitempty"`
}

func addProduct(w http.ResponseWriter, r *http.Request) {
	var request NewProduct

	err := json.NewDecoder(r.Body).Decode(&request)

	if err != nil {
		fmt.Println("Error decoding JSON:", err)
		writeJSONErrorResponse(w, http.StatusBadRequest, "Invalid JSON data")
		return
	}

	cfg := mysql.Config{
		User:   "root",
		Passwd: "Frodobaggins123",
		Net:    "tcp",
		Addr:   "localhost:3306",
		DBName: "web_store",
	}

	db, err := sql.Open("mysql", cfg.FormatDSN())
	if err != nil {
		panic(err)
	}

	defer db.Close()

	getCategoryIDStatement, err := db.Prepare("SELECT Category_ID FROM categories WHERE Cat_Name = ?")
	if err != nil {
		writeJSONErrorResponse(w, http.StatusInternalServerError, "SQL statement error")
		return
	}
	defer getCategoryIDStatement.Close()

	var categoryID int
	err = getCategoryIDStatement.QueryRow(request.Category).Scan(&categoryID)
	if err != nil {
		writeJSONErrorResponse(w, http.StatusInternalServerError, "Category not found")
		return
	}

	productInsertStatement, err := db.Prepare("INSERT INTO products (Prod_Name, Category_ID, Prod_Price, Prod_Qty, description) VALUES (?, ?, ?, ?, ?)")
	if err != nil {
		writeJSONErrorResponse(w, http.StatusInternalServerError, "SQL statement error")
		return
	}
	defer productInsertStatement.Close()

	_, err = productInsertStatement.Exec(request.Name, categoryID, request.Price, request.Quantity, request.Description)
	if err != nil {
		writeJSONErrorResponse(w, http.StatusInternalServerError, "Product insertion error")
		return
	}
	response := NewProductResponse{Success: true}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}

func writeJSONErrorResponse(w http.ResponseWriter, statusCode int, errMessage string) { //method to reduce code repetition when returning a JSON formatted error response
	response := NewProductResponse{Success: false, Error: errMessage}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(response)
}

func handleRequest(corsMiddleware func(http.Handler) http.Handler) {
	myRouter := mux.NewRouter().StrictSlash(true)
	myRouter.Use(corsMiddleware)

	myRouter.HandleFunc("/addProduct", addProduct)
	//add more endpoints and associated funcs here
	//add more endpoints and associated funcs here
	//add more endpoints and associated funcs here
	log.Fatal(http.ListenAndServe(":8080", myRouter))
}

func main() {

	corsMiddleware := handlers.CORS(
		handlers.AllowedOrigins([]string{"http://localhost:3000"}),
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}),
		handlers.AllowedHeaders([]string{"Content-Type"}),
	)

	handleRequest(corsMiddleware)

}
