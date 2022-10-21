const btn_login = document.getElementById('submit_login');
btn_login.addEventListener('click', makeLoginUser)

const ipt_username = document.getElementById('clt_username')
const ipt_password = document.getElementById('clt_password')



const txt_login_info = document.getElementById('login-error');


function makeLoginUser(event) {

    // Prevent the default action to be taken as it does not get explicitely handled.
    event.preventDefault()

    var username = ipt_username.value;
    var password = ipt_password.value;

    if (username == '' && password == ''){
        return getWarningInformation(txt_login_info, 'You must fill the LOGIN Identifiers')
    }

    if (username == ''){
        return getWarningInformation(txt_login_info, 'You must fill the USERNAME')

    }
    if(password == ''){
        return getWarningInformation(txt_login_info, 'You must fill the PASSWORD')
    }
    
    
    fetch('http://localhost:4200/loginUserAccount/?username=' + username + '&password=' + password)
    .then(response => {
        if(response.ok){
            return response.text();
        }
    }).then(text => {
        if (text) {
            if (text == "true"){
                fetch('http://localhost:4000/updateUserSession/?username=' + username)
                .then(response => {
                    if (response.ok){
                        return response.text();
                    }
                })
                .then(() => {
                    document.location = '/'
                })

            }else{
                return getWarningInformation(txt_login_info, text)                
            }
        }
    })

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