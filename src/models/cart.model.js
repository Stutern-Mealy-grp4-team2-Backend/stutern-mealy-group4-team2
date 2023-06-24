export default function Cart(oldCart) {
  this.items = oldCart.items || {};
  this.totalQuantity = oldCart.totalQuantity || 0;
  this.totalPrice = oldCart.totalPrice || 0;

  this.add = function (item, id) {
    let storedItem = this.items[id];
    if (!storedItem) {
      storedItem = this.items[id] = { item: item, quantity: 0, price: 0 };
    }
    storedItem.quantity++;

    const productTotalPrice = item.discount > 0 ? item.price - (item.price * (item.discount / 100)) : item.price;
    storedItem.price = productTotalPrice * storedItem.quantity;

    this.totalQuantity++;
    this.totalPrice += productTotalPrice;
  };

  this.addShippingFee = function (shippingFee) {
    const shippingId = 'shipping'; // Use a unique ID for the shipping fee item
    if (!this.items[shippingId]) {
      this.items[shippingId] = { item: { name: 'Shipping Fee', price: shippingFee }, quantity: 1, price: shippingFee };
      this.totalQuantity++;
      this.totalPrice += shippingFee;
    }
  };

  this.reduceByOne = function (id) {
    const storedItem = this.items[id];
    if (storedItem) {
      storedItem.quantity--;

      const productTotalPrice = storedItem.item.discount > 0 ? storedItem.item.price - (storedItem.item.price * (storedItem.item.discount / 100)) : storedItem.item.price;
      storedItem.price = productTotalPrice * storedItem.quantity;

      this.totalQuantity--;
      this.totalPrice -= productTotalPrice;

      if (storedItem.quantity <= 0) {
        delete this.items[id];
      }
    }
  };

  this.removeItem = function (id) {
    const storedItem = this.items[id];
    if (storedItem) {
      this.totalQuantity -= storedItem.quantity;
      this.totalPrice -= storedItem.price;
      delete this.items[id];
    }
  };

  this.generateArray = function () {
    let arr = [];
    for (const id in this.items) {
      arr.push(this.items[id]);
    }
    return arr;
  };
}
