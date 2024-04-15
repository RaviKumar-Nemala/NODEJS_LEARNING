
export class Api_Error extends Error
{
    message :string ;
    statusCode : number ;
    status : string;

    constructor( message:string, statusCode:number = 400)
    { 
        super( message);
        this.message =message ; 
        this.statusCode = 400;
        this.status = 'fail'
    }
}