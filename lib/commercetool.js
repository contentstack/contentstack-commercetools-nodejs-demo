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
  


module.exports.createCart= async (orderDetails)=>{
  try{
    let cartBody={
      currency:"USD",
      customerEmail:"d@gmail.com",
      lineItems:orderDetails,
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
  return await client.execute(orderBody)
  } catch(err){
    console.log("Failed to create Cart. Error:"+err);
  }
}


module.exports.createOrder= async (cardId)=>{
  
  try {
    let orderCreateBody ={
      uri:`/${projectKey}/orders`,
      method:"POST",
      body:JSON.stringify({id:cardId,version:1})
    }
    return await client.execute(orderCreateBody);

  } catch(err){
    console.log("Failed to create Order. Error"+err);
  }

}

module.exports.getCartDetails =async(cartId)=>{
  
  try {
    let getCartBody={
      uri:`/${projectKey}/carts/${cartId}`,
      method:"GET"
    }
    return await client.execute(getCartBody);
  } catch(err){
    console.log("Failed to get Cart Details. Error"+err);
  } 
}