package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
)

func getVendors(w http.ResponseWriter, r *http.Request) {

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

func addNewProduct(w http.ResponseWriter, r *http.Request) {
	var request NewProduct

	err := json.NewDecoder(r.Body).Decode(&request)

	if err != nil {
		writeJSONErrorResponse(w, http.StatusBadRequest, "Invalid JSON data")
		return
	}

	if err := newProductValidation(request); err != nil {
		writeJSONErrorResponse(w, http.StatusBadRequest, err.Error())
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

	_, err = productInsertStatement.Exec(request.Name, categoryID, request.Price, request.Quantity, request.Description)
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
