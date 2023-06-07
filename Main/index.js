const inquirer = require('inquirer');
const fs = require('fs');
//Import and require mysql2
const mysql = require('mysql2');
const util = require('util');
const asciiArt = require('asciiart-logo');
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'Toronto80@',
        database: 'employee_db'
    },
    console.log(`Connected to the employee_db database`)
);
db.query = util.promisify(db.query);

const logo = asciiArt({
    name: 'Employee Manager',
    font: 'Doom',
    lineChars: 10,
    padding: 5,
    margin: 3,
    borderColor: 'green',
    logoColor: 'yellow',
    textColor: 'pink'
}).render();
console.log(logo);
const question = [
    {
        type: 'list',
        name: 'option',
        message: 'What would you like to do?',
        choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Role', 'Add Role', 'View All Departments', 'Add Department', 'Quit']
    }];
function menu() {
    inquirer.prompt(question).then(answers => {
        const { option } = answers;
        if (option === 'View All Employees') {
            viewAllEmployees();
        } else if (option === 'Add Employee') {
            addEmployee();
        } else if (option === 'Update Employee Role') {
            updateEmpRole();
        } else if (option === 'View All Role') {
            allRole();
        } else if (option === 'Add Role') {
            addRole();
        } else if (option === 'View All Departments') {
            allDept();
        } else if (option === 'Add Department') {
            addDept();
        } else {
            db.close();
        }
    })
}
menu();
async function viewAllEmployees() {
    try {
        const results = await db.query('SELECT employee.first_name, employee.last_name, employee.id, role.title, department.name,role.salary, concat(manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id');
        console.table(results);
        menu();  
    } catch (error) {
        console.log(error);    }

}
async function addEmployee(){
    const roles = await db.query('SELECT title AS name, id AS value FROM role');
    const employees = await db.query('SELECT id AS value, concat(first_name, " ", last_name) AS name FROM employee');
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'Please enter first name of the employee'
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'Please enter the last name of the employee'
        },
        {
            type: 'list',
            name: 'newRole',
            message: 'Plesae select the specific role',
            choices: roles
        },
        {
            type: 'list',
            name: 'managerList',
            message: 'Please select the manager of the employee',
            choices: employees
        }
    ])
    await db.query('INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES(?, ?, ?, ?)', [answers.firstName, answers.lastName, answers.newRole, answers.managerList]);
    console.log("New employee successfully inserted");
    menu();
};
async function updateEmpRole() {
    const roles = await db.query('SELECT title AS name, id AS value FROM role');
    const employees = await db.query('SELECT id AS value, concat(first_name, " ", last_name) AS name FROM employee');
    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'fullName',
            message: 'Which employees role do you want to update?',
            choices: employees
        },
        {
            type: 'list',
            name: 'role',
            message: 'Which role do you want to assign the selected employee?',
            choices: roles
        },
    ])
    await db.query('UPDATE role SET title = ?', [answers.role]);
    console.log("Updated employee's role");
    menu();
};
async function allRole() {
        try {
            const results = await db.query('SELECT role.id AS role_id, department.name AS department, role.salary, role.title FROM role LEFT JOIN department ON role.department_id = department.id');
            const mappedResults = results.map((row) => {
                return {...row, title: row.title.toString()};
            })
            console.table(mappedResults);
            menu();  
        } catch (error) {
            console.log(error);    }
    
    };

async function addRole() {
    try{
    const dept = await db.query('SELECT id, name FROM department');
    const departmentChoice = dept.map((department) => ({
        name: department.name,
        value: department.id,
    }));
    const answer = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'What is the name of the role?'
        },
        {
            type: 'number',
            name: 'salary',
            message: 'What is the salary of the role?',
        },
        {
            type: 'list',
            name: 'dept1',
            message: 'Please select the department for that role',
            choices: departmentChoice
        },
    ]);
    const {name, salary, dept1} = answer;
    await db.query('INSERT INTO role(title, salary, department_id) VALUES(?, ?, ?)', [name, salary, dept1]);
    console.log(`Added ${name} to the database`);
    menu();
} catch (error){
    console.log(error)
}
};

async function allDept() {
    try{
        const results = await db.query('SELECT * FROM department');
        console.table(results);
        menu();
    } 
    catch(error)
     {
        console.log(error);
    }
};

async function addDept() {
    try{
        const answer = await inquirer.prompt([
            {
                type: 'input',
                name: 'deptName',
                message: 'What is the name of the department?'
            }
        ])
        console.log(`Added ${answer.deptName} to the database`);
        menu();
    }
    catch(error)
    {
        console.log(error);
    }
}