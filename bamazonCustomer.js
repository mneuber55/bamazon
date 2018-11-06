var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3307,
  user: "root",
  password: "password",
  database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    showAllItems();
});

//display all items for sale

function showAllItems() {
    connection.query("SELECT * FROM products", function(err, res) {
        console.log("");
        console.log("ITEMS FOR SALE");
        console.log("-----------------------------------");
        console.log(" Item ID | Item Name | Price");
        console.log("-----------------------------------");
        for (var i = 0; i < res.length; i++) {
            console.log("  "+res[i].item_id + "  |  " + res[i].product_name + "  |  " + res[i].price);
        }
        console.log("-----------------------------------");
        buyProduct();
    });
};

function buyProduct() {
    inquirer
      .prompt([
        {
        name: "itemID",
        type: "input",
        message: "What is the ID of the item you would like to buy?"
        },
        {
        name: "quantity",
        type: "input",
        message: "How many would you like to buy?"
        }
    ])
      .then(function(answer) {
        connection.query("SELECT * FROM bamazon.products WHERE item_id = ?", [answer.itemID], function(err, res) {
            if (res[0].stock_quantity >= parseInt(answer.quantity)) {
                connection.query("UPDATE bamazon.products SET stock_quantity = ? WHERE item_id = ?", [res[0].stock_quantity-answer.quantity,answer.itemID], function(err, res) {
                });
                console.log("Congrats! You have purchased "+answer.quantity+" "+res[0].product_name+" for a total of $"+parseInt(answer.quantity)*res[0].price);
            }
            else {
                console.log("Sorry! There is not sufficient quantity of that item.");
            }
        });
    });
}

