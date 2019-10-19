const { createClient } = require('@commercetools/sdk-client')
const { createAuthMiddlewareForClientCredentialsFlow } = require('@commercetools/sdk-middleware-auth')
const { createHttpMiddleware } = require('@commercetools/sdk-middleware-http')
const fetch = require('node-fetch')
const projectKey = config.commercetools.project_key;
const authMiddleware = createAuthMiddlewareForClientCredentialsFlow({
    host: `https://auth.${config.commercetools.host}`,
    projectKey,
    credentials: {
      clientId: config.commercetools.client_id,
      clientSecret: config.commercetools.client_secret,
    },
    scopes:config.scopes,
    fetch,
  })
  const httpMiddleware = createHttpMiddleware({
    host: `https://api.${config.commercetools.host}`,
    fetch,
  })
  const client = createClient({
    middlewares: [authMiddleware, httpMiddleware],
  })
  
module.exports.getAllProducts =async ()=>{
  try {
    let productBody={
      uri:`/${projectKey}/products`,
      method:"GET"
    }
  return await client.execute(productBody)
  }catch(err){
    console.log("Error fetching products information. Error"+err);
  }

}  

module.exports.createCart= async (req,res,next)=>{
  try{
    let cartBody={
      currency:"USD",
      customerEmail:"dummy@gmail.com",
      lineItems:req.body
    }
  let orderBody={
    uri:`/${projectKey}/carts`,
    method:"POST",
    body:JSON.stringify(cartBody)
  }
   let cartResponse=await client.execute(orderBody);
  if(cartResponse.body.id) 
    res.send({status:200,cartId:cartResponse.body.id});

  } catch(err){
    console.log("Failed to create Cart. Error:"+err);
    res.send({error:JSON.stringify(err)})
  }
}

module.exports.createOrderFromCart= async (req,res)=>{
  
  try {
    let orderCreateBody ={
      uri:`/${projectKey}/orders`,
      method:"POST",
      body:JSON.stringify({id:req.body.id,version:1})
    }
    let orderResponse= await client.execute(orderCreateBody);
    if(orderResponse.body.id){
      res.send({status:200, orderId:orderResponse.body.id})
    }

  } catch(err){
    console.log("Failed to create Order. Error"+err);
    res.send({error:JSON.stringify(err)})

  }

}

module.exports.getCartDetails =async(req,res)=>{ 
  try {
    let getCartBody={
      uri:`/${projectKey}/carts/${req.params.cartId}`,
      method:"GET"
    }
    let cart= await client.execute(getCartBody);
    res.render('pages/payment',{
    totalPrice:cart.body.totalPrice.centAmount/100,
    cartId:cart.body.id
    })
  } catch(err){
    console.log("Failed to get Cart Details. Error"+err);
  } 
}