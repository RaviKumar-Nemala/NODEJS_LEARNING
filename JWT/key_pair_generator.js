const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

function store_keys( filename , data)
{
    fs.writeFile( path.join(__dirname , filename +'.pem' ) , data , ( err , data)=>
    {
        if ( err )
        {
            console.log( err.message);
            return;
        }
    } );
}

const generate_key_pairs =  ()=>
{
    const key_pair = crypto.generateKeyPairSync('rsa' ,{
        modulusLength : 4040,
        publicKeyEncoding:{
            type : 'pkcs1',
            format : 'pem'
        },
        privateKeyEncoding:{
            type :'pkcs1',
            format :'pem'
        }
    });

    // console.log( key_pair.privateKey );
    // console.log( key_pair.publicKey );

    return key_pair;

}
let keys = generate_key_pairs();

store_keys( 'public_key' , keys.publicKey);
store_keys( 'private_key' , keys.privateKey);