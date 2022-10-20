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
    $('#content_title').html(`Welcome ${username} on DoLus!`);
});     


// Set Level from session

var gameGrid = ""
var level = ""
var word_to_guess = ""
$.get("/getLevel", function( ldata ) {
    level = parseInt(ldata)
    $.get( "/word", function( wdata ) {
        word_to_guess = wdata.trim().toUpperCase()
        if (level == 0){
            fetch(`http://localhost:4000/initializeSessionGrid/?wlength=${word_to_guess.length}&nlevel=5`)
        }

        $.get( "/gameGrid", function( grid_data ) {
            gameGrid = grid_data
            for (let i = 0; i < Object.keys(gameGrid).length; i++){
                var newTR = document.createElement('tr')
                document.getElementById('test_grille').appendChild(newTR);
                for (let j = 1; j < Object.keys(gameGrid['LEVEL_0']).length; j++) {
                    var newInput = document.createElement('input');
                    newInput.setAttribute('id', `input_${i}_${j}`);
                    newInput.value = gameGrid[`LEVEL_${i}`][`CHARACTER_${j}`]['LETTER']
                    newInput.style.backgroundColor = gameGrid[`LEVEL_${i}`][`CHARACTER_${j}`]['BACKGROUND-COLOR']
                    newInput.setAttribute("maxLength", 1);
                    newInput.setAttribute("disabled", true)
                    newInput.setAttribute("oninput", "this.value = this.value.toUpperCase()");
                    
                    if (i ==0 && j==1){
                        newInput.value = word_to_guess[i]
                    }
                    newTR.appendChild(newInput);
                }
            }
        }) ;

    });
});     

    
for (let j = 0; j < word_to_guess.length; j++) {
    $(`#input_${level}_${j+1}`).prop("disabled", false);
}

// localStorage.setItem('LEVEL', 0)
// var word_to_guess = ""
// $.get( "/word", function( data ) {
//     word_to_guess = data.trim().toUpperCase()

//     var level = parseInt(localStorage.getItem('LEVEL'))
//     var newTR = document.createElement('tr')
//     document.getElementById('test_grille').appendChild(newTR);
    
//     for (let i = 0; i < word_to_guess.length; i++) {
//         var newInput = document.createElement('input');
//         newInput.setAttribute('id', `input_${level}_${i+1}`)
//         newInput.setAttribute("maxLength", 1)
//         newInput.setAttribute("oninput", "this.value = this.value.toUpperCase()");
//         if (i==0){
//             newInput.value = word_to_guess[i]
//         }
//         newTR.appendChild(newInput);
//     }
// });     

var array_words = []
$.get( "/motus/array_size", function( data ) {
    array_words = data
})


// var score = {}
// $.get("/score_history", function( data ) {
//     score = data
// });    


function get_new_word() {
    $.get( "/motus/array_size", function( data ) {
        ran_numb = data.length * Math.random()
        window.location.href = '/motus/seed=' + parseInt(ran_numb).toString()
    })
}


function func() {

    // Set Current TABLE LEVEL (amount of guess so far)
    // localStorage.setItem('LEVEL', parseInt(localStorage.getItem('LEVEL')) + 1)
    // var level = parseInt(localStorage.getItem('LEVEL'))

    // var u_value = document.getElementById("cword").value.toUpperCase()
    // document.getElementById("cword").value = ""

    // get_incrementation(word_to_guess, u_value)
    // incremente_score(score, user, word_to_guess, u_value)

    
    // Loop that check that EVERY INPUT is FILLED
    var composed_word = ""
    for (let i = 0; i < word_to_guess.length; i++) {
        var slctInput = document.getElementById(`input_${level}_${i+1}`)
        if (slctInput.value == ""){
            return alert('You must fill all the BLANKS!')
        }
        composed_word = composed_word + slctInput.value

    }

    // CASE 0: WORD NOT IN BASE
    if (!(array_words.includes(composed_word))){
        alert('oui')
        for (let i = 1; i < word_to_guess.length; i++) {
            gameGrid[`LEVEL_${level}`][`CHARACTER_${i}`]['LETTER'] = ""
            gameGrid[`LEVEL_${level}`][`CHARACTER_${i}`]['BACKGROUND-COLOR'] = ""
        }
        return alert('Word not in Base')
        
    }


    // CASE 1: WORD ALL GUESSED
    if (composed_word == word_to_guess){
        for (let i = 0; i < word_to_guess.length; i++) {
            var slctInput = document.getElementById(`input_${level}_${i+1}`)
            slctInput.style.backgroundColor = "#05a105"
        }
        fetch(`http://localhost:4100/incrementUserScore/?username=${username}&wtg=${word_to_guess}&wg=true`)
        btn_new_word.style.display = "inline"
        return alert("Congratulation! You guessed TODAY's Word. If you want more FUN press the 'Guess a New Word' button!")

    }

    // CASE 2: WORD NOT GUESSED
    for (let i = 0; i < word_to_guess.length; i++) {
        var slctInput = document.getElementById(`input_${level}_${i+1}`)
        var newInput = document.getElementById(`input_${level+1}_${i+1}`);

        newInput.disabled = false;
        if (slctInput.value == word_to_guess[i]){
            slctInput.style.backgroundColor = "#05A105"
            newInput.value = word_to_guess[i]
        }else if (word_to_guess.includes(slctInput.value)){
            slctInput.style.backgroundColor = "FF8000"
        }
    }

    fetch('http://localhost:4000/getUpdateLevel')
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