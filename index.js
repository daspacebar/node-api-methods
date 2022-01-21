const Joi = require('joi');
const express = require('express');
const { rmSync } = require('fs');
const app = express();
app.use(express.json());

const courses = [
    {id: 1, name: 'course1'},
    {id: 2, name: 'course2'},
    {id: 3, name: 'course3'},
]


//get request to get all courses/specific course
app.get('/', (req, res) => {
    res.send("Hello World!!");
})

app.get('/api/courses', (req, res) => {
    res.send(courses);
})

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if(!course){
        return res.status(404).send("The course with the given ID is not found")
    }
    res.send(course);
})


//POST request to create a new course
app.post('/api/courses', (req, res) => {
    const { error } = validateCourse(req.body); //result.error
    if(error){
        return res.status(400).send(result.error.details[0].message);
    }
    const course = {
        id: courses.length + 1,
        name: req.body.name,
    }
    courses.push(course);
    res.send(course);
})

//PUT request to update a course
app.put('/api/courses/:id', (req, res) => {
    //Look up the course
    //if not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course){
        return res.status(404).send("The course with the given ID is not found");
    }

    //Validate
    //if invalid, return 400 - bad request
    const { error } = validateCourse(req.body); //result.error
    if(error){
        return res.status(400).send(result.error.details[0].message);
    }

    //Update course
    course.name = req.body.name;
    res.send(course);
    //return the updated course
})


//delete request to delete a course

app.delete('/api/courses/:id', (req, res) => {
    //look up the course
    //not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) {
        res.status(404).send("The course with the given ID is not found");
        return;
    }

    //delete
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    //return the same course
    res.send(courses);
})



//port 
const port = process.env.PORT || 3000;

app.listen(3000, () => console.log(`Listening on port ${port}`));



function validateCourse(course){
    const schema = {
        name: Joi.string().min(3).required()
    }
    return Joi.validate(course, schema);
}