// TITLE
$('#content_title').html('Bienvenue ' + localStorage.current_user + ' au jeu MOTUS');




var btn = document.getElementById('submit');
btn.addEventListener('click', func);


var btn_score = document.getElementById('score_button');
btn_score.addEventListener('click', get_score_on_page);

var btn_disconnect = document.getElementById('disconnect_button')
btn_disconnect.addEventListener('click', disconnect_profile);


var word_to_guess = ""
var len_word_to_guess = 0
$.get( "/word", function( data ) {
    word_to_guess = data.trim().toUpperCase()
    len_word_to_guess = data.trim().length
    first_letter = word_to_guess[0]
    document.getElementById("cword").value = first_letter
});     

// LOCAL USER MANAG
if (!('current_user' in localStorage)){
    location.href = '/login'
}

// 

if (!(localStorage.current_user in localStorage)){
    localStorage[localStorage.current_user] = JSON.stringify({});
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


function func() {

    var u_value = document.getElementById("cword").value.toUpperCase()
    document.getElementById("cword").value = ""


    get_incrementation(word_to_guess, u_value)
   
    var newSpan = document.createElement('span');
    document.getElementById('result').appendChild(newSpan);
    var true_word_splt = word_to_guess.split("")
    var user_word_splt = u_value.split("")
    
    for (let i = 0; i < user_word_splt.length; i++) {

        var newSpan = document.createElement('span');
        document.getElementById('result').appendChild(newSpan);
        newSpan.innerHTML = user_word_splt[i]
        if (i == user_word_splt.length - 1){
            newSpan.innerHTML = newSpan.innerHTML + " <br /> "
        }

        if (true_word_splt[i] == user_word_splt[i]){
            newSpan.style.backgroundColor = "green"
        }else if (true_word_splt.includes(user_word_splt[i])){
            newSpan.style.backgroundColor = "orange"
        }
    }
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


function disconnect_profile(){
    localStorage.removeItem('current_user')
    window.location.href = '/login'
}