let crypto = require('crypto');
let fs = require('fs')
let public_key = get_public_key() ;
let private_key = get_private_key();

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

//encrypts with the public key and returns the raw buffer ( buffer object)  
function encrypt_with_public_key ( data )
{
    let buffer = Buffer.from(data , 'utf-8');
    return crypto.publicEncrypt(public_key,buffer);
}

//accepts the raw buffer ( binary ) and returns the decrypted buffer
function decrypt_with_private_key(data)
{
    return crypto.privateDecrypt(private_key,data);
}

let hell ={
    name: 'hell',
    age: 99
};

//this is the manditory step  inorder to encrypt we have to convert the object into the string format
let data = JSON.stringify(hell);

let encrypted_data = encrypt_with_public_key(data);

console.log( encrypted_data.toString());


let decrypted_data = decrypt_with_private_key(encrypted_data);

console.log( JSON.parse(decrypted_data.toString()));