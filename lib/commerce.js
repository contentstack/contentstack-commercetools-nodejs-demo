
var btoa = require('btoa');
const request = require("request-promise");

function getUser()
{
  return new Promise((resolve, reject) => {
    const payload = `${btoa(config.commercetools.client_id + ':' + config.commercetools.client_secret)}`
    if(payload)
    return resolve(payload);
    return reject(err);
})
}


function getToken(req) {
  
   if (req.cookies && req.cookies.commercetoolsToken)
        return Promise.resolve(req.cookies.commercetoolsToken)
    return new getUser().then((token) => { 
        const refreshOptions = {
            method: 'POST',
            url: `https://auth.${config.commercetools.domain}/oauth/token?grant_type=client_credentials&scope=view_products:${config.commercetools.project_key}`,
             
            headers: {
              Authorization: `Basic ${token}`},
            json: true
        };
        return request(refreshOptions).then(resp => Promise.resolve(resp.access_token)).catch(e => Promise.reject(e))
    }).catch(e => Promise.reject(e))
}


function getProducts(token) {
  
  var options = {
    method: 'GET',
    url: `https://api.${config.commercetools.domain}/${config.commercetools.project_key}/products?where=masterData%28published%3Dtrue%29`,
    headers: {
        authorization: `Bearer ${token}`,
        json: true   
    }
};


console.log("options",options);
 
return request(options).then((products) => {
  var jsonn= JSON.parse(products);
  
    return Promise.resolve( { actions: jsonn, token: token} )
}).catch(e => Promise.reject(e))

}

module.exports.getActionsForRequest = (req, res) => {
   
    return getToken(req).then((token) => { 
        return getProducts(token, req.cookies.commercetoolsToken)
    }).then(({ actions, token }) => {
        if (!req.cookies || !req.cookies.commercetoolsToken)
            res.cookie('commercetoolsToken', token, { maxAge: 39600000, httpOnly: true }); // 11 hrs
        return Promise.resolve(actions)
    }).catch(e => Promise.reject(e))
}