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
	Name     string `json:"product_name"`
	Desc     string `json:"descr"`
	Price    string `json:"price"`
	Img      string `json:"imgurl"`
	Quantity int    `json:"quantity"`
}

func addProduct(w http.ResponseWriter, r *http.Request) {
	var request NewProduct

	err := json.NewDecoder(r.Body).Decode(&request)
	fmt.Print(err)

	if err != nil {
		return
	}

	cfg := mysql.Config{
		User:   "admin_name",
		Passwd: "database_password",
		Net:    "tcp",
		Addr:   "localhost:3306",
		DBName: "our_db_name",
	}

	db, err := sql.Open("mysql", cfg.FormatDSN())
	if err != nil {
		panic(err)
	}

	defer db.Close()

	insertStatement, err := db.Prepare("INSERT INTO products (product_id, product_name, descr, price, imgurl, quantity) VALUES (?,?,?,?,?,?)")
	if err != nil {
		return
	}

	defer insertStatement.Close()

	fmt.Print(request)
	_, err = insertStatement.Exec(0, request.Name, request.Desc, request.Price, request.Img, request.Quantity)

	if err != nil {
		panic(err.Error())
	}
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
