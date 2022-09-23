var btn = document.getElementById('submit');
btn.addEventListener('click', func);

var word_to_guess = ""
var len_word_to_guess = 0
$.get( "/word", function( data ) {
    word_to_guess = data
    len_word_to_guess = data.length
}); 



function func() {

            
    var u_value = document.getElementById("cword").value
    document.getElementById("cword").value = ""

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


