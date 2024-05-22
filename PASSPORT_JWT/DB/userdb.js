let { PrismaClient} = require('@prisma/client');

let db = new PrismaClient();

class UserDb
{
    constructor(){

    }

    async add_user(email , password)
    {
        // console.log( email );
        // console.log( password );

        let user = await db.user.create({
            data:
            { 
                email : email ,
                password : password
            }
        }
        );

        console.log( user );
        let res = await db.authorities.create(
            {
                data : {
                    userid : user.id ,
                    role : 'USER'
                }    
            }
        )
        // console.log( res );
        return res ;
    }
    async add_admin ( email,password )
    {
        console.log( email  );
        console.log( password);

        let user = await db.user.create({
            data:
            { 
                email : email ,
                password : password,
            }
        });

        let res  = await db.authorities.create(
            {
                data : {
                    userid : user.id ,
                    role : 'ADMIN'
                }
            }
        )
        return res;
    }

    async get_user(email )
    {
        // console.log( email);
        // console.log( db.user );

         let res = await db.user.findUnique(
            {
                where: {
                    email : email 
                },
                include:{
                    authorities: true
                }
            }
         );
        //  console.log( res );
        //  console.log( res[0] );
        //  return res[0];
        return res;
    }
}

module.exports = UserDb;