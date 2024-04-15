import { Video_Input } from '../types/my_types';
import { AppDataSource } from '../config/db_config';
import { Repository } from 'typeorm';
import { Video_Entity } from '../entities/video_entity';
import { rmSync } from 'fs';
export class Video_Db
{
    private video_repo : Repository<Video_Entity>;
    constructor( )
    {
        this.video_repo = AppDataSource.getRepository(Video_Entity);
    }

    async add_video( video_input:Video_Input)
    {
        try{
        let res = await this.video_repo.insert(
            {
                description : video_input.description,
                filename : video_input.filename,
                size : video_input.size,
                mime_type : video_input.mimetype,
                content : video_input.content,
                course_id : video_input.course_id
            }
        );
        console.log(res);
        return res;
    }
        catch ( err : any )
        {
            if ( err.code == 'ER_DUP_ENTRY')
            {
                console.log ( 'duplicate entry')
            }
            else
            console.log(err.message);
        }
    }
}