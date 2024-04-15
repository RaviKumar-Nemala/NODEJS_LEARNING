let EmployeeRepo = require('./employeedb');
let asyncHandler = require('../UTILS/asyncHandler');
let employee_repo = new EmployeeRepo();

const add_employee = asyncHandler(async (req, res, next) => {
    let { name, salary } = req.body;
    // console.log( name, salary );
    console.log(name, salary);
    if (!name || !salary)
        return res.status(400).send({ type: 'fail', message: 'INVALID NAME OR SALARY' });

    let temp = await employee_repo.add({ name: name, salary: salary });

    return res.status(200).send('RECORD INSERTED');
}
);


const get_employee = asyncHandler(async (req, res, next) => {
    console.log('get Employee called');

    let data = await employee_repo.get();
    console.log(data);
    return res.status(200).send(data);
}
)

const delete_by_id = asyncHandler(async (req, res, next) => {
    console.log('delete by id called');
    let { id } = req.params;
    id = Number(id);
    if (!id || id < 0) {
        return res.status(400).json({ message: 'INVALID ID NUMBER' })
    }

    await employee_repo.delete_by_id(id);

    return res.status(200).send( { message : `RECORD DELETED with id ${id}` });

})


const get_employee_by_id = asyncHandler(async (req, res, next) => {
    console.log('get employee by id called');
    let { id } = req.params;
    console.log(id);
    id = Number(id);

    if (!id) {
        return res.status(400).end('INVALID ID NUMBER')
    }

    let data = await employee_repo.get_by_id(id);
    return res.status(200).json(data);
})

module.exports = { add_employee,  get_employee, get_employee_by_id, delete_by_id };