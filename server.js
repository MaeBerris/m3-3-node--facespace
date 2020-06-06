'use strict';

const express = require('express');
const morgan = require('morgan');

const { users } = require('./data/users');

let currentUser = {};

// declare the 404 function
const handleFourOhFour = (req, res) => {
  res.status(404).send("I couldn't find what you're looking for.");
};

const handleHomepage = (req,res) => {
  res.status(200).render('pages/homepage', {
    users:users,
  });
}
// -----------------------------------------------------
// server endpoints
express()
  .use(morgan('dev'))
  .use(express.static('public'))
  .use(express.urlencoded({ extended: false }))
  .set('view engine', 'ejs')

  // endpoints
  .get('/', handleHomepage)
  .get('/users/:id', (req,res) =>{
    let id = req.params.id
    let user = users.find((user) =>{
      return user._id === id
    })
    let friendsArray = user.friends.map((id) => {
      return  users.find((user) =>{
        return user._id === id
      })
    })
    console.log(friendsArray)
    res.render('pages/profile',{
      user:user,
      friends: friendsArray,
    })
  })

  // a catchall endpoint that will send the 404 message.
  .get('*', handleFourOhFour)

  .listen(8000, () => console.log('Listening on port 8000'));
