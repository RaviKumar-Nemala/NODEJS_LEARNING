let crypto = require('crypto');
let base64url = require('base64url');
let fs = require('fs');

let signature_function =  crypto.createSign('RSA-SHA256');

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


function get_token(){
//RS256 MEANS USING THE ASYNMETTRIC CRYPTO ALGO LIKE RSA AND USING SHA-256 HASING ALGORITHM FOR CREATING
//HASHES
let headers = { 
    algo : 'RS256',
    typ : 'JWT'
};
let payload = {
    userid : 'ravi@gmail.com',
    iat : 4564566,
    eat : 989858585,
    admin :true
};

let header_string = JSON.stringify(headers);
let payload_string = JSON.stringify(payload);

let base64url_header = base64url.encode(header_string);

let base64url_payload = base64url.encode(payload_string);

// console.log( base64url_header);
// console.log( base64url_payload);

signature_function.write(base64url_header + '.' + base64url_payload);
signature_function.end();

let private_key = get_private_key();

let res_sign  = signature_function.sign(private_key);

let base64_sign = base64url.encode(res_sign);

// console.log( base64_sign);

let token = base64url_header + '.' + base64url_payload + '.' + base64_sign;
console.log( token);
return token;
}

module.exports = get_token;