// BUTTONS
var btn = document.getElementById('submit_guess');
btn.addEventListener('click', func);

var btn_new_word = document.getElementById('get_new_word');
btn_new_word.addEventListener('click', get_new_word);

var btn_score = document.getElementById('score_button');
btn_score.addEventListener('click', score_page);

var btn_disconnect = document.getElementById('disconnect_button')
btn_disconnect.addEventListener('click', disconnect_profile);



// Set MOTUS Title
var username = ""
$.get( "/getUsername", function( data ) {
    username = data
    $('#content_title').html(`Bienvenue ${username} sur le Jeu du MOTUS`);
});     

localStorage.setItem('LEVEL', 0)
var word_to_guess = ""
$.get( "/word", function( data ) {
    word_to_guess = data.trim().toUpperCase()

    var level = parseInt(localStorage.getItem('LEVEL'))
    var newTR = document.createElement('tr')
    document.getElementById('test_grille').appendChild(newTR);
    
    for (let i = 0; i < word_to_guess.length; i++) {
        var newInput = document.createElement('input');
        newInput.setAttribute('id', `input_${level}_${i+1}`)
        newInput.setAttribute("maxLength", 1)
        newInput.setAttribute("oninput", "this.value = this.value.toUpperCase()");
        if (i==0){
            newInput.value = word_to_guess[i]
        }
        newTR.appendChild(newInput);
    }
});     

var array_words = []
$.get( "/motus/array_size", function( data ) {
    array_words = data

})


// var score = {}
// $.get("/score_history", function( data ) {
//     score = data
// });    



function incremente_score(score_history, user, word_to_guess, word_inputed){
    const user_dict = score_history[user]  // Get dict associated to the current USER
    if (!(Object.keys(user_dict).includes(word_to_guess))){  // Check whenever the current WORD is not in the FILE 
        user_dict[word_to_guess] = {score: 0, total_attempts: 0}
    }

    let word_dict = user_dict[word_to_guess];
    if (word_inputed == word_to_guess){
        word_dict.score += 1 
    }
    word_dict.total_attempts += 1
    user_dict[word_to_guess] = word_dict
    score_history[user] = user_dict

}


function get_incrementation(word_to_guess, word_inputed){
    let user_score = JSON.parse( localStorage[localStorage.current_user] );

    if (!(word_to_guess in user_score)){
        user_score[word_to_guess] = JSON.stringify( {score: 0, total_try: 0, average_try: null} ) 
        localStorage[localStorage.current_user] = JSON.stringify( user_score )
    }

    let u_score_word =  JSON.parse( user_score[word_to_guess] );
    if (word_inputed == word_to_guess){
        u_score_word.score += 1 
    }
    u_score_word.total_try += 1
    u_score_word.average_try = u_score_word.total_try / u_score_word.score
    user_score[word_to_guess] = JSON.stringify( u_score_word )
    localStorage[localStorage.current_user] = JSON.stringify( user_score )

}




function get_new_word() {
    $.get( "/motus/array_size", function( data ) {
        ran_numb = data.length * Math.random()
        window.location.href = '/motus/seed=' + parseInt(ran_numb).toString()
    })
}

function func() {
    
    // Set Current TABLE LEVEL (amount of guess so far)
    localStorage.setItem('LEVEL', parseInt(localStorage.getItem('LEVEL')) + 1)
    var level = parseInt(localStorage.getItem('LEVEL'))

    // var u_value = document.getElementById("cword").value.toUpperCase()
    // document.getElementById("cword").value = ""

    // get_incrementation(word_to_guess, u_value)
    // incremente_score(score, user, word_to_guess, u_value)

    
    // Loop that check that EVERY INPUT is FILLED
    var composed_word = ""
    for (let i = 0; i < word_to_guess.length; i++) {
        var slctInput = document.getElementById(`input_${level-1}_${i+1}`)
        if (slctInput.value == ""){
            localStorage.setItem('LEVEL', parseInt(localStorage.getItem('LEVEL')) - 1)
            return alert('You must fill all the BLANKS!')

        }
        composed_word = composed_word + slctInput.value

    }

    // CASE 0: WORD NOT IN BASE
    if (!(array_words.includes(composed_word))){
        for (let i = 1; i < word_to_guess.length; i++) {
            var slctInput = document.getElementById(`input_${level-1}_${i+1}`)
            slctInput.value = ""
        }
        return alert('Word not in Base')
        
    }


    // CASE 1: WORD ALL GUESSED
    if (composed_word == word_to_guess){
        for (let i = 0; i < word_to_guess.length; i++) {
            var slctInput = document.getElementById(`input_${level-1}_${i+1}`)
            slctInput.style.backgroundColor = "green"
        }
        fetch(`http://localhost:4100/incrementUserScore/?username=${username}&wtg=${word_to_guess}&wg=true`)
        btn_new_word.style.display = "inline"
        return alert("Congratulation! You guessed TODAY's Word. If you want more FUN press the 'Guess a New Word' button!")

    }

    // CASE 2: WORD NOT GUESSED
    var newTR = document.createElement('tr')
    newTR.setAttribute('id', `tr_${level}`)
    document.getElementById('test_grille').appendChild(newTR);

    for (let i = 0; i < word_to_guess.length; i++) {
        var slctInput = document.getElementById(`input_${level-1}_${i+1}`)
        var newInput = document.createElement('input');
        newInput.setAttribute('id', `input_${level}_${i+1}`)
        newInput.setAttribute("maxLength", 1)
        newInput.setAttribute("oninput", "this.value = this.value.toUpperCase()");

        if (slctInput.value == word_to_guess[i]){
            slctInput.style.backgroundColor = "green"
            newInput.value = word_to_guess[i]
        }else if (word_to_guess.includes(slctInput.value)){
            slctInput.style.backgroundColor = "orange"
        }

        newTR.appendChild(newInput);
    }
    fetch(`http://localhost:4100/incrementUserScore/?username=${username}&wtg=${word_to_guess}&wg=false`)


}



// // SCORE
function get_score_on_page(){
    let user_score = JSON.parse( localStorage[localStorage.current_user] );
    if (!(word_to_guess in user_score)){
        user_score[word_to_guess] = JSON.stringify( {score: 0, total_try: 0, average_try: null} ) 
        localStorage[localStorage.current_user] = JSON.stringify( user_score )
    }
    let u_score_word =  JSON.parse( user_score[word_to_guess] );

    const nbr_words = Object.keys(user_score).length
    var total_score = 0
    var total_try = 0
    for (let i = 0; i < nbr_words; i++) {
        i_word = Object.keys(user_score)[i]
        let i_word_score =  JSON.parse( user_score[i_word] );
        total_score += parseInt(i_word_score.score)
        total_try += parseInt(i_word_score.average_try)
    }

    localStorage.score_all_word = JSON.stringify( {all_words: nbr_words, all_score: total_score, all_try: total_try, average_try: total_try/total_score} );
    localStorage.score_current_word = JSON.stringify( u_score_word )
}


function score_page(){
    window.location.href = '/scoreboard'
}
function disconnect_profile(){
    window.location.href = '/logout'
}