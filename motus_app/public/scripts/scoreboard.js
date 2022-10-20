const btn_main_page = document.getElementById('btn-main-page');
btn_main_page.addEventListener('click', gotoMainPage)

// Score about Today's Word
const word_score_value = document.getElementById('word-score-value')
const word_score_ntry = document.getElementById('word-score-ntry')


// Score about User Profile
const profile_words = document.getElementById('profile-words')
const profile_score = document.getElementById('profile-score')
const profile_ntry = document.getElementById('profile-ntry')
const profile_avgtry = document.getElementById('profile-avgtry')



// Title
const title_score_profile = document.getElementById('score-profile')


var username = ''
$.get('/getUsername', function( udata ) {
    title_score_profile.innerHTML =  `${udata} Complete Profile Score`
    $.get('/word', function ( wdata ) {

        fetch(`http://localhost:4100/get_user_information/?username=${udata}`)
        .then(response => {
            if(response.ok){
                return response.text();
            }
        }).then(text => {
            if (text) {
                user_score = JSON.parse(text)
                if (!(Object.keys(user_score).includes(wdata))){
                    word_score_value.innerHTML = "Today's Word has not been played" 
                }else{
                    user_score_cword = user_score[wdata]
                    if (user_score_cword.score == 0){
                        word_score_value.innerHTML = "Today's Word has not been found"
                    }else{
                        word_score_value.innerHTML = "Today's Word has been found"
                    }
                    word_score_ntry.innerHTML = `Number of Attempts: ${user_score_cword.total_attempts}`    
                }
               
            

                var profile_all_attempts = 0
                var profile_all_score = 0
                for (word in user_score){
                    user_cword = user_score[word]
                    profile_all_score += user_cword.score
                    profile_all_attempts += user_cword.total_attempts
                } 

                // Profile User
                profile_words.innerHTML = Object.keys(user_score).length
                profile_score.innerHTML = profile_all_score
                profile_ntry.innerHTML = profile_all_attempts
                profile_avgtry.innerHTML = Math.round((profile_all_attempts / profile_all_score) * 100) / 100
            }
        })
                            
                            
    });     
})


function gotoMainPage(){
    window.location.href = '/'
}


{/* <script>
let user_score_word =  JSON.parse(localStorage.score_current_word) 

if (user_score_word.average_try==null){
    user_score_word.average_try = "No Data Available"
}


var is_find = "Word not Find"
if (user_score_word.score != 0){
    is_find = "Word has been Find"
}
$("#score_value").html(is_find)
$("#score_avgtry").html(user_score_word.average_try)



let user_score_all_word = JSON.parse(localStorage.score_all_word)
if (user_score_all_word.average_try==null){
    user_score_all_word.average_try = "No Data Available"
}


$("#total_words").html(user_score_all_word.all_words)
$("#total_score").html(user_score_all_word.all_score)
$("#total_attemps").html(user_score_all_word.all_try)
$("#total_average_attempts").html(user_score_all_word.average_try)

</script> */}