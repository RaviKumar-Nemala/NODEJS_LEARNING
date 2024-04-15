let { EntitySchema } = require("typeorm")

let User = new EntitySchema( {
    name : "user",
    tableName:"users",
    columns: {
        id : {
            type : "int",
            primary : true,
            generated : "increment",
        },
        username : {
            type : "varchar",
            length :255 ,
            unique: true,
        },
        salary : {
            type : "decimal",
            scale : 4,
        }
    }
})

module.exports = {User} ;