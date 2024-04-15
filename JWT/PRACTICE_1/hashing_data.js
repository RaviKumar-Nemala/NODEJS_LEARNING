let crypto = require('crypto');
let hash = crypto.createHash('sha256');

let my_message = 'RAVI_KUMAR';

//now the above message is stored in the hash function not yet hashed
hash.update(my_message);

//generates the hash value of the stored message( generated value size = 64bytes )
//typically represented as a 64-character hexadecimal string. ( if the encoding type is provided in the digest function)
let hashed_message = hash.digest('hex');

console.log( hashed_message.length );

function are_same_hashes( data , prev_hash)
{
    //we cannot use the digest method multiple times on the same hash object so we are creating the 
    //new hash object here 

    let hash = crypto.createHash('sha256');
    hash.update(data);
    if ( hash.digest('hex') == prev_hash)
    {
        return true;
    }
    else   
        return false;
}

if ( are_same_hashes('RAVI_KUMAR',hashed_message) )
{
    console.log('hashes are same');
}
else   
    console.log('hashes are not same');
