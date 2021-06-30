const { response } = require('express');
const express = require('express');
const app = express();

//cross domain
app.use(require('cors')());
app.use(express.json());

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/server', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
});

// Course List Management
//mongoose.model(modelName, schema);
const Course = mongoose.model('CourseList', new mongoose.Schema({
    name: { type: String },
    fullName: { type: String },
    teacher: { type: String },
    location: { type: String },
    time: { type: Array },
    tech: { type: Boolean },
    emphasis: { type: Array },
}))

// courseList
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
        const cur_course = await Course.create(request.body);
        response.send(cur_course);
    } else {
        response.send("Error: Course existed");
    }
})

// edit course info
app.post('/api/editCourse/:id', async (request, response) => {
    await Course.findByIdAndUpdate(request.params.id, request.body);
    response.send({
        status: true,
        message: "Updated successful",
    })
})

// delete a course
app.delete('/api/deleteCourse/:id', async (request, response) => {
    await Course.findByIdAndDelete(request.params.id);
    response.send({
        status: true,
        message: "Deleted successful",
    })

})

app.get('/', async (request, response) => {
    response.send('launch successful');
})


app.listen(8000, () => {
    console.log('http://localhost:8000/ launch successful...')
})