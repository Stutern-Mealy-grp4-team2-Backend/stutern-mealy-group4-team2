
// import { Schema, model, Types, Query }  from "mongoose";

// const CartSchema = new Schema({
//   products: [
//     {
//     quantity: {
//       type: Number,
//       required: true,
//       default: 1
//     },
//     product: {
//       type: Types.ObjectId,
//       ref: 'Product'
//     },
//     cartPrice: Number,
//     price: Number,
//   },
// ],
  
//   cartTotal: Number,
//   shippingFee: Number,
//   vatDeduction: Number,
//   cartSubTotal: Number,
//   discount: {
//     type: Number,
//     default: 0
//   },
//   orderedBy: {
//     type: Types.ObjectId,
//     ref: 'User',
// },
    
// }, {
//   timestamps: true
// })

// export default model('Cart', CartSchema)

 //import { BadUserRequestError, UnAuthorizedError } from "../errors/error.js";
// import Discount from "../models/discount.model.js"
// export default function Cart(oldCart) {
//   this.items = oldCart.items || {};
//   this.totalQuantity = oldCart.totalQuantity || 0;
//   this.totalPrice = oldCart.totalPrice || 0;

//   this.add = function (item, id) {
//     let storedItem = this.items[id];
//     if (!storedItem) {
//       storedItem = this.items[id] = { item: item, quantity: 0, price: 0 };
//     }
//     storedItem.quantity++;

//     const productTotalPrice = item.discount > 0 ? item.price - (item.price * (item.discount / 100)) : item.price;
//     storedItem.price = productTotalPrice * storedItem.quantity;

//     this.totalQuantity++;
//     this.totalPrice += productTotalPrice;
//   };

//   this.addShippingFee = function (shippingFee) {
//     const shippingId = 'shipping'; // Use a unique ID for the shipping fee item
//     if (!this.items[shippingId]) {
//       this.items[shippingId] = { item: { name: 'Shipping Fee', price: shippingFee }, quantity: 0, price: shippingFee };
//       //this.totalQuantity++;
//       this.totalQuantity;
//       this.totalPrice += shippingFee;
//     }
//   };

//   this.reduceByOne = function (id) {
//     const storedItem = this.items[id];
//     if (storedItem) {
//       storedItem.quantity--;

//       const productTotalPrice = storedItem.item.discount > 0 ? storedItem.item.price - (storedItem.item.price * (storedItem.item.discount / 100)) : storedItem.item.price;
//       storedItem.price = productTotalPrice * storedItem.quantity;

//       this.totalQuantity--;
//       this.totalPrice -= productTotalPrice;

//       if (storedItem.quantity <= 0) {
//         delete this.items[id];
//       }
//     }
//   };

//   this.removeItem = function (id) {
//     const storedItem = this.items[id];
//     if (storedItem) {
//       this.totalQuantity -= storedItem.quantity;
//       this.totalPrice -= storedItem.price;
//       delete this.items[id];
//     }
//   };
//   this.applyCoupon = async function(couponId,req){
//     const discount = await Discount.findOne({couponCode:couponId})
//     if(!discount) throw new UnAuthorizedError("You dont have a coupon")
//     if(discount.couponValid < Date.now()) throw new BadUserRequestError("Coupon has expired")
//     if(discount.user === req.user._id){
//       throw new UnAuthorizedError("You have used this coupon")
//     }else{
//       discount.user = req.user._id
//       await discount.save()
//     }
//     this.totalQuantity;
//     this.totalPrice = this.totalPrice - discount.couponValue
//   }

//   this.generateArray = function () {
//     let arr = [];
//     for (const id in this.items) {
//       arr.push(this.items[id]);
//     }
//     return arr;
//   };
// }

