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
	Vendor      string `json:"vendor"`
	Name        string `json:"productName"`
	Price       string `json:"price"`
	Quantity    int    `json:"quantity"`
	Description string `json:"description"`
}

func addProduct(w http.ResponseWriter, r *http.Request) {
	var request NewProduct

	err := json.NewDecoder(r.Body).Decode(&request)
	fmt.Print(err)

	if err != nil {
		return
	}

	cfg := mysql.Config{
		User:   "root",
		Passwd: "database_password",
		Net:    "tcp",
		Addr:   "localhost:3306",
		DBName: "web_store",
	}

	db, err := sql.Open("mysql", cfg.FormatDSN())
	if err != nil {
		panic(err)
	}

	defer db.Close()

	tx, err := db.Begin() //creating transaction for multi inserts
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	productInsertStatement, err := tx.Prepare("INSERT INTO products (productName, price, quantity, description) VALUES (?,?,?,?,?)")
	if err != nil {
		tx.Rollback()
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer productInsertStatement.Close()

	_, err = productInsertStatement.Exec(0, request.Name, request.Price, request.Quantity, request.Description)
	if err != nil {
		tx.Rollback()
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	categoryInsertStatement, err := tx.Prepare("INSERT INTO categories (Cat_Name) VALUES (?,?)")
	if err != nil {
		tx.Rollback()
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer categoryInsertStatement.Close()

	_, err = categoryInsertStatement.Exec(0, request.Category)
	if err != nil {
		tx.Rollback()
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	vendorInsertStatement, err := tx.Prepare("INSERT INTO vendors (VendorName) VALUES (?,?)")
	if err != nil {
		tx.Rollback()
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer vendorInsertStatement.Close()

	_, err = vendorInsertStatement.Exec(0, request.Vendor)
	if err != nil {
		tx.Rollback()
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	err = tx.Commit()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Products, vendor, and category inserted successfully"))
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
		handlers.AllowedOrigins([]string{"http://localhost:5500"}),
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}),
		handlers.AllowedHeaders([]string{"Content-Type"}),
	)

	handleRequest(corsMiddleware)

}
