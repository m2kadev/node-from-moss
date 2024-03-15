const config = require('config')
const helmet = require('helmet')
const morgan = require('morgan')
const express = require('express')
const bodyParser = require('body-parser')
const Joi = require('joi')
const logger = require('./logger')

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(helmet())

console.log(app.get('env'))
console.log("Application name: " + config.get('name'))
console.log("Mail server: " + config.get('mail.host'))
console.log("Mail password: " + config.get('mail.password'))

if (app.get('env') === "development") {
    app.use(morgan('tiny'))
    console.log("Morgan enabled...")
}

app.use(logger)

const courses = [
    {
        id: 1,
        title: "Course 1"
    },
    {
        id: 2,
        title: "Course 2"
    },
    {
        id: 3,
        title: "Course 3"
    }
]

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send("HELLO WORLD!")
})

app.get('/api/courses', (req, res) => {
    res.send(courses)
})

app.get('/api/courses/:id', (req, res) => {
    let course = courses.find((c) => c.id === parseInt(req.params.id));

    if (!course) return res.status(404).send("The course with the given ID was not found!")

    res.send(course)
})

app.post('/api/courses', (req, res) => {

    const {error} = validateCourse(req.body)

    if (error) return res.send(error.details[0].message)

    const course = {
        id: courses.length + 1,
        title: req.body.title
    }

    courses.push(course)
    res.send(course)
})

app.put('/api/courses/:id', (req, res) => {

    const id = parseInt(req.params.id)
    const course = courses.find(c => c.id === parseInt(id))
    if (!course) return res.status(404).send("The course with the given ID was not found!")

    const {error} = validateCourse(req.body)

    if (error) return res.status(400).send(error.details[0].message)

    course.title = req.body.title
    res.status(200).send(course)
})

app.delete('/api/courses/:id', (req, res) => {

    const course = courses.find(c => c.id === parseInt(req.params.id))
    if (!course) return res.status(404).send("The course with the given ID was not found!")


    const index = courses.indexOf(course)
    courses.splice(index, 1)

    res.status(200).send(course)

})

function validateCourse (course) {
    const schema = Joi.object({
      title: Joi.string().min(3).required(),
    });

    return schema.validate(course);
}

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
})