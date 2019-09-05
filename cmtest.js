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
  


function resultfunction(data){
  console.log("----",data);
}


let Fetch = require('node-fetch');

// const requestBody ={
//   uri:`/${projectKey}/products`,
//   method:"GET"
//   textLineItems:[{productId:"d5b269f9-bb31-4ab0-89a3-1992701fcc90",quantity:2}]
// }

//17878af0-8b57-44c8-8b51-706d6b1ddc38

let cartBody={
  currency:"USD",
  customerEmail:"d@gmail.com",
  lineItems:[{productId:"102ee9c3-b562-43d3-8171-aac9f0f010ed",quantity:2}],
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


// curl https://auth.commercetools.co/oauth/token -X POST \
//   --basic --user "vKRL7Qm6stqeJsxvtCveiHeH:0PBLQp7ZIf-idcFHUdJDxCvdWzsYMxdF" \
//   -d "grant_type=client_credentials&scope=manage_project:dineshgowda"




let orderBody={
  uri:`/${projectKey}/carts`,
  method:"POST",
  body:JSON.stringify(cartBody)
}

let getCartBody ={
  uri:`/${projectKey}/carts/1f63f0ef-3dc9-4be9-aa26-736e8db4d2e3`,
  method:"GET"
}


let orderCreateBody ={
  uri:`/${projectKey}/orders`,
  method:"POST",
  body:JSON.stringify({id:"1f63f0ef-3dc9-4be9-aa26-736e8db4d2e3",version:1})
}

const requestBody ={
  uri:`/${projectKey}/products`,
  method:"GET"
}



module.exports.getAllProducts= async ()=>{
 return await client.execute(requestBody)
}


module.exports.createCart= async (orderDetails)=>{

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
console.log("888",cartBody);

let orderBody={
  uri:`/${projectKey}/carts`,
  method:"POST",
  body:JSON.stringify(cartBody)
}
  return await client.execute(orderBody)
}


module.exports.createOrder= async (cardId)=>{
  let orderCreateBody ={
  uri:`/${projectKey}/orders`,
  method:"POST",
  body:JSON.stringify({id:cardId,version:1})
  }
  return await client.execute(orderCreateBody);
}



module.exports.getCartDetails =async(cartId)=>{
  let getCartBody={
    uri:`/${projectKey}/carts/${cartId}`,
    method:"GET"
  }
  return await client.execute(getCartBody);
}