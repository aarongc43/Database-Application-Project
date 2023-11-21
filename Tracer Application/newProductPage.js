//the purpose of this script is to:
//1. Take the input of the form and assign each string to a variable
//2. Create a JSON object from those variables
//3. Create a fetch method that will send the JSON to the /addProduct endpoint (see the backend code after this)
//4. That's really about it, there's a lot to say so I'll keep it simple until we can go through it together. Note this is in pure js, not typescript but essentially the same.
//5. this code will be top/down for ease of reading 

document.addEventListener('DOMContentLoaded', () => { //I see this as a constructor almost. On page load do... whatever. In this case, createProduct() method.
    createProduct();
});

function createProduct() {
    let addProductButton = document.getElementById('add-btn'); //making a variable from the button we made in html
    addProductButton.addEventListener('click', () => { //when that button is clicked do... all until line 44.
        let product_name = document.getElementById("product-name").value; //make variable from fields
        let descr = document.getElementById("product-desc").value; //make variable from fields
        let price = document.getElementById("product-price").value; //make variable from fields
        let imgURL = document.getElementById("product-imgURL").value; //make variable from fields
        let quantity = parseInt(document.getElementById("product-quantity").value); //make variable from fields

    
        fetch("http://localhost:8080/addProduct", { //this javascript method is supremely important. The fetch method is what sends data to an endpoint so the backend can use that data to do something.        
        //NOTE THE ENDPOINT URL ^ YOU WILL SEE THIS ON THE BACKEND SERVER   
        method: 'POST', //we are send a POST request
        headers: {
            'Content-Type': 'application/json', //typical for json
        },
        body: JSON.stringify({product_name,descr,price,imgURL,quantity}), //creating JSON from these variables we grabbed from the form the user put in

        })
        .then(response => response.json()) //every POST will eventually return back to the front end. These two .then promises are standard for fetch methods and allow the rest of the JS to function while waiting for the http to send and come back.
        .then(data => { //.then use the retrieved response from the backend to denote a success or failed database insert.
            console.log(data);

            if (data.success) {
                console.log("successfully added product!");
            } else {
                console.log("invalid product addition", data.error);
            }
        })
        .catch(error => {
            console.error("Error adding product", error); //every fetch must have a catch, incase shit goes wrong (invalid endpoint, server is down, etc.)
        });
    });
}