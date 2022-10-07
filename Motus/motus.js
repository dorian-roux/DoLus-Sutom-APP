const express = require('express')
const os = require('os');
const fs = require('fs')
const app = express()
const session = require('express-session')
const cookieParser = require('cookie-parser')
var path = require('path');
const port = process.env.PORT || 3000



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
  const word = array_words[(parseInt(array_words.length/seed) * timeInDays) % array_words.length]; 
  return word.trim();
}


// APP



// Session 
const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
  secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
  saveUninitialized:true,
  cookie: { maxAge: oneDay },
  resave: false 
}));


app.use(express.static(path.join(__dirname, 'static/authentificator'), { index: ['default.html', 'default.htm'] }))

// parsing the incoming data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.use(cookieParser());


//username and password
const myusername = 'user1'
const mypassword = 'mypassword'

// a variable to save a session
var session_temp;

app.post('/user',(req,res) => {
  if(req.body.username == myusername && req.body.password == mypassword){
    session_temp=req.session;
    session_temp.userid=req.body.username;
    res.redirect('/')
  }
  else{
      res.send('Invalid username or password');
  }
})



app.use((req,res,next)=>{
  if(req.session.userid){
    next()
  }else{
    res.redirect("/login.html")
  }
})


app.use(express.static(path.join(__dirname, 'static/default'), { index: ['default.html', 'default.htm'] }))

app.get('/session', (req, res) => { // Display the content of the session at thes API /session
  res.send(JSON.stringify(req.session))
})




app.get('/logout',(req,res) => {
  req.session.destroy();
  res.redirect('/');
});






app.get('/health', (req, res) => {
  res.send('Good!')
})



app.get('/seed', (req, res) => {
  let seed = 10
  res.send(seed.toString());
})



//  SCORE 
function readJsonSync(filename_json){
  return JSON.parse(fs.readFileSync(filename_json))
}

function checkUserScoreExists(user){
  const filename_json = 'data/score.json'
  const score_users = readJsonSync(filename_json)
  if (!(Object.keys(score_users).includes(user))){
    score_users[user] = {};
    fs.writeFileSync(filename_json, JSON.stringify(score_users, null, 4));
    return ('User ' + user + ' Created')
  }
  return ('User ' + user + ' Already Exists')
}


// app.get('/score_user_exists', (req, res) => {
//   res.send(checkUserScoreExists('Loïc'))
// })


app.get('/score_history', (req, res) => {
  res.send(readJsonSync("data/score.json"))
})

app.get('/score', (req, res) => {
  res.sendFile( __dirname + "/static/score/" + "score.html" );
})


app.get('/word', (req, res) => {
  const word = GetWord();
  const firstHint = word[0];
  res.send(word, word.length, firstHint)

})


app.get('/port', (req, res) => {
  res.send("MOTUS APP working on " + os.hostname() + " port " + port)
})


app.listen(port, () => {
  console.log("MOTUS APP working on " + os.hostname() + " port " + port)
})
