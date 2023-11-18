package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/go-sql-driver/mysql"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

type NewProduct struct {
	Category    string `json:"category"`
	Vendor      string `json:"vendor"`
	Name        string `json:"productName"`
	Price       string `json:"price"`
	Quantity    string `json:"quantity"`
	Description string `json:"description"`
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

var db *sql.DB

func handleVendors(w http.ResponseWriter, r *http.Request) {

	if r.Method == http.MethodGet {
		rows, err := db.Query("SELECT Vendor_Name FROM vendors ORDER BY Vendor_Name;")

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}

		var vendors []string

		for rows.Next() {
			var v string
			err := rows.Scan(&v)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			vendors = append(vendors, v)
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(vendors)

	} else if r.Method == http.MethodPost {
		var request NewVendor

		err := json.NewDecoder(r.Body).Decode(&request)

		if err != nil {
			writeJSONErrorResponse(w, http.StatusBadRequest, "Invalid JSON data")
			return
		}

		vendorinsertstatement, err := db.Prepare("INSERT INTO vendors (Vendor_Name) values (?);")

		if err != nil {
			writeJSONErrorResponse(w, http.StatusInternalServerError, "SQL statement error")
			return
		}

		_, err = vendorinsertstatement.Exec(&request.Name)

		if err != nil {
			writeJSONErrorResponse(w, http.StatusInternalServerError, "Product insertion error")
			return
		}

		response := SuccessResponse{Success: true}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(response)

	} else {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func handleCategories(w http.ResponseWriter, r *http.Request) {

	/*
if r.Method == http.MethodGet { //for GET
rows, err := db.Query("SELECT Cat_Name FROM categories ORDER BY Cat_Name;")

if err != nil {
http.Error(w, err.Error(), http.StatusInternalServerError)
}

var categories []string

for rows.Next() {
var c string
err := rows.Scan(&c)
if err != nil {
http.Error(w, err.Error(), http.StatusInternalServerError)
return
}
categories = append(categories, c)
}

w.Header().Set("Content-Type", "application/json")
json.NewEncoder(w).Encode(categories)
	*/

	vars := mux.Vars(r)
	vendorName := vars["vendor"]

	if r.Method == http.MethodGet { //for GET
		rows, err := db.Query("select Cat_Name from categories NATURAL JOIN vendors where Vendor_Name = ?", vendorName)

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}

		var categories []string

		for rows.Next() {
			var c string
			err := rows.Scan(&c)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			categories = append(categories, c)
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(categories)

	} else if r.Method == http.MethodPost { //for POST
		var request NewCategory

		err := json.NewDecoder(r.Body).Decode(&request)

		if err != nil {
			writeJSONErrorResponse(w, http.StatusBadRequest, "Invalid JSON data")
			return
		}

		getVendorIDstatement, err := db.Prepare("SELECT Vendor_ID FROM vendors WHERE Vendor_Name =?")

		if err != nil {
			writeJSONErrorResponse(w, http.StatusInternalServerError, "SQL statement error")
			return
		}
		defer getVendorIDstatement.Close()

		var VendorID int
		err = getVendorIDstatement.QueryRow(request.Vendor).Scan(&VendorID)
		if err != nil {
			writeJSONErrorResponse(w, http.StatusInternalServerError, "Category not found")
			return
		}

		categoryInsertStatement, err := db.Prepare("INSERT INTO categories (Cat_Name, Vendor_ID) VALUES (?,?)")

		if err != nil {
			writeJSONErrorResponse(w, http.StatusInternalServerError, "SQL statement error")
			return
		}

		defer categoryInsertStatement.Close()

		_, err = categoryInsertStatement.Exec(request.Name, request.Vendor)
		if err != nil {
			writeJSONErrorResponse(w, http.StatusInternalServerError, "Category insertion error")
			return
		}

		response := SuccessResponse{Success: true}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(response)

	} else {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func handleProducts(w http.ResponseWriter, r *http.Request) {
	var request NewProduct

	err := json.NewDecoder(r.Body).Decode(&request)

	if err != nil {
		fmt.Println("Error decoding JSON:", err)
		writeJSONErrorResponse(w, http.StatusBadRequest, "Invalid JSON data")
		return
	}
	fmt.Printf("Received JSON data: %v+\n", request)

	price, err := strconv.Atoi(request.Price) //casting to int
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
	quantity, err := strconv.Atoi(request.Quantity) //casting to int
	if err != nil {
		fmt.Println("Error:", err)
		return
	}

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

	productInsertStatement, err := db.Prepare("INSERT INTO products (Prod_Name, Category_ID, Prod_Price, Prod_Qty, Prod_Desc) VALUES (?, ?, ?, ?, ?)")
	if err != nil {
		writeJSONErrorResponse(w, http.StatusInternalServerError, "SQL statement error")
		return
	}
	defer productInsertStatement.Close()

	_, err = productInsertStatement.Exec(request.Name, categoryID, price, quantity, request.Description)
	if err != nil {
		writeJSONErrorResponse(w, http.StatusInternalServerError, "Product insertion error")
		return
	}
	response := SuccessResponse{Success: true}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}

func writeJSONErrorResponse(w http.ResponseWriter, statusCode int, errMessage string) { //method to reduce code repetition when returning a JSON formatted error response
	response := SuccessResponse{Success: false, Error: errMessage}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(response)
}

func handleRequest(corsMiddleware func(http.Handler) http.Handler) {
	myRouter := mux.NewRouter().StrictSlash(true)
	myRouter.Use(corsMiddleware)

	myRouter.HandleFunc("/products", handleProducts).Methods(http.MethodGet, http.MethodPost, http.MethodDelete, http.MethodPut, http.MethodOptions)
	myRouter.HandleFunc("/vendors", handleVendors).Methods(http.MethodGet, http.MethodPost)
	myRouter.HandleFunc("/categories/{vendor}", handleCategories).Methods(http.MethodGet, http.MethodPost)
	//add more endpoints and associated funcs here
	log.Fatal(http.ListenAndServe(":8080", myRouter))
}

func main() {

	cfg := mysql.Config{
		User:   "root",
		Passwd: "Frodobaggins123",
		Net:    "tcp",
		Addr:   "localhost:3306",
		DBName: "web_store",
	}

	var err error
	db, err = sql.Open("mysql", cfg.FormatDSN())
	if err != nil {
		fmt.Print("error")
		panic(err)
	}

	defer db.Close()

	corsMiddleware := handlers.CORS(
		handlers.AllowedOrigins([]string{"http://localhost:3000"}),
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}),
		handlers.AllowedHeaders([]string{"Content-Type"}),
	)

	handleRequest(corsMiddleware)

}
