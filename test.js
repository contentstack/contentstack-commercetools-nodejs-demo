const { getAllProducts } = require('./commercetools')


 getAllProducts().then((res)=>{
  	console.log(res.body.results[0]);
 })