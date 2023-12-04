package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
)

func getAllProducts(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query("SELECT Product_Id, Prod_Name, Prod_Price, Prod_Qty, Prod_Desc FROM products ORDER BY Prod_Name;")

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	var products []Product

	for rows.Next() {
		var p Product
		err := rows.Scan(&p.ID, &p.Name, &p.Price, &p.Quantity, &p.Description)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		products = append(products, p)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(products)
}

func getAllVendors(w http.ResponseWriter, r *http.Request) {

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
}

func getAllCategories(w http.ResponseWriter, r *http.Request) {

	rows, err := db.Query("SELECT Category_ID, Cat_Name FROM categories ORDER BY Cat_Name;")

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	var categories []string

	for rows.Next() {
		var v string
		err := rows.Scan(&v)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		categories = append(categories, v)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(categories)
}

func addNewVendor(w http.ResponseWriter, r *http.Request) {
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
}

func addNewCategory(w http.ResponseWriter, r *http.Request) {
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
}

func addProduct(w http.ResponseWriter, r *http.Request) {
	var request NewProduct

	err := json.NewDecoder(r.Body).Decode(&request)
	if err != nil {
		writeJSONErrorResponse(w, http.StatusBadRequest, "Invalid JSON data")
		return
	}

	if err := productAddValidation(request); err != nil {
		writeJSONErrorResponse(w, http.StatusBadRequest, err.Error())
		return
	}

	err = db.QueryRow("SELECT Prod_Name FROM products WHERE Prod_Name = ?", request.Name).Scan()
	if err != sql.ErrNoRows {
		writeJSONErrorResponse(w, http.StatusBadRequest, "Product already exists")
		return
	}

	productInsertStatement, err := db.Prepare("CALL InsertNewProduct(?, ?, ?, ?, ?)")
	if err != nil {
		writeJSONErrorResponse(w, http.StatusInternalServerError, "SQL procedure error")
		return
	}
	defer productInsertStatement.Close()

	_, err = productInsertStatement.Exec(request.Category, request.Name, request.Price, request.Quantity, request.Description)
	if err != nil {
		writeJSONErrorResponse(w, http.StatusInternalServerError, "Product insertion error")
		return
	}

	writeJSONSuccessResponse(w, http.StatusCreated, "Product Successfully Added")
}

func updateProduct(w http.ResponseWriter, r *http.Request) {
	var request Product

	vars := mux.Vars(r)
	productID := vars["productID"]

	err := json.NewDecoder(r.Body).Decode(&request)
	if err != nil {
		writeJSONErrorResponse(w, http.StatusBadRequest, "Invalid JSON data")
		return
	}

	if err := productUpdateValidation(request); err != nil {
		writeJSONErrorResponse(w, http.StatusBadRequest, err.Error())
		return
	}

	productUpdateStatement, err := db.Prepare("CALL UpdateProduct(?, ?, ?, ?, ?)")
	if err != nil {
		writeJSONErrorResponse(w, http.StatusInternalServerError, "SQL procedure error")
		return
	}
	defer productUpdateStatement.Close()

	_, err = productUpdateStatement.Exec(productID, request.Name, request.Price, request.Quantity, request.Description)
	if err != nil {
		writeJSONErrorResponse(w, http.StatusInternalServerError, "Product modification error")
		return
	}

	writeJSONSuccessResponse(w, http.StatusCreated, "Product Successfully Modified")
}

func deleteProduct(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	productID := vars["productID"]

	productDeleteStatement, err := db.Prepare("CALL DeleteProduct(?)")
	if err != nil {
		writeJSONErrorResponse(w, http.StatusInternalServerError, "SQL procedure error")
		return
	}
	defer productDeleteStatement.Close()

	_, err = productDeleteStatement.Exec(productID)
	if err != nil {
		writeJSONErrorResponse(w, http.StatusInternalServerError, "Product modification error")
		return
	}

	writeJSONSuccessResponse(w, http.StatusCreated, "Product Successfully Deleted")
}

func categoriesDropDown(w http.ResponseWriter, r *http.Request) {

	vars := mux.Vars(r)
	vendorName := vars["vendor"]
	fmt.Println("Vendor Name:", vendorName)

	rows, err := db.Query("SELECT Cat_Name FROM categories NATURAL JOIN vendors WHERE Vendor_Name = ?", vendorName)

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
}

func writeJSONErrorResponse(w http.ResponseWriter, statusCode int, errMessage string) {
	response := SuccessResponse{Success: false, Error: errMessage}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(response)
}

func writeJSONSuccessResponse(w http.ResponseWriter, statusCode int, errMessage string) {
	response := SuccessResponse{Success: true}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(response)
}
