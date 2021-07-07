const express = require('express');
const { User, Course } = require('./models');


const app = express();
const secretkey = "a6s8d1a3sd854a3";
const jwt = require('jsonwebtoken');

//cross domain
app.use(require('cors')());
app.use(express.json());


//////////////////////////////////////////////////////////
// Course List Management
//test
app.get('/api/test', async (request, response) => {
    let a = 'ECE1762';
    const result = await Course.find({ 'name': a });
    if (result.length === 0) {
        response.send(result);
    } else {
        response.send("Error: Course existed");
    }


})
// get course list
app.get('/api/courseList', async (request, response) => {
    const courseList = await Course.find();
    response.send(courseList);
})

// add a course
app.post('/api/addCourse', async (request, response) => {
    let cur_name = request.body.name;
    const cur_list = await Course.find({ 'name': cur_name });
    if (cur_list.length === 0) {
        await Course.create(request.body).then(() => {
            response.send({
                status: 200,
                message: "Add successful",
            });
        }
        );

    } else {
        response.send({
            status: 400,
            message: "Error: Course existed",
        });
    }
})

// edit course info
app.post('/api/editCourse/:id', async (request, response) => {
    await Course.findByIdAndUpdate(request.params.id, request.body);
    response.send({
        status: 200,
        message: "Updated successful",
    })
})

// delete a course
app.delete('/api/deleteCourse/:id', async (request, response) => {
    await Course.findByIdAndDelete(request.params.id);
    response.send({
        status: 200,
        message: "Deleted successful",
    })

})

////////////////////////////////////////////////////////////////
// User register
app.post('/api/user/register', async (request, response) => {
    let cur_username = request.body.username;
    let cur_list = await User.find({ 'username': cur_username });
    if (cur_list.length === 0) {
        await User.create({
            username: request.body.username,
            password: request.body.password,
        })
        response.send({
            status: 200,
            message: "registerd successful",
        });

    } else {
        response.send({
            status: 400,
            message: "user already existed",
        });
    }

})

// Search User
app.get('/api/user/list', async (request, response) => {
    const user = await User.find();
    response.send(user);
})

// Login
app.post('/api/user/login', async (request, response) => {
    const user = await User.find({
        username: request.body.username,
    })
    if (user.length === 0) {
        return response.status(422).send({
            message: `invalid username`,
        })
    }
    const passwordValid = require('bcrypt').compareSync(
        request.body.password,
        user[0].password
    )
    if (!passwordValid) {
        return response.status(422).send({
            message: 'invalid password'
        })

    }

    // generate token and send response
    const token = jwt.sign({
        id: String(user[0]._id),
    }, secretkey);
    response.send({
        user,
        token: token,
    })

})

// middleware
const auth = async (req, res, next) => {
    const raw = String(req.headers.authorization).split(' ').pop();
    const { id } = jwt.verify(raw, secretkey);
    req.user = await User.findById(id);
    next();
}

// personal info
app.get('/api/user/profile', auth, async (request, response) => {
    response.send(request.user);
})























app.get('/', async (request, response) => {
    response.send('launch successful');
})


app.listen(8000, () => {
    console.log('http://localhost:8000/ launch successful...')
})