// BUTTONS
var btn_guess = document.getElementById('submit_guess');
btn_guess.addEventListener('click', func);

var btn_new_word = document.getElementById('get_new_word');
btn_new_word.addEventListener('click', get_new_word);

var btn_score = document.getElementById('score_button');
btn_score.addEventListener('click', score_page);

var btn_disconnect = document.getElementById('disconnect_button')
btn_disconnect.addEventListener('click', disconnect_profile);


var div_word_success_failure = document.getElementById('word-find-success-failure')
var txt_error_guess = document.getElementById('error-guess')


// Set MOTUS Title
var username = ""
$.get( "/getUsername", function( data ) {
    username = data
    $('#content_title').html(`Bienvenue ${username} sur le Jeu du MOTUS`);
});     


var word_to_guess = ""
$.get( "/word", function( data ) {
    word_to_guess = data.trim().toUpperCase()
    build_grid(word_to_guess)
})


function build_grid(word_to_guess, rebuild_grid=false){
    // FETCH the GRID
    fetch('http://localhost:4000/verifyUserGrid')  // Verify the Existence of the GRID
    fetch('http://localhost:4000/makeUserWordGrid')  // Get the GRID
    .then(response => {
        if(response.ok){
            return response.text();
        }
    }).then(text => {
        if (text) {
            const user_cword_grid = JSON.parse(text)
            const user_grid = user_cword_grid['GRID']
            var is_disabled = false

            // WORD FOUND
            if (user_cword_grid['DISCOVERED']){
                div_word_success_failure.style.display = "block";
                var firstSpan = document.createElement('span')
                var secondSpan = document.createElement('span')
                div_word_success_failure.appendChild(firstSpan);
                div_word_success_failure.appendChild(document.createElement('br'));
                div_word_success_failure.appendChild(secondSpan);
                firstSpan.innerHTML = "Congratulation, you find Today's Word!";
                secondSpan.innerHTML = "Come back TOMORROW to enjoy even more our GAME!";
                firstSpan.style.color = "#05A105";
                secondSpan.style.color = "#05A105";
                btn_guess.style.display = "none";
                is_disabled = true   
            }

            // WORD not FOUND
            if (user_grid['LEVEL'] >= 5){
                div_word_success_failure.style.display = "block";
                var firstSpan = document.createElement('span')
                var secondSpan = document.createElement('span')
                div_word_success_failure.appendChild(firstSpan);
                div_word_success_failure.appendChild(document.createElement('br'));
                div_word_success_failure.appendChild(secondSpan);
                firstSpan.innerHTML = "Too Bad, you had your chance and you did not find Today's Word!!";
                secondSpan.innerHTML = "Come back TOMORROW and get your revenge against our GAME!";                
                firstSpan.style.color = "#850000";
                secondSpan.style.color = "#850000";
                btn_guess.style.display = "none";
                is_disabled = true   
            }
            

            // ReBuild the GRID (INPUTS IDs already exists)
            if (rebuild_grid){
                for (let i_lvl=0; i_lvl < 5; i_lvl++){
                    for (let i_wtg=0; i_wtg < word_to_guess.length; i_wtg++) {
                        var newInput = document.getElementById(`input_${i_lvl}_${i_wtg}`)
                        newInput.value = user_grid['SCHEME'][`LEVEL_${i_lvl}`][`CHARACTER_${i_wtg}`]['LETTER']
                        newInput.style.backgroundColor = user_grid['SCHEME'][`LEVEL_${i_lvl}`][`CHARACTER_${i_wtg}`]['BACKGROUND-COLOR']
                        newInput.disabled = true
                        if (!is_disabled){
                            if (user_grid['LEVEL'] == i_lvl){
                                newInput.disabled = false
                            }
                        }
                    }
                }
            }else{
                // Build the GRID (Initialize the INPUTS and IDs)
                for (let i_lvl=0; i_lvl < 5; i_lvl++){
                    var newTR = document.createElement('tr')
                    document.getElementById('test_grille').appendChild(newTR);
                    for (let i_wtg=0; i_wtg < word_to_guess.length; i_wtg++) {
                        var newInput = document.createElement('input');
                        newInput.setAttribute('id', `input_${i_lvl}_${i_wtg}`)
                        newInput.setAttribute("maxLength", 1)
                        newInput.setAttribute("oninput", "this.value = this.value.toUpperCase()");
                        newInput.value = user_grid['SCHEME'][`LEVEL_${i_lvl}`][`CHARACTER_${i_wtg}`]['LETTER']
                        newInput.style.backgroundColor = user_grid['SCHEME'][`LEVEL_${i_lvl}`][`CHARACTER_${i_wtg}`]['BACKGROUND-COLOR']
                        newInput.disabled = true
                        if (!is_disabled){
                            if (user_grid['LEVEL'] == i_lvl){
                                newInput.disabled = false
                            }
                        }
                        newTR.appendChild(newInput);
                    }
                }
            }
        }
    })
}


