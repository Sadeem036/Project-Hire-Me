const pool = require('../../connection/postgresql')
const JWT = require('jsonwebtoken')

const createEmployeeNotification = (req,res)=>{
    const  {emp_id} = req.user
    const { notification_content } = req.body
    pool.query(`INSERT INTO notifications (notification_content,emp_id)
     VALUES ('${notification_content}',${emp_id})`,(error,result)=>{
        if(error){
            throw error
        }
        res.status(200).json("notification added")
    })
}

const getEmployeeNotifications = (req,res)=>{
    const {emp_id} = req.user
    pool.query(`SELECT notification_content FROM notifications WHERE emp_id = ${emp_id}`,(error,result)=>{
        if(error){
            throw error
        }
        res.status(200).json(result.rows)
    })
}

const createComplaint = (req,res)=>{
    const {emp_id} = req.user
    const { complaint_description } = req.body
    pool.query(`INSERT INTO complaint (complaint_description,emp_id) 
    VALUES ('${complaint_description}',${emp_id})`,(error,result)=>{
        if(error){
            throw error
        }
        res.status(200).json("Complaint sent successfully")
    })
}

const getServiceCategory = (req,res)=>{
    pool.query(`SELECT * FROM service_category`,(error,result)=>{
        if(error) throw error
        res.status(200).json(result.rows)
    })
}

const getSubCategory = (req,res)=>{
    const { service_id } = req.params
    pool.query(`SELECT * FROM sub_category WHERE service_category_id = ${service_id}`,(error,result)=>{
        if(error) throw error
        res.status(200).json(result.rows)
    })
}

const addEmpServices = (req,res)=>{
    const {emp_id} = req.user
    const { service_category_id,sub_category_id} = req.body
    pool.query(`INSERT INTO emp_services(emp_id,service_category_id,sub_category_id) VALUES 
    (${emp_id},${service_category_id},${sub_category_id})`,(error,result)=>{
        if(error) throw error
        res.status(200).json("service added")
    })
}

const getEmpServices = (req,res)=>{
    const {emp_id} = req.user
    pool.query(`SELECT service_category_name,sub_category_name FROM emp_services 
    JOIN service_category ON emp_services.service_category_id = service_category.service_category_id
    JOIN sub_category ON emp_services.sub_category_id = sub_category.sub_category_id  
    WHERE emp_services.emp_id = ${emp_id}`,(error,result)=>{
        if(error) throw error
        res.status(200).json(result.rows)
    })
}

const getEmpFeedback = (req,res)=>{
    const {emp_id} = req.user
    pool.query(`SELECT feedback_content,customer_name FROM feedback JOIN customer ON feedback.customer_id = customer.customer_id WHERE emp_id = ${emp_id} `,(error,result)=>{
        if(error) throw error
        res.status(200).json(result.rows)
    })
}

const getEmpSettings = (req,res)=>{
    const {emp_id} = req.user
    pool.query(`SELECT * FROM employee WHERE emp_id = ${emp_id}`,(error,result)=>{
        if(error) throw error
        res.status(200).json(result.rows)
    })
}

const updateEmpSettings = (req,res)=>{
    const { emp_id } = req.user
    const {emp_phone,emp_name,emp_password,emp_language,emp_city} = req.body
    pool.query(`UPDATE employee SET emp_phone = ${emp_phone}, emp_name = '${emp_name}', emp_password = '${emp_password}', emp_language = '${emp_language}', emp_city = '${emp_city}' WHERE emp_id = ${emp_id} `,(error,result)=>{
        if(error) throw error
        res.status(200).json("Updated successfully")
    })
}

const completedServices = (req,res)=>{
    const { emp_id } = req.user
    pool.query(`SELECT emp_name,service_category_name,sub_category_name FROM emp_customer_services JOIN employee ON emp_customer_services.emp_id = employee.emp_id 
    JOIN service_category ON emp_customer_services.service_category_id = service_category.service_category_id
    JOIN sub_category ON emp_customer_services.sub_category_id = sub_category.sub_category_id
    WHERE emp_customer_services.emp_id = ${emp_id}`,(error,result)=>{
        if(error) throw error
        res.status(200).json(result.rows)
    })
}

const empLogin = (req,res)=>{
    const{ emp_phone,emp_password } = req.body
    console.log(emp_phone,emp_password);
    pool.query(`SELECT * FROM employee WHERE emp_phone = ${emp_phone} AND emp_password = '${emp_password}'`,
    (error,result)=>{
        const [ userData ] = result.rows
        console.log(userData);
        if(userData === undefined){
            res.status(400).json("Invalid Phone or password")
        }
        else if(error) throw error
        const jwtToken = JWT.sign(userData,process.env.ACCESS_WEB_TOKEN)
        res.status(200).json(jwtToken)
    })
}

module.exports = { getEmployeeNotifications, createEmployeeNotification, createComplaint, getServiceCategory, getSubCategory, addEmpServices, getEmpServices, getEmpFeedback, getEmpSettings, updateEmpSettings,completedServices, empLogin }