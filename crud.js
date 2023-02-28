const express = require('express');
const bodyparser = require('body-parser');
const mysql = require('mysql');
let app = express();

app.use(bodyparser.json());

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'employee'
});

conn.connect((err) => {
    if (err) throw err;
    console.log("Mysql connection is established");
});

app.get('/', (req, res) => {
    conn.query("select user.id, user.name, user_details.address from user left join user_details on user.id=user_details.user_id", (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send(result);

    })
})

app.get('/:id', (req, res) => {

    conn.query("select * from user where id=?", req.params.id, (err, result) => {
        if (err) throw err;
        res.send(result);
    })
})

app.post('/', (req, res) => {

    let userData = "INSERT INTO `user` (`name`, `email`, `number`, `status`, `password`) VALUES ('" + req.body.name + "','" + req.body.email + "','" + req.body.number + "','" + req.body.status + "','" + req.body.password + "')";
    console.log(userData);

    conn.query(userData, (err, result) => {
        if (err) throw err;
        console.log(result.insertId);

        let data2 = "insert into `user_details` (`user_id`,`address`,`state`,`town`,`pincode`) values ('" + result.insertId + "','" + req.body.address + "','" + req.body.state + "','" + req.body.town + "','" + req.body.pincode + "')";
        console.log(data2);
        conn.query(data2, (error, results) => {
            if (error) throw error;
            console.log(results);
            res.json(results);
        })
    })
})


app.put('/:id', (req, res) => {

    let data = "update user set name = '" + req.body.name + "', email = '" + req.body.email + "', number = '" + req.body.number + "', status = '" + req.body.status + "', password = '" + req.body.password + "' where id = '" + req.params.id + "'";
    console.log(data);
    conn.query(data, (err, result) => {
        if (err) throw err;
        console.log(result);

    let data2 = "update user_details  set address = '" + req.body.address + "', state = '" + req.body.state + "', town = '" + req.body.town + "', pincode = '" + req.body.pincode + "'where user_id = '" + req.params.id + "'";
    console.log(data2);
    conn.query(data2, (error, results) => {
        if (error) throw error;
        console.log(results);
        res.json(results);
        })
    })
})


app.delete("/:id", (req, res) => {

    let data = "delete from user_details where user_id = '" + req.params.id + "'";
    conn.query(data, (err, result) => {
        if (err) throw err;

        let userData = "delete from user where id ='" + req.params.id + "'";

        conn.query(userData, (err, result) => {
            if (err) throw err;
            res.send(result);
        })
    })

})


app.listen(3000, () => {
    console.log("Server started on 3000 port");
});