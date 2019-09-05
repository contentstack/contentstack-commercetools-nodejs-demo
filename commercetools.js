
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

// const requestBody={
//   uri:`/${projectKey}/orders`,
//   method:'POST',
//   body:JSON.stringify({"id": "df07eeac-1e3f-4fb0-a09c-6ac5222bcd53",version:1})
// }

// const requestBody={
//   uri:`/${projectKey}/carts/df07eeac-1e3f-4fb0-a09c-6ac5222bcd53`,
//   //body:JSON.stringify({"id": "df07eeac-1e3f-4fb0-a09c-6ac5222bcd53",version:1})
// }


// const requestBody={
//   uri:`/${projectKey}/shopping-lists/`,
//   method:"POST",
//   body:JSON.stringify({"name":{"en":"shoppinhdinesh"}})
// }


let b ={
  "name":{
    "en":"shoppingdinesh",
  },
  description:{"en":"This is my testing cart"},
  textLineItems:[{
    id:1,
    name:"a",
    description:"this is first",
    quantity:10
  },{
    id:2,
    name:"b",
    description:"this is second",
    quantity:20
  }]
}

// const requestBody={
//   uri:`/${projectKey}/shopping-lists/7d64eb64-14a2-46cc-9892-ee36e3132967`,
//   method:"GET",
//   body:JSON.stringify(b)
// }

console.log("___",client);

const requestBody ={
  uri:`/${projectKey}/products`,
  method:"GET"
}

// const reqBody={
//   {
//   uri:`/${projectKey}/carts`,
//   method:'POST',
//   body:JSON.stringify({"currency": "USD"})
// }



// export function async getAllProducts(){
//   return await client.execute(requestBody);
// } 




//  textLineItems:[{productId:"d5b269f9-bb31-4ab0-89a3-1992701fcc90",quantity:2}]

let cartBody={
  currency:"USD",
  customerEmail:"d@gmail.com"
}

let orderBody={
  uri:`/${projectKey}/me/carts`,
  method:"POST",
  body:JSON.stringify(cartBody)
}

function createOrder(){

}


let getAllProducts = async() =>{
  return await client.execute(requestBody);
}


module.exports={ getAllProducts};



client.execute(orderBody)
.then(resultfunction)
.catch(error => { console.log("====",error.body)});

