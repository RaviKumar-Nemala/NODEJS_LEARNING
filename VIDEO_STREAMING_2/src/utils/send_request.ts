import axios , { AxiosRequestConfig} from 'axios';
import { Http_Request_Config } from '../types/my_types';

function send_get_request( config :Http_Request_Config ) 
{
    

    
}
function send_post_request( config :Http_Request_Config ) 
{
    let { url , data  , auth , headers  , method } = config ;

    let axios_req_config : AxiosRequestConfig = { url , data , method   };
    if ( headers != undefined ) {
        axios_req_config.headers = headers
    }
    if( auth != undefined) {
        axios_req_config.auth = auth
    }
   
    console.log( axios_req_config);
    axios(axios_req_config)
    .then((data)=>
    {
        console.log( data );
    })
    .catch (  (err)=>
    {
        console.log( err );
    }
    );

}
export const  send_request   =  async( config:Http_Request_Config)=>
{
    let method =  config.method
    if ( method =='post')
    {
        await send_post_request( config);   
    }
    else if ( method == 'get')
    {

    }
    else if (  method =='put'){

    }

}