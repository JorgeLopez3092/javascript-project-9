'use strict'

const express = require('express');
const router = express.Router();
const User = require('../models').User;
const Course = require('../models').Course;
const { check, validationResult } = require('express-validator');
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');

/* Handler function to wrap each route. */
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next)
    } catch (error) {
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        const errors = error.errors.map(err => err.message);
        console.error('Validation errors: ', errors);
        res.status(400).send(error);
      } else {
        res.status(500).send(error);
      }
    }
  }
}


const authenticateUser = asyncHandler(async (req, res, next) => {
  let message = null;

  // Parse the user's credentials from the Authorization header.
  const credentials = auth(req);
  // If the user's credentials are available...
  if (credentials) {
    // Attempt to retrieve the user from the data store
    // by their username (i.e. the user's "key")
    // from the Authorization header).
    const user = await User.findOne({
      where: {
        emailAddress: credentials.name,
      }
    });

    // If a user was successfully retrieved from the data store...
    if (user) {
      // Use the bcryptjs npm package to compare the user's password
      // (from the Authorization header) to the user's password
      // that was retrieved from the data store.
      const authenticated = bcryptjs
        .compareSync(credentials.pass, user.password);

      // If the passwords match...
      if (authenticated) {
        console.log(`Authentication successful for username: ${user.emailAddress}`);
        // Then store the retrieved user object on the request object
        // so any middleware functions that follow this middleware function
        // will have access to the user's information.
        req.currentUser = user;
      } else {
        message = `Authentication failure for username: ${user.emailAddress}`
      }
    } else {
      message = `User not found for username: ${credentials.name}`
    }
  } else {
    message = 'Auth header not found';
  }
  // If user authentication failed...
  if (message) {
    console.warn(message);

    // Return a response with a 401 Unauthorized HTTP status code.
    res.status(401).json({ message: 'Access Denied' });
  } else {
    // Or if user authentication succeeded...
    // Call the next() method.
    next();
  }
});


// GET users listing. 
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
  const user = req.currentUser;

  res.json({
    name: `${user.firstName} ${user.lastName}`,
    username: user.emailAddress
  });
}));

// Post new users
router.post('/users', [
  check('firstName')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a first name.'),
  check('lastName')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a last name.'),
  check('emailAddress')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide an email address'),
  check('password')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please set a password.')
], asyncHandler(async (req, res) => {
  // Attempt to get the validation result from the Request object.
  const errors = validationResult(req);

  // If there are validation errors...
  if (!errors.isEmpty()) {
    // Use the Array 'map()' method to get a list of error messages.
    const errorMessages = errors.array().map(error => error.msg);

    // Return the validation errors to the client.
    return res.status(400).json({ errors: errorMessages });
  }

  // Get the user from the request body.
  const user = req.body;

  // Hash the new user's password.
  user.password = bcryptjs.hashSync(user.password);

  // Add the user to the 'Users' table.
  await User.create(user);

  // Set status to 201 user created!
  res.location('/');
  res.status(201).end();
}));

// Get list of all courses
router.get('/courses', asyncHandler(async (req, res) => {
  try {
    const courses = await Course.findAll({
      include: [
        {
          model: User,
          as: 'teacher',
        }
      ]
    });
    res.json(courses.map(course => {
      const container = {};
      const teacherContainer = {};
      teacherContainer.id = course.teacher.id;
      teacherContainer.firstName = course.teacher.firstName;
      teacherContainer.lastName = course.teacher.lastName;
      teacherContainer.emailAddress = course.teacher.emailAddress;

      container.title = course.id;
      container.description = course.description;
      container.estimatedTime = course.estimatedTime;
      container.materialsNeeded = course.materialsNeeded;
      container.userId = course.userId;
      container.teacher = teacherContainer;

      return container
    }))

  } catch (err) {
    console.log(err);
    res.json(err);
  }
}));

// Get list of individual coursee
router.get('/courses/:id', asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id, {
    include: {
      model: User,
      as: 'teacher'
    }
  });
  const container = {};
  const teacherContainer = {};
  teacherContainer.id = course.teacher.id;
  teacherContainer.firstName = course.teacher.firstName;
  teacherContainer.lastName = course.teacher.lastName;
  teacherContainer.emailAddress = course.teacher.emailAddress;

  container.title = course.id;
  container.description = course.description;
  container.estimatedTime = course.estimatedTime;
  container.materialsNeeded = course.materialsNeeded;
  container.userId = course.userId;
  container.teacher = teacherContainer;
  res.json(container);
}));

// Create a new course
router.post('/courses', [
  check('title')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a title.'),
  check('description')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a descriptiondes.'),
  check('userId')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a userId'),
], authenticateUser, asyncHandler(async (req, res) => {
  // Attempt to get the validation result from the Request object.
  const errors = validationResult(req);

  // If there are validation errors...
  if (!errors.isEmpty()) {
    // Use the Array 'map()' method to get a list of error messages.
    const errorMessages = errors.array().map(error => error.msg);

    // Return the validation errors to the client.
    return res.status(400).json({ errors: errorMessages });
  }

  // Get the user from the request body.
  const course = req.body;

  // Add the user to the 'Users' table.
  console.log(course);
  await Course.create(course);

  // Grab id of newly created course
  const newCourse = await Course.findOne({
    where: {
      title: req.body.title,
      description: req.body.description,
      userId: req.body.userId
    }
  });
  console.log(newCourse)
  // Set status to 201 user created!
  res.location(`/courses/${newCourse.id}`)
  res.status(201).end();
}));

// Update a course
router.put('/courses/:id', [
  check('title')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a title.'),
  check('description')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a descriptiondes.'),
  check('userId')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please provide a userId'),
], authenticateUser, asyncHandler(async (req, res) => {
  // Attempt to get the validation result from the Request object.
  const errors = validationResult(req);

  // If there are validation errors...
  if (!errors.isEmpty()) {
    // Use the Array 'map()' method to get a list of error messages.
    const errorMessages = errors.array().map(error => error.msg);

    // Return the validation errors to the client.
    return res.status(400).json({ errors: errorMessages });
  }
  const user = req.currentUser;
  const course = await Course.findByPk(req.params.id);
  if (course) {
    // Checks that the authenticated user is the owner of the course being edited
    if (user.id === course.userId) {
      await course.update(req.body);
      res.status(204).end();
    } else {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(404);
  }
}));

// Delete a course
router.delete('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
  const user = req.currentUser;
  const course = await Course.findByPk(req.params.id);
  console.log(user.id, course.userId);
  if (course) {
    // Checks that the authenticated user is the owner of the course being edited
    if (user.id === course.userId) {
      await course.destroy();
      res.status(204).end();
    } else {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(404);
  }
}))
module.exports = router;
