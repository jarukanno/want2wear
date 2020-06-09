var Product = require('../models/product');

var product = [
    new Product({
        name: "Lovely Suits" , 
        image: "https://i0.codibook.net/files/1976121817426/3cc487f6e3c992d8/453736844.jpg",
        details: "Beautiful",
        quantity: "2",
        color: "Blue",
        size: "XL",
        price: "30"
}),
    new Product({
        name: "Lovely Pants" , 
        image: "https://i0.codibook.net/files/1976121817423/32ce2ef804c51926/2035020589.jpg",
        desc: "Beautiful mak",
        quantity: "3",
        color: "White",
        size: "S",
        price: "50"
})

];
var done = 0;
for (var i =0; i < products.length;i++){
    products[i].save(function(err, result){
        done++;
        if (done === products.length){
            exit();
        }
    });
}
function exit(){
    mongoose.disconnect();
}
