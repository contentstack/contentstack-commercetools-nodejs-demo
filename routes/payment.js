var express = require('express');
var router = express.Router();



router.get('/payment',(req,res,next)=>{
	console.log("=====");
	try{
	res.render("pages/payment");
	}catch(e){
		console.log(e);
		next(e)
	}
})


module.exports=router;