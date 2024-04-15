let { Transform } = require("stream");

let { createReadStream , createWriteStream} = require('fs');

class MyTransform extends Transform{

    constructor()
    {
        super ();
    }

    _transform( chunk , encoding , callback)
    {
        console.log( chunk.length);
        this.push(chunk);
        callback();
    }
}
try{
let readStream = createReadStream('./writeFile.txt' , { encoding : 'utf-8', highWaterMark : 60_000});

let writeStream = createWriteStream('./new_writeFile.txt');

let mytransform = new MyTransform();

readStream.pipe( mytransform).pipe( writeStream );

}
catch ( err )
{
    console.log( err );
}