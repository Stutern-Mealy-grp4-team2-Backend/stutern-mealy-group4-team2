export default function Cart(oldCart) {
    this.items = oldCart.items || {}; // Initialize items if it's undefined in oldCart
    this.totalQuantity = oldCart.totalQuantity || 0;
    this.totalPrice = oldCart.totalPrice || 0;
  
    this.add = function (item, id) {
      let storedItem = this.items[id];
      if (!storedItem) {
        storedItem = this.items[id] = { item: item, quantity: 0, price: 0 };
      }
      storedItem.quantity++;
      storedItem.price = storedItem.item.price * storedItem.quantity;
      this.totalQuantity++;
      this.totalPrice += storedItem.item.price;
    };
    this.reduceByOne = function(id){
      this.items[id].quantity--;
      this.items[id].price -= this.items[id].item.price;
      this.totalQuantity--;
      this.totalPrice -= this.items[id].item.price
      if(this.item[id].item.quantity <= 0){
        delete this.items[id]
      }
    };
    this.removeItem = function(id){
      this.totalQuantity -= this.items[id].quantity ;
      this.totalPrice -= this.items[id].price
      delete this.items[id]
    }
    this.generateArray = function () {
      let arr = [];
      for (const id in this.items) {
        arr.push(this.items[id]);
      }
      return arr;
    };
  }
  