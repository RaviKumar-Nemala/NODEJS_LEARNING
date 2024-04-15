const { log } = require('../MODULES/logger');

const express = require('express');

const app = express();

//all the files in the public directory will be directly accessible to everyone(browser)
// app.use( express.static('public') );


app.get('/getFile', (req, res) =>
{
    log ( 'get file invoked ' , req.url);
    //we have to set the absolute path for this sendfile method 
    return res.status(200).sendFile( require('path').join(__dirname, './public/index.html') );
}
);

//if we don't have this  method defaultly index.html will be serverved because 
//index.html considered as the root  file 
app.get('/', (req, res) =>
{
    console.log( req.headers)
    return res.status(200).setHeader('Content-Type', 'text/plain').end('hello world');
}
)

//only one will be called sequence matters
app.get('/', (req, res) =>{
    console.log('second same router');
    return res.send('SECOND ROUTE');
})

app.get('/getHeaders', (req, res) =>
{
    res.statusCode = 200 ;

    log( req.headers );
    for ( let [ key , value ] of Object.entries(req.headers) ) 
    {
        log ( key + ': ' + value)
    }
    log ( req.ip)
    return res.end('ok');
})

app.listen(3000, (req, res) =>
{
    log( 'server listening on port 3000')
}
);