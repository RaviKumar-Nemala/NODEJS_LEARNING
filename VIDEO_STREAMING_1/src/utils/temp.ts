import crypto from 'crypto';
import fs from 'fs';
import path from 'path'
function store_keys (  key:string , file_name : string )
{
    fs.writeFile(path.join(__dirname , `../keys/${file_name}.pem`) , key , ( err )=>
    {
        if ( err )
        {
            console.log( err.message);
        }
        else 
            console.log( 'data written into the file')
    } );
}

function generate_keys()
{
    const key_pair = crypto.generateKeyPairSync( 'rsa' ,
    {
        modulusLength : 4040,
        publicKeyEncoding:{
            type : 'pkcs1',
            format:'pem'
        },
        privateKeyEncoding:{
            type : 'pkcs1',
            format : 'pem'
        }
    });

    let {publicKey , privateKey} = key_pair;

    store_keys(publicKey , 'public');
    store_keys(privateKey , 'private');

}
function get_public_key ( )
{
    let temp ;
    let  public_key = fs.readFile( path.join(__dirname , '../keys/public.pem') , ( err , data)=>
    {
        if( err)
        {
            console.log( err.message);
            throw err;
        }
        console.log( data);
    }) 
    console.log( public_key )
}

get_public_key () ;