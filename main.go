package main

//this small application seeks to create a new product within the MySQL database from a simple form on a webpage i.e. our website admin page.
//most of these lines are comments, there's not much code just a lot to it.
//we will go through this tracer program together, but if you're looking at it remember to start in the main and trace the code from there.
//important to remember, this starts from the front end. This backend only listens to the endpoint(s) and retrieves the data that it has been "hit" with.
//this means once the 'submit' button is clicked on the front end and the front end sends a request to the endpoint, this backend code will be listening to that endpoint.
//This is partially why it is important to start on the front end.

import ( //basically same as java imports

	"database/sql"  //interface for querying/interacting with database
	"encoding/json" //for formatting/encoding/decoding json strings
	"fmt"
	"log"      //for logging problems/issues
	"net/http" //used for http requests/ http.ResponseWriter, *http.Request

	"github.com/go-sql-driver/mysql" //driver for mySQL connection
	"github.com/gorilla/handlers"    //works with net/http package to validate content types, allow access via CORS, compressing http responses
	"github.com/gorilla/mux"         //used to make handling multiple path variables/endpoint connections and related methods
)

type NewProduct struct { //essentially a java class, a struct is an object in Go and we are making a new product object called NewProduct

	//each attribute within this object will be proportional to what we are requesting from the database or receiving from the front end
	//since we are dealing with json for a web application, we use the `json: "X"` syntax in a struct to denote how the json will be marshaled (converted to json) or unmarshaled (parsed from json)
	//in this case of SENDING information to this backend, we will be unmarshaling (or unwrapping/converting) the json and making an object out of the sent attributes.
	//notice that we do not have a product_id attribute as we are CREATING a new product, and our database will auto increment a value so it is not needed for inserting.

	//using the encoding/json package we imported, we can use the name declared "product_name" when unmarshaling the json. Same for the other attributes.
	Name     string `json:"product_name"`
	Desc     string `json:"descr"`
	Price    string `json:"price"`
	Img      string `json:"imgurl"`
	Quantity int    `json:"quantity"`
}

func addProduct(w http.ResponseWriter, r *http.Request) { //method that will take in the json from the hit endpoint, parse it, and create a NewProduct object from it. Then we will make a db query that inserts the attributes of that object.
	var request NewProduct //making variable from our struct from our request json

	err := json.NewDecoder(r.Body).Decode(&request) //unmarshaling the json from the endpoint, creating an object that has the attributes our json contained
	fmt.Print(err)

	if err != nil {
		return
	}

	cfg := mysql.Config{ //making our DB config to connect
		User:   "admin_name",
		Passwd: "database_password",
		Net:    "tcp",
		Addr:   "localhost:3306",
		DBName: "our_db_name",
	}

	db, err := sql.Open("mysql", cfg.FormatDSN()) //using DB config to connect

	if err != nil {
		panic(err)
	}

	defer db.Close()

	//note that within the SQL query, there are ? ? ? ? ? for the values. That is because these values are the same values that were input on the front end form
	//product_id MUST be declared, but requires a 0 or null for auto increment to function correctly, so it was not included in the struct
	insertStatement, err := db.Prepare("INSERT INTO products (product_id, product_name, descr, price, imgurl, quantity) VALUES (?,?,?,?,?,?)") //creating prepared insert statement using databast/sql import package.

	if err != nil {
		return
	}

	defer insertStatement.Close()

	fmt.Print(request)
	_, err = insertStatement.Exec(0, request.Name, request.Desc, request.Price, request.Img, request.Quantity) //executing the prepared insert statement and we are done. The product *should* be added to the database.

	if err != nil {
		panic(err.Error())
	}
}

func handleRequest(corsMiddleware func(http.Handler) http.Handler) { //method that utilizes mux import for handling multiple requests (we will have many requests for our project)
	myRouter := mux.NewRouter().StrictSlash(true) //creating a new router instance to handle http requests
	myRouter.Use(corsMiddleware)                  //telling our router to use the cors parameters we set

	myRouter.HandleFunc("/addProduct", addProduct) //every time this https://localhost:8080/addProduct endpoint is hit from our front end code, we will utilize the addProduct function/method
	//add more endpoints and associated funcs here
	//add more endpoints and associated funcs here
	//add more endpoints and associated funcs here
	//add more endpoints and associated funcs here
	log.Fatal(http.ListenAndServe(":8080", myRouter)) //making our server address listen on port 8080
}

func main() {

	//you cannot send HTTP if CORS is not enabled
	corsMiddleware := handlers.CORS( //creates new CORS (Cross-Origin Resource Sharing) instance. Middleware for HTTP server allowing for specification on which origins, methods, and headers are allowed in cross-origin requests
		handlers.AllowedOrigins([]string{"http://localhost:5500"}),                   // allowing which domains can send requests to the server, company's would have their website here
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}), //allowing all http methods, for this initial program we will be using POST
		handlers.AllowedHeaders([]string{"Content-Type"}),                            //specifying the header(s) allowed
	)

	handleRequest(corsMiddleware) //go to the handleRequest method from here, sending our corsMiddleWare variable with it

}
