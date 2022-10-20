const ipt_username = document.getElementById('nclt-username')
const ipt_password = document.getElementById('nclt-password')
const ipt_cpassword = document.getElementById('nclt-confirm-password')
const txt_register_info = document.getElementById('register-error');

const btn_register = document.getElementById('btn-register')
btn_register.addEventListener("click", makeRegisterUser);


function makeRegisterUser(event){

    // Prevent the default action to be taken as it does not get explicitely handled.
    event.preventDefault()

    // -- Set Variables --
    var username = ipt_username.value;
    var password = ipt_password.value;
    var cpassword = ipt_cpassword.value;
        
    // -- Check Use Cases --



    // --- Empty INPUT ---
    if (username == '' || password == '' || cpassword == ''){
        password = '';
        cpassword = '';
        return getWarningInformation(txt_register_info, 'You must fill the REGISTER Identifiers')
    }

    // --- Password and Password Confirmation differ ---
    if (password != cpassword ){
        password = '';
        cpassword = '';
        return getWarningInformation(txt_register_info, 'You entered different PASSWORDS. Retry using the same')
    }

    // --- Check whether the Password Strengh
    // cps = confirmPasswordStrength()
    // if (cps != true){
    //     return window.alert(cps)
    // }


    fetch('http://localhost:4200/registerUserAccount/?username=' + username + '&password=' + password)
    .then(response => {
        if(response.ok){
            return response.text();
        }
    }).then(text => {
        if (text) {
            if (text=="true"){
                fetch('http://localhost:4100/registerUserScore/?username=' + username);
                fetch('http://localhost:4000/registerUserGrid/?username=' + username);

                swal('Account Successfully Created!', "You will now be redirected to the Login.", "success")
                .then(() => {
                    document.location = '/login';
                })
            }else{
                password = '';
                cpassword = '';
                return getWarningInformation(txt_register_info, text)
            }
        }
    })

}


function confirmPasswordStrength(password){

    // Regular Expressions 
    var regex = new Array();
    regex.push("[A-Z]"); //For Uppercase Alphabet
    regex.push("[a-z]"); //For Lowercase Alphabet
    regex.push("[0-9]"); //For Numeric Digits
    regex.push("[$@$!%*#?&]"); //For Special Characters
    var succeed = 0;
    
    // Verify each Regular Expressions
    for (var i = 0; i < regex.length; i++) {
        if((new RegExp (regex[i])).test(password)){
            succeed++;
        }
    }

    // Validate the PASSWORD
    if(succeed == 4 && password.length > 8){
        return true
    }else{
        return 'Your Password is not strong enough. Make sure to fill the requirements.'
    }
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