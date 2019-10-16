 const { createClient } = require('@commercetools/sdk-client')
  const { createAuthMiddlewareForClientCredentialsFlow } = require('@commercetools/sdk-middleware-auth')
  const { createHttpMiddleware } = require('@commercetools/sdk-middleware-http')
  const fetch = require('node-fetch')

  const projectKey = 'dineshgowda'

  const authMiddleware = createAuthMiddlewareForClientCredentialsFlow({
    host: 'https://auth.commercetools.co',
    projectKey,
    credentials: {
      clientId: 'vKRL7Qm6stqeJsxvtCveiHeH',
      clientSecret: '0PBLQp7ZIf-idcFHUdJDxCvdWzsYMxdF',
    },
    scopes: ['manage_my_payments:dineshgowda manage_orders:dineshgowda manage_extensions:dineshgowda manage_my_profile:dineshgowda create_anonymous_token:dineshgowda manage_products:dineshgowda manage_customers:dineshgowda manage_order_edits:dineshgowda manage_my_orders:dineshgowda manage_project:dineshgowda introspect_oauth_tokens:dineshgowda manage_api_clients:dineshgowda manage_my_shopping_lists:dineshgowda manage_payments:dineshgowda'],
    fetch,
  })
  const httpMiddleware = createHttpMiddleware({
    host: 'https://api.commercetools.co',
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
      customerEmail:"d@gmail.com",
      lineItems:req.body,
      shippingAddress:{
        firstName:"Dinesh",
        lastName:"Gowda",
        streetName:"Tulinj",
        postalCode:"401209",
        mobile:"9987822412",
        city:"Nalasopara",
        state:"Illinois",
        country:"US"
      }
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