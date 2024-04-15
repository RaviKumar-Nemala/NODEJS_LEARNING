let { log } = require('../MODULES/logger');

let  fs = require('fs');
let path = require('path');
let express  = require('express');
let app  = express();
const bodyParser = require('body-parser');

//Middleware to parse the request body for JSON
app.use(bodyParser.json());


let students = [] ;
let dataFile = path.join(__dirname, './mydata.json');
const EMPTY_DATA ="NO RECORDS FOUND";

app.listen( 3000 , ()=>
{
     log( 'server  listening on the port 3000 ');
     init();
}
);

function init()
{
    // log('called');
    log(dataFile);
    try{
    let data =  fs.readFileSync(dataFile, 'utf-8' )
        log( data);
        if ( data.length == 0 )
        {
            students = [];
        }
        else    
            students= JSON.parse(data);
    }
    catch( err)
    {
        
        log ( 'error encourred while reading the file ');
        return res.status(500).write('SOMETHING WENT WRONG WHILE READING THE DATA');;
    }
    log( students);
}

// init();

let writeFile = ( )=>
{
    fs.writeFileSync(dataFile , JSON.stringify(students,null,2), 'utf-8', (err) =>
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
function addStudent( obj)
{
    students.push( obj );

    writeFile();
}
app.get("/getStudents" , ( req,res)=>
{
    res.status = 200;
    if( students.length == 0 )
    {
        res.send(EMPTY_DATA)
    }
    else    
        res.json( students);
})

app.delete("/deleteById/:id" , ( req,res)=>
{
    let { id } =  req.params ;
    id  = Number( id );
    if( !id )
    {
        return res.status(400).end('INVALID ID CANNOT DELETE RECORD')
    }   

    let idx = students.findIndex((student) =>student.id == id );
    log( idx );
    if ( idx  ==-1 )
    {
        return res.status(400).end('INVALID ID CANNOT DELETE RECORD')
    }
    students.splice( idx , 1 );

    writeFile();

    res.status(200).send('RECORD DELETED SUCCESSFULLY');
})

app.post("/addStudent" , ( req , res ) =>
{
     let { id ,year , name } = req.body;

     id = Number( id );
     year = Number( year);

     if ( !id || !year || name.length ===0)
     {
        return res.status(404).send('INVALID DETAILS');
     }
     addStudent({ id , year, name});
    return res.status( 200 ).send('RECORD INSERTED')
})

app.put("/updateStudent/:oldid" , ( req, res ) =>
{
    let { oldid } = req.params;

    let { name , newid , year } = req.body;

    oldid = Number( oldid );
    year = Number( year);

    if( !oldid )
        return res.status(400).write('INVALID ID CANNOT DELETE RECORD');

    let idx  = students.findIndex( student => student.id == oldid );
    if ( idx != -1 )
    {
        students.splice( idx, 1 );
        writeFile();
        return res.status( 200 ).write('RECORD DELETED');
    }
    else 
        return res.status(400).write('INVALID ID CANNOT DELETE RECORD');

})
