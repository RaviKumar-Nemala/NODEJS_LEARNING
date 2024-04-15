
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