package main

import (
	"database/sql"
	"fmt"
	"net/http"

	"github.com/go-sql-driver/mysql"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

var db *sql.DB

func handleRequest(corsMiddleware func(http.Handler) http.Handler) {
	myRouter := mux.NewRouter().StrictSlash(true)

	protectedRoute := myRouter.PathPrefix("/protected").Subrouter()
	protectedRoute.Use(BasicAuthMiddleware)
	protectedRoute.Use(corsMiddleware)
	protectedRoute.HandleFunc("/products", addNewProduct)
	protectedRoute.HandleFunc("/addVendor", addNewVendor)

	myRouter.Use(corsMiddleware)
	myRouter.HandleFunc("/vendors", getAllVendors)
	myRouter.HandleFunc("/categories/{vendor}", categoriesDropDown)
	myRouter.HandleFunc("/categories", addNewCategory)
	myRouter.HandleFunc("/getProducts", getAllProducts)

	myRouter.NotFoundHandler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("Not Found:", r.URL.Path)
		http.NotFound(w, r)
	})

	http.ListenAndServe(":8080", myRouter)
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
		handlers.AllowedHeaders([]string{"Content-Type", "Authorization"}),
	)

	handleRequest(corsMiddleware)

}