function modify_grid(word_to_guess){
    // FETCH the GRID
    fetch('http://localhost:4000/makeUserWordGrid')
    .then(response => {
        if(response.ok){
            return response.text();
        }
    }).then(text => {
            const user_cword_grid = JSON.parse(text)
            const user_grid = user_cword_grid['GRID']
            var is_disabled = false

            // WORD FOUND
            if (user_cword_grid['DISCOVERED']){
                div_word_success_failure.style.display = "block";
                var firstSpan = document.createElement('span')
                var secondSpan = document.createElement('span')
                div_word_success_failure.appendChild(firstSpan);
                div_word_success_failure.appendChild(document.createElement('br'));
                div_word_success_failure.appendChild(secondSpan);
                firstSpan.innerHTML = "Congratulation, you find Today's Word!";
                secondSpan.innerHTML = "Come back TOMORROW to enjoy even more our GAME!";
                firstSpan.style.color = "#05A105";
                secondSpan.style.color = "#05A105";
                btn_guess.style.display = "none";
                is_disabled = true  
                // WORD NOT FIND AND CHANCE STILL ON
                for (let i_lvl=0; i_lvl < 5; i_lvl++){
                    for (let i_wtg=0; i_wtg < word_to_guess.length; i_wtg++) {
                        var newInput = document.getElementById(`input_${i_lvl}_${i_wtg}`)
                        newInput.value = user_grid['SCHEME'][`LEVEL_${i_lvl}`][`CHARACTER_${i_wtg}`]['LETTER']
                        newInput.style.backgroundColor = user_grid['SCHEME'][`LEVEL_${i_lvl}`][`CHARACTER_${i_wtg}`]['BACKGROUND-COLOR']
                        newInput.disabled = true
                        if (!is_disabled){
                            if (user_grid['LEVEL'] == i_lvl){
                                newInput.disabled = false
                            }
                        }
                    }
            } 
                
            }

            // WORD not FOUND
            if (user_grid['LEVEL'] >= 5){
                div_word_success_failure.style.display = "block";
                var firstSpan = document.createElement('span')
                var secondSpan = document.createElement('span')
                div_word_success_failure.appendChild(firstSpan);
                div_word_success_failure.appendChild(document.createElement('br'));
                div_word_success_failure.appendChild(secondSpan);
                firstSpan.innerHTML = "Too Bad, you had your chance and you did not find Today's Word!!";
                secondSpan.innerHTML = "Come back TOMORROW and get your revenge against our GAME!";                
                firstSpan.style.color = "#850000";
                secondSpan.style.color = "#850000";
                btn_guess.style.display = "none";
                is_disabled = true   
            }
            
            // WORD NOT FIND AND CHANCE STILL ON
            for (let i_lvl=0; i_lvl < 5; i_lvl++){
                for (let i_wtg=0; i_wtg < word_to_guess.length; i_wtg++) {
                    var newInput = document.getElementById(`input_${i_lvl}_${i_wtg}`)
                    newInput.value = user_grid['SCHEME'][`LEVEL_${i_lvl}`][`CHARACTER_${i_wtg}`]['LETTER']
                    newInput.style.backgroundColor = user_grid['SCHEME'][`LEVEL_${i_lvl}`][`CHARACTER_${i_wtg}`]['BACKGROUND-COLOR']
                    newInput.disabled = true
                    if (!is_disabled){
                        if (user_grid['LEVEL'] == i_lvl){
                            newInput.disabled = false
                        }
                    }
                }
            }
        })
}




function get_new_word() {
    $.get( "/motus/array_size", function( data ) {
        ran_numb = data.length * Math.random()
        window.location.href = '/motus/seed=' + parseInt(ran_numb).toString()
    })
}


async function func() {
 

    // Get the current GRID LEVEL
    var grid_level = await getLevelGrid('http://localhost:4000/makeUserWordGrid')
    grid_level = grid_level['GRID']['LEVEL']


    // Compose the SUBMITED WORD through a LOOP
    var composed_word = ""
    for (let i_wtg = 0; i_wtg < word_to_guess.length; i_wtg++) {
        var slctInput = document.getElementById(`input_${grid_level}_${i_wtg}`)
        composed_word = composed_word + slctInput.value
    }

    fetch(`http://localhost:4000/modifyUserGrid/?word_to_guess=${word_to_guess}&word_guessed=${composed_word}`)
    .then(response => {
        if(response.ok){
            return response.text();
        }
    }).then(text => {
        if (text == 'CASE_1'){
            getWarningInformation(txt_error_guess, 'Please FILL all the INPUTs')
            modify_grid(word_to_guess)

        }else if (text == 'CASE_2'){
            getWarningInformation(txt_error_guess, 'NO such WORD exists within the DATABASE')
            modify_grid(word_to_guess)

        }else if (text == 'CASE_3'){
            fetch(`http://localhost:4100/incrementUserScore/?username=${username}&wtg=${word_to_guess}&wg=false`)
            modify_grid(word_to_guess)

        }else if (text == 'CASE_4'){
            fetch(`http://localhost:4100/incrementUserScore/?username=${username}&wtg=${word_to_guess}&wg=true`)
            modify_grid(word_to_guess)

        }
    })

    modify_grid(word_to_guess)
}


async function getLevelGrid(url) {
    const response = await fetch(url);
    return response.json();
  }
  



function score_page(){
    window.location.href = '/scoreboard'
}
function disconnect_profile(){
    window.location.href = '/logout'
}





// Function that display within an INPUTED area the INPUTED text as a warning/error
function getWarningInformation(warning_element, warning_content){
    warning_element.style.opacity = 1;
    warning_element.style.transition = 'opacity linear 2s'; 
    warning_element.innerHTML = '⚠️' + '  ' + warning_content
    setTimeout(function() {
        warning_element.style.opacity = 0;
        warning_element.style.transition = 'opacity linear 2s';
        warning_element.innerHTML = ''
    }, 5000);
}