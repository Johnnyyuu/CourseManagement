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
app.get('/api/courseList', async (request, response) => {
    const courseList = await Course.find();
    response.send(courseList);
})

// add a course
app.post('/api/addCourse', async (request, response) => {
    const cur_course = await Course.create(request.body);
    response.send(cur_course);
})

// delete a course
app.delete('/api/course/:name', async (request, response) => {
    await Course.findByIdAndDelete(request.params.id);
    res.send({
        status: true,
    })

})



app.get('/', async (request, response) => {
    response.send('launch successful');
})


app.listen(8000, () => {
    console.log('http://localhost:8000/ launch successful...')
})