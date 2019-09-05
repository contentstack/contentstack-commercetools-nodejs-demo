var express = require('express');
var router = express.Router();

const { createOrder, createCart, getCartDetails } = require('../lib/commercetool');

async function createOrderFn(req,res,next){
	let cartResponse = await createCart(req.body);
	if(cartResponse && cartResponse.body && cartResponse.body.id){
		let orderResponse = await createOrder(cartResponse.body.id)
		if(orderResponse.body.id){
			res.send({status:200, orderId:orderResponse.body.id})
		}
	}
}

async function createCartFn(req,res,next){
	let cartResponse = await createCart(req.body);
	res.send({status:200,cartId:cartResponse.body.id});
}

async function orderPayment(req,res,next){
	let cart=await getCartDetails(req.params.cartId);
	console.log(cart.body.totalPrice.centAmount/100,"dollar")
	res.render('pages/payment',{
		totalPrice:cart.body.totalPrice.centAmount/100,
		cartId:cart.body.id
	})
}

async function createOrderFromCart(req,res,next){

	console.log(req.body.id,"----")
	let orderResponse = await createOrder(req.body.id)
		if(orderResponse.body.id){
			res.send({status:200, orderId:orderResponse.body.id})
	}

}	

module.exports = { createOrderFn, createCartFn, orderPayment, createOrderFromCart };