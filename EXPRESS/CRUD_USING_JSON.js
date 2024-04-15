let fs  = require('fs');

let { log } = require('../MODULES/logger.js');

let students = [] ;

let readData = ( )=>
{
    fs.readFileSync('./mydata.json', 'utf8', (err, data) =>
    {
        if (err)
        {
            log(err.message);
        }
        else
        {
            log( data);
            if( !data )
            {
                students = [];
            }
            else {
                students= JSON.parse(data);
                log ( students );
            }
        }
    })
}

let writeFile = ( )=>
{
    fs.writeFileSync('./mydata.json', JSON.stringify(students,null,2), 'utf-8', (err) =>
    {
        if (err)
        {
            log(err.message);
        }
        else
        {
            log( 'data written successfully');
        }
    })
}

let addStudent =  ( data ) =>
{
    students.push(data);
    writeFile();
}
let removeStudent = ( id )=>
{
    log ('called');
     let idx =  students.findIndex(student => student.id == id );
     if ( idx ==-1){
        log ( 'Could not find student')
        return;
     }
    //  log (idx);
    students.splice(idx ,1 );
    // log( students);
    writeFile();
}
let updateStudent = ( oldid, updStu ) =>
{
    let idx= students.findIndex((student)=> student.id == oldid)
    if ( idx == -1 )
    {
        log('INVALID ID ')
        return;
    }
    students [ idx ] = updStu;
    writeFile();
}
let stu1 = 
{
    id : 1 ,
    name : 'ravi',
    year :  4
};
let stu2 =
{
    id :  2 ,
    name:'kumar',
    year: 3
}

readData();

addStudent(stu1);
addStudent(stu2);
updateStudent( 1 , { name:'updname', year:3,id:44});
removeStudent(44)
log(students);
