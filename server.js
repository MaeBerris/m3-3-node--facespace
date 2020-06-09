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
  console.log(currentUser)
  res.status(200).render('pages/homepage', {
    users:users,
    currentUser:currentUser,
  });
}

const handleName = (req,res) =>{
  let firstName = req.query.firstName
  
  let user = users.find((item) => {
    return item.name === firstName 
  })

  if(user !== undefined){
    currentUser = user;
    console.log(currentUser)
    let friendsArray = user.friends.map((id) => {
      return  users.find((user) =>{
        return user._id === id
      })
    })
    res.status(200).render(`pages/profile`, {
      user:user,
      friends: friendsArray,
      currentUser: currentUser
    })
  }else{
    res.status(404).redirect('/signin')
  }
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
      currentUser: currentUser
    })
  })

  .get('/signin', (res,req) => {
    if(currentUser.name != undefined){
      req.redirect('/')
    }else{
      req.render('pages/signin',{
      currentUser:currentUser
    })}
  })

  .get('/getname', handleName)

  // a catchall endpoint that will send the 404 message.
  .get('*', handleFourOhFour)

  .listen(8000, () => console.log('Listening on port 8000'));
