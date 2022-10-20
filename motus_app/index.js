const express = require('express')
const path = require('path')
const app = express()
const fs = require('fs')
const os = require('os')
const session = require('express-session')
const port = process.env.PORT || 4000;


const loki_uri = process.env.LOKI || "http://127.0.0.1:3100";
// Logger
const { createLogger, transports } = require("winston");
const LokiTransport = require("winston-loki");
const Option = {
  transports: [
    new LokiTransport({
      host: loki_uri
    })
  ]
};

const logger = createLogger(Option)

logger.info({ message: 'Init' , labels: {'user':'foo' } })
console.log("loki log done")

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
  req.session.level = '0'
  res.send(JSON.stringify(req.session))
})

app.get('/getUsername', (req, res) => {
  res.send(req.session.username)  
})

app.get('/getLevel', (req, res) => {
  res.send(req.session.level)  
})


app.get('/getUpdateLevel', (req, res) => {
  req.session.level = (parseInt(req.session.level) + 1).toString()
  res.send(req.session.level)   
})

app.get('/gameGrid', (req, res) => {
  grid = req.session.grid;
  res.send(grid);
})


app.get('/initializeSessionGrid', (req, res) => {
  wlength = req.query.wlength;
  nlevel = req.query.nlevel;
  req.session.grid = InitializeGrid(wlength, nlevel)
  res.send(req.session.grid);
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


// GRID APPLIANCE
app.get('/registerUserGrid', (req, res) => {
  const username = req.query.username
  res.send(registerUserGrid(username))
});

app.get('/verifyUserGrid', (req, res) => {
  const username = req.session.username
  const word = req.session.word
  res.send(verifyUserGrid(username, word))
});



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
    req.session.word = word;
    res.send(word, word.length, firstHint)

  })
  




function registerUserGrid(username){
  const users_grid_file = path.join(__dirname, 'data/grids.json')
  const users_grid = readJsonSync(users_grid_file)

  // -- Verify Use Cases --
  if (username == null){
      return ('Insert an Authorize Username')
  }

  // -- Append the Identifiers into the Flat File --
  users_grid[username] = {}; // --- Append into the user authentication dictionnary ---
  fs.writeFileSync(users_grid_file, JSON.stringify(users_grid, null, 4));  // --- Overwrite the JSON file ---
  return (`${username} GRID has been Created`)
}


function verifyUserGrid(username, word){
  const users_grid_file = path.join(__dirname, 'data/grids.json')
  const users_grid = readJsonSync(users_grid_file)
  const c_user_grid = users_grid[username]
  

}


function InitializeGrid(ncharacters, nlevel=6){
  const grid = {}

  for (let i = 0; i < nlevel; i++){
    grid[`LEVEL_${i}`] = {}
    for (let j = 0; j < ncharacters; j++){
      grid[`LEVEL_${i}`][`CHARACTER_${j}`] = {'LETTER': '', 'BACKGROUND-COLOR': ''}
    }
  }
  return grid
}

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


// Read JSON Users File
function readJsonSync(filename_json){
  return JSON.parse(fs.readFileSync(filename_json))
}