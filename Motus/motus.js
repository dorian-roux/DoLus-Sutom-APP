const express = require('express')
const os = require('os');
const fs = require('fs')
const app = express()
var path = require('path');
const port = process.env.PORT || 3001



// Word List
// const resultArray = fs.readFileSync('./data/liste_francais_utf8.txt', {encoding:'utf8', flag:'r'}).split("\n")

// Back-END Functions
function ReadFileWords(filename_words){
  return fs.readFileSync(filename_words, {encoding:'utf8', flag:'r'}).split('\n');
}

function GetTimeinDays(){
  const oneDayInMs = 1000 * 60 * 60 * 24;
  const currentTimeInMs = new Date().getTime();  // UTC time
  const timeInDays = Math.floor(currentTimeInMs / oneDayInMs);
  return timeInDays;
}


function GetWord(){
  const array_words = ReadFileWords('data/liste_francais_utf8.txt');
  const timeInDays = GetTimeinDays();
  const seed = 390  // Set a seed (for 390 words)
  const word = array_words[(parseInt(array_words.length/390) * timeInDays) % array_words.length]; 
  return word;
}


// APP



app.use(express.static(path.join(__dirname, 'static/default'), { index: ['default.html', 'default.htm'] }))


app.get('/health', (req, res) => {
  res.send('ok')
})


app.get('/login', (req, res) => {
  res.sendFile( __dirname + "/static/login/" + "login.html" );
})


app.get('/seed', (req, res) => {
  let seed = 10
  res.send(seed.toString());
})



app.get('/score', (req, res) => {
  res.sendFile( __dirname + "/static/score/" + "score.html" );
})


app.get('/word', (req, res) => {
  const word = GetWord();
  const firstHint = word[0];
  res.send(word)

})


app.get('/port', (req, res) => {
  res.send("MOTUS APP working on " + os.hostname() + " port " + port)
})


app.listen(port, () => {
  console.log("MOTUS APP working on " + os.hostname() + " port " + port)
})
