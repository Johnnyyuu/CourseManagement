const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/server', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
});


//mongoose.model(modelName, schema);

// Course Schema
const CourseSchema = new mongoose.Schema({
    name: { type: String },
    fullName: { type: String },
    teacher: { type: String },
    location: { type: String },
    time: { type: Array },
    tech: { type: Boolean },
    emphasis: { type: Array },
})
const Course = mongoose.model('CourseList', CourseSchema);


// User Schema
const UserSchema = new mongoose.Schema({
    username: { type: String },
    password: {
        type: String,
        set(value) {
            return require('bcrypt').hashSync(value, 10);
        }
    },
});
const User = mongoose.model('User', UserSchema);

module.exports = { User, Course };