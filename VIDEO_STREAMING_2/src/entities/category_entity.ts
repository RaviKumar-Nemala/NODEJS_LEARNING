import { PrimaryGeneratedColumn ,Entity , Column , OneToMany } from "typeorm";
import {Course_Entity } from './course_entity'

@Entity({name :'category'})
export class Category_Entity
{
    @PrimaryGeneratedColumn('uuid')
    category_id : string;

    @Column({name :'category_name' , unique:true ,type :'varchar'})
    category_name:string

    @OneToMany(()=>Course_Entity , course_entity=>course_entity.category)
    courses:Course_Entity[]
}