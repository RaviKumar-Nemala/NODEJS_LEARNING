//install express in globally first 
let { log } =  require('../MODULES/logger');

let express = require('express');

let app = express();

app.get('/', (req, res) => {
    res.status(200).send('Hello');
});

app.get('/about', (req, res) => {
    res.status(200);
    res.setHeader('Content-Type', 'text/plain');
    res.write('hello from about page!');
    res.end();
}
)
// if any of the endpoints are not matching then this will take care of that request
app.all('*' ,(req,res)=>
{
     log ( req.url + ' INTERCEPTED' )
     res.status(404).send('Not Found');
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

