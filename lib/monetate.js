const privateKey = require('fs').readFileSync(config.personalize.key_path);
const request = require("request-promise");
const jwt = require('jsonwebtoken');
const crypto = require("crypto");
const requestIp = require('request-ip');

function getToken() {
    return new Promise((resolve, reject) => {
        const payload = [{
            'username': config.personalize.api_username,
            'iat': Math.floor(Date.now() / 1000)
        }, privateKey, { algorithm: 'RS256' }]
        return jwt.sign(...payload, (err, token) => {
            if (err)
                return reject(err)
            resolve(token);
        });
    })
}

function getRefreshToken(req) {
    if (req.cookies && req.cookies.monetateToken)
        return Promise.resolve(req.cookies.monetateToken)
    return getToken().then((token) => {
        const refreshOptions = {
            method: 'GET',
            url: 'https://api.monetate.net/api/auth/v0/refresh/',
            qs: { ttl: '43200' },
            headers: {
                authorization: `JWT ${token}`,
                'content-type': 'application/json',
                accept: 'application/json'
            },
            json: true
        };
        return request(refreshOptions).then(resp => Promise.resolve(resp.data.token)).catch(e => Promise.reject(e))
    }).catch(e => Promise.reject(e))
}


function getActions(token, monetateId, clientIp,  pageType = 'home', path = '/') {
    var options = {
        method: 'POST',
        url: 'https://api.monetate.net/api/engine/v1/decide/contentstack',
        headers: {
            authorization: `Token ${token}`,
            'content-type': 'application/json'
        },
        body: {
            channel: config.personalize.channel,
            events: [{
                    eventType: 'monetate:decision:DecisionRequest',
                    requestId: crypto.randomBytes(16).toString("hex"),
                    includeReporting: true
                },
                {
                  "eventType": "monetate:context:IpAddress",
                  "ipAddress": clientIp
                },
                {
                    eventType: 'monetate:context:PageView',
                    pageType,
                    url: path
                }
            ]
        },
        json: true
    };
    if (monetateId)
        options.body.monetateId = monetateId
    return request(options).then((decision) => {
        if (decision.meta.code !== 200 || !decision.data.responses || !decision.data.responses[0]) {
            console.log(`Decision Error : ${JSON.stringify(decision)}`)
            return Promise.reject(`Decision Error`)
        }
        return Promise.resolve({ actions: decision.data.responses[0].actions, monetateId: decision.meta.monetateId, token })
    }).catch(e => Promise.reject(e))
}

module.exports.getActionsForRequest = (req, res, pageType, path) => {
    const clientIp = requestIp.getClientIp(req); 
    return getRefreshToken(req).then((token) => {
        return getActions(token, req.cookies.monetateId, clientIp , pageType, path)
    }).then(({ actions, monetateId, token }) => {
        if (!req.cookies || !req.cookies.monetateToken)
            res.cookie('monetateToken', token, { maxAge: 39600000, httpOnly: true }); // 11 hrs
        if (!req.cookies || !req.cookies.monetateId)
            res.cookie('monetateId', monetateId);
        return Promise.resolve(actions)
    }).catch(e => Promise.reject(e))
}