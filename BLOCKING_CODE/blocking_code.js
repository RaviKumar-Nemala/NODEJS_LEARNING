//create http server instance
const http  = require('http');

const server = http.createServer((req, res) => {
   
    if ( req.url == "/")
    {
        res.end( `<h1>HOME PAGE </h1>` );
        //due to this loop new incoming requests will not be processes until this loop will be completed
        for ( let i  =0 ; i < 100000 ;i  ++ )
        {
            for ( let j = 0 ; j < 1000000 ;j ++ )
            {

            }
        }
        return;
    }
    if ( req.url == "/about" )
    {
        res.end( `<h1>ABOUT PAGE </h1>` );
        return;
    }
    else 
        res.end(`<h1>ERROR PAGE </h1>` );
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});

