import { AxiosRequestHeaders  , Axios , AxiosBasicCredentials } from "axios"
export interface Video_Input
{
    description:string ,
    filename : string ,
    size : number ,
    mimetype : string,
    content : Buffer,
    course_id :number
}
export interface User_Input
{
    username : string ,
    password: string
}
export interface User_Dto
{
    username:string,
}
export interface User_Relations
{
    courses? : boolean
    authority?:boolean
}

export interface User_Course_Check
{
    course_id : number,
    user_id : number,
    role : string
}
export interface COURSE_VIDEO_CHECK
{
    user_id :number ,
    course_id:number ,
    role: string,
    video_id : number
}
export interface Video_Upload_Metadata
{
    mime_type  : string,
    file_size : number
}
type authorization = {
    username :string,
    password:string
}
export interface Http_Request_Config
{
    url : string  ,
    method : "get"|"post"|"put"|"delete",
    data?:Object,
    headers?:AxiosRequestHeaders
    auth?:AxiosBasicCredentials
}
export interface BucketParams {
    Bucket: string;
    Key : string;
    ContentLength?: number;
    ContentType?: string;
    Range?: string; // Add this line
}
export interface BucketDeleteParams {
    bucket_name:string,
    bucket_key:string
}
