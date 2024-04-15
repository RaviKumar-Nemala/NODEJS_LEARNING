let crypto = require('crypto');
let base64url = require('base64url');
let fs = require('fs');

let get_token = require('./create_jwt');
//used for verifying the token
let verify_function = crypto.createVerify('RSA-SHA256');

function get_public_key()
{
    let data = fs.readFileSync('../public_key.pem','utf-8');
    return data;
}
function get_private_key()
{
    let data = fs.readFileSync('../private_key.pem', 'utf8');
    return data;
}


function decode_jwt( )
{
    let token = get_token();
    let [ encoded_header , encoded_payload , encoded_signature ] = token.split('.')
    
    let decoded_header = base64url.decode( encoded_header )
    let decoded_payload = base64url.decode(encoded_payload);

    console.log( decoded_header);
    console.log( decoded_payload);

    verify_function.write(encoded_header + '.' + encoded_payload);
    verify_function.end();

    //if the public key is corrupted then we directly get the error 
    let public_key = get_public_key();

    let verified = verify_function.verify(public_key, encoded_signature, 'base64');
    
    console.log( verified);

}

decode_jwt();
