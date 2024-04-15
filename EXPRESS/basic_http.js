//basic http response using the nodejs
//see the freecodecam example to see how difficult it is to server by using native http module
/*
    say we have to serve the html file 
    first we need to send the html file
    if incase we have css included in html file then browser agains send the request to our server
    for that css file then we again check that css file path with the incoming url to send the
    corrsponding css file
    same thing repeat for the javascript file which is included in the html file

*/

const http = require('http')
const fs =require('fs');

const server = http.createServer((req, res) => {
    
    if ( req.url == "/")
    {

        /*
            IF WE ARE USING THE BOTH WRITEHEAD AND WRITE METHOD THEN MAKE SURE WRITEHEAD METHOD SHOULD 
            BE PUT TOP OTHER WISE WE GET ERROR 
            The reason for this order is due to the nature of the HTTP protocol.
            https://chat.openai.com/c/20a0ebbe-5268-4701-af10-d5bb6e99bae6 //for reference
        */

       //writing the status code along with the http headers
        res.writeHead(200, { 'Content-Type': 'text/plain'});
       
        res.write( `path = / chunk1`);
        //writing the response in the chunks 
        res.write( `path = / chunk2`);
        
        // writing the remaining headers 
        
        res.end('path = / response closed');
        // res.write('check')//error because response is closed
    }
    else if( req.url == '/about')
    {
        res.statusCode =  200 ;

        res.setHeader('Content-Type', 'text/plain') ;
        res.setHeader('temp' ,'tempheader');
        res.write('chunk1\n')
        res.end('about page');
    }
    else if( req.url == '/getFile')
    {
       res.writeHead(200,{'Content-Type': 'text/file'});
       
      let readStream = fs.createReadStream('./basic_http.js');
    
      readStream.pipe(res);

    }
    else 
    {
        res.write('404 page not found');
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end();
    }   
}
);

server.listen(3000, () => {
    console.log('Server running on port 3000');
});