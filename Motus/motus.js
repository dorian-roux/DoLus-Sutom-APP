const express = require('express')
const os = require('os');
const serveStatic = require('serve-static')
const fs = require('fs')
const app = express()

const port = process.env.PORT || 4000 



// Word List
const resultArray = fs.readFileSync('./data/liste_francais_utf8.txt', {encoding:'utf8', flag:'r'}).split("\n")



// Find the INDEX
var seed = parseInt(resultArray.length/390) // Set a seed (for 390 words)
var oneDayInMs = 1000 * 60 * 60 * 24;
var currentTimeInMs = new Date().getTime();  // UTC time
var timeInDays = Math.floor(currentTimeInMs / oneDayInMs);
var numberForToday = seed * timeInDays % resultArray.length;



// APP
app.use(serveStatic('static', { index: ['default.html', 'default.htm'] }))



app.get('/word', (req, res) => {
  res.send(resultArray[numberForToday]);
})


app.get('/port', (req, res) => {
  res.send("MOTUS APP working on " + os.hostname() + " port " + port)
})


app.listen(port, () => {
  console.log("MOTUS APP working on " + os.hostname() + " port " + port)
})
