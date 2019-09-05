# Contentstack Auto Reload On Publish | Using Pusher.js

## Server Side Changes

###  Install pusher.js

Use following command to install pusher.js
 ```
    npm install pusher --save
```
###  Setup realtime.js
 Inside you lib folder create **realtime.js** to manage real time events via [Pusher Server Api](https://pusher.com/docs/server_api_guide). Pusher config is available in your pusher account **App Keys** section.
``` javascript
const Pusher = require('pusher');
const pusher = new Pusher({
    appId: 'APP_ID',
    key: 'APP_KEY',
    secret: 'APP_SECRET',
    cluster: 'APP_CLUSTER'
});
  
const broadcast = (channel, event, data={}) 
  => pusher.trigger(channel, event, data);
  
module.exports.broadcast = broadcast;
 ```
### Update Webhook Route
Update your webhook route to broadcast 'publish' event on channel with name set to the uid of the published entry.Set up [Contentstack Webhook](https://www.contentstack.com/docs/guide/webhooks)  to call the webhook route on entry publish of any contenttype of the respective environment.
``` javascript
const broadcast = require('../lib/realtime').broadcast
app.post('/webhook', function(req, res){
   	res.header("Content-Type", "text/plain");
   	res.header("statusCode", "200");
   	res.set("Connection", "close");
   	res.status(200)
   	res.send('success')
   	broadcast(req.body.data.entry.uid, 'publish')
})
  ```
## Client / Chrome Extension Side Changes
Include [Pusher client](https://pusher.com/docs/client_api_guide) library in your client site using the chrome extension 
```html
<script src="https://js.pusher.com/4.3/pusher.min.js"></script>
```
Add the following javascript snippet to client site which will listen for publish event on channel with entry uid as name
``` javascript
var pageRef = document.body.getAttribute('data-pageref');
var pusher = new Pusher("APP_KEY", {
      cluster: "APP_CLUSTER",
      forceTLS: true
});
var channel = pusher.subscribe(pageRef);

channel.bind("publish", function(data) {
    location.reload();
});
 ```