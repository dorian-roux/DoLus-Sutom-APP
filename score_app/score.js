const express = require('express')
const path = require('path')
const app = express()
const fs = require('fs')
const os = require('os')

const port = process.env.PORT || 4100

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

app.get('/', (req, res) => {
    res.send('Welcome in your SCORE')
});




// HEATHLCHECK
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


// PORT
app.get('/port', (req, res) => {
    res.send(`MOTUS APP working on ${os.hostname()} port ${port}`)
});

app.listen(port, () => {
  console.log(`MOTUS APP working on ${os.hostname()} port ${port}`)
});



app.get('/registerUserScore', (req, res) => {
    const username = req.query.username
    res.send(registerUserScore(username))
});




app.get('/get_user_information', (req, res) => {
    const username = req.query.username
    res.send(getUserInformation(username))
});


app.get('/incrementUserScore', (req, res) => {
    const username = req.query.username
    const word_to_guess = req.query.wtg
    const word_guessed = req.query.wg
    res.send(incrementUserScore(username, word_to_guess, word_guessed))
})


function incrementUserScore(username, word_to_guess, word_guessed){
    const users_score_file = path.join(__dirname, 'data/users.json')
    const users_score = readJsonSync(users_score_file)
    const user_dict = users_score[username]  // Get dict associated to the current USER

    // Check whenever the word exist within the USER Score
    if (!(Object.keys(user_dict).includes(word_to_guess))){
        user_dict[word_to_guess] = {score: 0, total_attempts: 0}
    }

    let word_dict = user_dict[word_to_guess];
    if (word_guessed == "true"){
        word_dict.score += 1 
    }

    word_dict.total_attempts += 1
    user_dict[word_to_guess] = word_dict
    users_score[username] = user_dict

    // -- Append the Identifiers into the Flat File --
    fs.writeFileSync(users_score_file, JSON.stringify(users_score, null, 4));  // --- Overwrite the JSON file ---
    return (`${username} Score has been UPDATED`)
}



function registerUserScore(username){
    const users_score_file = path.join(__dirname, 'data/users.json')
    const users_score = readJsonSync(users_score_file)

    // -- Verify Use Cases --
    if (username == null){
        return ('Insert an Authorize Username')
    }

    // -- Append the Identifiers into the Flat File --
    users_score[username] = {}; // --- Append into the user authentication dictionnary ---
    fs.writeFileSync(users_score_file, JSON.stringify(users_score, null, 4));  // --- Overwrite the JSON file ---
    return (`${username} SCORE has been Created`)
    
}


  



// Get the USER information
function getUserInformation(username){
    const users_score_file = path.join(__dirname, 'data/users.json')
    const users_score = readJsonSync(users_score_file)
    return users_score[username]
}



// Read JSON Users File
function readJsonSync(filename_json){
    return JSON.parse(fs.readFileSync(filename_json))
}