import { BadUserRequestError, UnAuthorizedError } from "../errors/error.js";
import Discount from "../models/discount.model.js"
export default function Cart(oldCart) {
  this.items = oldCart.items || {};
  this.totalQuantity = oldCart.totalQuantity || 0;
  this.subtotal = oldCart.subtotal || 0;
  this.discount = oldCart.discount || 0;
  this.shippingFee = oldCart.shippingFee || 0
  this.VAT = oldCart.VAT || 0,
  this.total = oldCart.totalPrice || 0;


  //add item to cart
  this.add = function (item, id) {
    let storedItem = this.items[id];
    if (!storedItem) {
      storedItem = this.items[id] = { item: item, quantity: 0, price: 0 };
    }
    storedItem.quantity++;
    const productTotalPrice = item.discount > 0 ? item.price - (item.price * (item.discount / 100)) : item.price;
    storedItem.price = productTotalPrice * storedItem.quantity;
    this.totalQuantity++;
    this.subtotal += productTotalPrice;
    this.discount = 0;
    this.shippingFee = this.items.shipping? this.items.shipping.price : 0
    this.VAT = (7.5/100)*this.subtotal;
    this.total = this.subtotal + this.discount + this.shippingFee + this.VAT;
  };

  this.addShippingFee = function (shippingFee) {
    const shippingId = 'shipping'; // Use a unique ID for the shipping fee item
    if (!this.items[shippingId]) {
      this.items[shippingId] = { item: { name: 'Shipping Fee', price: shippingFee }, quantity: 0, price: shippingFee };
    }
  };

  //reduce cart by one
  this.reduceByOne = function (id) {
    const storedItem = this.items[id];
    if (storedItem) {
      storedItem.quantity--;
      const productTotalPrice = storedItem.item.discount > 0 ? storedItem.item.price - (storedItem.item.price * (storedItem.item.discount / 100)) : storedItem.item.price;
      storedItem.price = productTotalPrice * storedItem.quantity;
      this.totalQuantity--;
      this.subtotal -= productTotalPrice ;
      this.discount = 0;
      this.shippingFee = this.items.shipping? this.items.shipping.price : 0
      this.VAT = (7.5/100)*this.subtotal;
      this.total = this.subtotal + this.discount + this.shippingFee + this.VAT;
      if (storedItem.quantity <= 0) {
        delete this.items[id];
      }
    }
    if(this.totalQuantity <= 0){
      delete this.items['shipping'];
    }
  };
//remove all the items
  this.removeItem = function (id) {
    const storedItem = this.items[id];
    if (storedItem) {
      this.totalQuantity -= storedItem.quantity;
      this.subtotal -= storedItem.price;
      this.discount = 0;
      this.shippingFee = this.items.shipping? this.items.shipping.price : 0
      this.VAT = (7.5/100)*this.subtotal;
      this.total = this.subtotal + this.discount + this.shippingFee + this.VAT;
      delete this.items[id];
    }
    if (this.totalQuantity <= 0){
      delete this.items['shipping']
    }
  };

  //apply coupons
  this.applyCoupon = async function(couponId,req){
    const discount = await Discount.findOne({couponCode:couponId})
    if(!discount) throw new UnAuthorizedError("You dont have a coupon")
    if(discount.couponValid < Date.now()) throw new BadUserRequestError("Coupon has expired")
    //const userId = req.user._id
    //const user = discount.user.indexOf(userId)
    const user = discount.user.findIndex((user) => new String(user).trim() === new String(req.user._id).trim())
    if(user !== -1) {
      throw new UnAuthorizedError("you already used this coupon")
    }else{
      discount.user.push(req.user._id)
      await discount.save()
    }
    this.totalQuantity;
    this.subtotal 
    this.discount = discount.couponValue;
    this.shippingFee 
    this.VAT 
    this.total = this.subtotal - this.discount + this.shippingFee + this.VAT;
  }

  this.generateArray = function () {
    let arr = [];
    for (const id in this.items) {
      arr.push(this.items[id]);
    }
    return arr;
  };
}

