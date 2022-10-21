//////////////////////
// AUTHENTIFICATION //
//////////////////////


// -- Set Requirements and COnstants -- //
const express = require('express')
const path = require('path')
const app = express()
const fs = require('fs')
const os = require('os')
const { createHash } = require('crypto')
const port = process.env.PORT || 4200



// - APIs - //

// -- Send a BASIC string at the Authentication HOST -- //
app.get('/', (_, res) => {
    res.send('Welcome in your AUTHENTICATION')
});


// -- Set the "Acces-Control" to allow the usage of "FETCH" within the Static Files -- //
app.use((_, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})


// -- Verify the correspoding USERNAME & PASSWORD queried from the URL (for the LOGIN) -- //
app.get('/loginUserAccount', (req, res) => {
    var username = req.query.username;
    var password = req.query.password;
    res.send(loginUserAccount(username, password))
})


// -- Verify the corresponding USERNAME & PASSWORD queried from the URL (for the REGISTER) -- //
app.get('/registerUserAccount', (req, res) =>{
    var username = req.query.username;
    var password = req.query.password;
    res.send(registerUserAccount(username, password))
})


// -- Perform an HEALTH_CHECK of the SERVICE -- //
app.get('/healthcheck', (_, res) => {
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


// -- Get the Information related to the HOST and PORT -- //
app.get('/port', (_, res) => {
    res.send(`MOTUS APP working on ${os.hostname()} port ${port}`)
});

app.listen(port, () => {
  console.log(`MOTUS APP working on ${os.hostname()} port ${port}`)
});


// - FUNCTIONS - //

// // -- Perform a LOGIN Verification on the Authentication Flat File -- // 
function loginUserAccount(username, password){
    const users_authentication_file = path.join(__dirname, 'data/users_authentication.json')
    const users_authentication = readJsonSync(users_authentication_file)

    if (!(Object.keys(users_authentication).includes(username))){  // Check whenever the inputed user does not exist
        return 'Wrong USERNAME / USERNAME not REGISTERED'
    }else{
        if (hashPassword(password) == users_authentication[username]){
            return true
        }else{
            return 'Wrong PASSWORD / PASSWORD not REGISTERED'
        }
    }
}


// // -- Perform a "deeper" REGISTER Verification and Saving on the Authentication Flat File -- // 
function registerUserAccount(username, password){
    const users_authentication_file = path.join(__dirname, 'data/users_authentication.json')
    const users_authentication = readJsonSync(users_authentication_file)

    // -- Verify the Use Cases --
    if (!(username != null && password != null)){  // --- INPUTS Non-Existing ---
        return 'No AUTHENTICATION Inputs'
    }else if (Object.keys(users_authentication).includes(username)){  // --- Username Exists ---
        return 'USERNAME already exists / LogIn or Register using another USERNAME'
    }else{
        // -- Append the Identifiers into the Flat File --
        var hpassword = hashPassword(password)  // --- Hash the Password ---
        users_authentication[username] = hpassword;  // --- Append into the user authentication dictionnary ---
        fs.writeFileSync(users_authentication_file, JSON.stringify(users_authentication, null, 4));  // --- Overwrite the JSON file ---
        // return (`${username} has been Created`)
        return true
    }

}


// Read JSON Users File //
function readJsonSync(filename_json){
    return JSON.parse(fs.readFileSync(filename_json))
}


// Hash the user PASSWORD //
function hashPassword(password){
    return createHash('sha256').update(password).digest('hex');
}