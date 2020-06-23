module.exports =  function Cart(oldCart){
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;
    this.totalProduct = oldCart.totalProduct || 0;
    // console.log(oldCart);


    this.add = function(item, id){
      
        var available = item.available;
        var storedItem = this.items[id];
        
        
        if(!storedItem) {
            storedItem =this.items[id] = {item: item, qty: 0, price:0};
            if (item.qty>available){
                console.log("Stock Unavailable");
            }
            else{
                storedItem.qty= storedItem.item.qty;
        
                storedItem.price = storedItem.item.price * storedItem.qty;
                this.totalQty+= storedItem.qty;
                this.totalPrice += storedItem.price;
                this.totalProduct++;
                // console.log(storedItem);
            }
            
        }
        else{
            
            let addQty = item.qty;
            var newQty = storedItem.item.qty+= addQty;
            if(newQty>available){
                    console.log("Stock Unavailable");
            }
            else{
                storedItem.qty= storedItem.item.qty;
            storedItem.price = storedItem.item.price * storedItem.qty;
            
            this.totalQty+= addQty;
            this.totalPrice +=item.price*addQty;  
            }
            
        }
    }

    this.addOne = async function(id,available){
        var storedItem = this.items[id];
        storedItem.item.qty++;
        if(storedItem.item.qty>available){
            storedItem.item.qty--;
        }
        else{
            storedItem.qty= storedItem.item.qty;
        storedItem.price = storedItem.item.price * storedItem.qty;
        // console.log(storedItem);
        
        this.totalQty++;
        this.totalPrice +=storedItem.item.price;      

        }
        
    }

    this.delete = async function(id){

        
        var storedItem = this.items[id];
       
        var oldQty = storedItem.qty;
        var oldPrice = storedItem.price;
        this.totalQty-= oldQty;
        this.totalPrice-= oldPrice;
        this.totalProduct--;
        delete (this.items[id]); 
    }

    this.decrese = async function(id,available){
        var storedItem = this.items[id];
        storedItem.item.qty--;
        if(storedItem.item.qty<0){
            storedItem.item.qty++;
        }
        else if(storedItem.item.qty == 0){
            var oldQty = storedItem.qty;
            var oldPrice = storedItem.price;
            this.totalQty-= oldQty;
            this.totalPrice-= oldPrice;
            this.totalProduct--;
            delete (this.items[id]); 
            console.log("delete");
        }
        else{
            storedItem.qty= storedItem.item.qty;
        storedItem.price = storedItem.item.price * storedItem.qty;
        // console.log(storedItem);
        
        this.totalQty--;
        this.totalPrice -=storedItem.item.price;      

        }
        
    }


    this.generateArray = function(){
        var arr = [];
        for (var id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    }
};