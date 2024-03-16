const express = require('express')
const Joi = require('joi')

const router = express.Router()

const courses = [
  {
    id: 1,
    title: "Course 1",
  },
  {
    id: 2,
    title: "Course 2",
  },
  {
    id: 3,
    title: "Course 3",
  },
];

router.get("/", (req, res) => {
  res.send(courses);
});

router.get("/:id", (req, res) => {
  let course = courses.find((c) => c.id === parseInt(req.params.id));

  if (!course)
    return res.status(404).send("The course with the given ID was not found!");

  res.send(course);
});

router.post("/", (req, res) => {
  const { error } = validateCourse(req.body);

  if (error) return res.send(error.details[0].message);

  const course = {
    id: courses.length + 1,
    title: req.body.title,
  };

  courses.push(course);
  res.send(course);
});

router.put("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const course = courses.find((c) => c.id === parseInt(id));
  if (!course)
    return res.status(404).send("The course with the given ID was not found!");

  const { error } = validateCourse(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  course.title = req.body.title;
  res.status(200).send(course);
});

router.delete("/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course)
    return res.status(404).send("The course with the given ID was not found!");

  const index = courses.indexOf(course);
  courses.splice(index, 1);

  res.status(200).send(course);
});

function validateCourse(course) {
  const schema = Joi.object({
    title: Joi.string().min(3).required(),
  });

  return schema.validate(course);
}


module.exports = router
