const express = require('express')
const path = require('path')
const app = express()
const fs = require('fs')
const os = require('os')
const session = require('express-session')

const port = process.env.PORT || 4000;


app.use('/static', express.static('public'))

app.use(session({
  secret: "secretkey17849572",  //change key?
  saveUninitialized:true,
  name: "stickiness",
  resave: true 
}));

app.get('/session', (req, res) => { // Display the content of the session at thes API /session
  res.send(JSON.stringify(req.session))
})


app.get('/updateUserSession', (req, res) => {
  username = req.query.username
  req.session.username = username
  res.send(JSON.stringify(req.session))
})

app.get('/getUsername', (req, res) => {
  res.send(req.session.username)  
})


// var session_temp;
app.get('/', (req, res) => {
  if (req.session.username){
    res.sendFile(path.join(__dirname, 'public/templates/main.html'))
  }else{
    res.redirect('/login')
  }
})


app.get('/login', (req, res) => {
  if (req.session.username){
    res.redirect('/')
  }else{
    res.sendFile(__dirname + '/public/templates/login.html')
  }
})

app.get('/register', (req, res) => {
  if (req.session.username){
    res.redirect('/login')
  }else{
    res.sendFile(__dirname + '/public/templates/register.html')
  }
})

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
})



// HEALTHCHECK
app.get('/healthcheck', (req, res) => {
    const healthcheck = {
        uptime: process.uptime(),
        message: 'OK',
        timestamp: Date.now()
    };
    try {
        res.send(healthcheck);
    } catch (error) {
        healthcheck.message = error;
        res.status(503).send();
    }
});


app.get('/', (req, res) => {
    main_path = path.join(__dirname, 'public/templates/main.html')
    res.sendFile(main_path)
});

app.get('/scoreboard', (req, res) => {
  main_path = path.join(__dirname, 'public/templates/scoreboard.html')
  res.sendFile(main_path)
});


// PORT

app.get('/port', (req, res) => {
    res.send(`MOTUS APP working on ${os.hostname()} port ${port}`)
});

app.listen(port, () => {
  console.log(`MOTUS APP working on ${os.hostname()} port ${port}`)
});



/// API /array_size
app.get('/motus/array_size', (req, res) => {
    var array_words = ReadFileWords('data/liste_francais_utf8.txt');
    res.send(array_words)
  })
  

/// API /seed 
let parametrize_seed = {}
app.get('/motus/seed=:value', (req, res) => {
  parametrize_seed.value = req.params.value
  res.redirect('/');
})

///  API /word
app.get('/word', (req, res) => {
    if (parametrize_seed.value == null){
      parametrize_seed.value = 390   
    }
    const word = GetWord(parseInt(parametrize_seed.value));
    const firstHint = word[0];
    res.send(word, word.length, firstHint)
  })
  



// Read and Get Daily WORD
/// Functions
function ReadFileWords(filename_words){
  const file_content = fs.readFileSync(filename_words, {encoding:'utf8'})
  const array_words = file_content
  .toUpperCase()    
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .split(/\r?\n/);
  return array_words
}


function GetTimeinDays(){
  const oneDayInMs = 1000 * 60 * 60 * 24;
  const currentTimeInMs = new Date().getTime();  // UTC time
  const timeInDays = Math.floor(currentTimeInMs / oneDayInMs);
  return timeInDays;
}


function GetWord(seed=390){
  const array_words = ReadFileWords(path.join(__dirname, 'data/liste_francais_utf8.txt'));
  const timeInDays = GetTimeinDays();
  const word = array_words[(parseInt(array_words.length/seed) * timeInDays) % array_words.length]; 
  return word.trim();
}