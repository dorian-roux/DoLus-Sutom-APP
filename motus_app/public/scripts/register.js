const ipt_username = document.getElementById('nclt-username')
const ipt_password = document.getElementById('nclt-password')
const ipt_cpassword = document.getElementById('nclt-confirm-password')

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
        return window.alert('You must fill ALL the INPUTS')
    }

    // --- Password and Password Confirmation differ ---
    if (password != cpassword ){
        password = '';
        cpassword = '';
        return window.alert('You entered diferent PASSWORDS. Retry using the same.')

    }

    fetch('http://localhost:4200/registerUserAccount/?username=' + username + '&password=' + password)
    .then(response => {
        if(response.ok){
            return response.text();
        }
    }).then(text => {
        if (text) {
            alert(text)
            if (text=="true"){
                fetch('http://localhost:4100/registerUserScore/?username=' + username)
                window.alert(`Your account ${username} has been created \n You will now be redirected to the Login`);
                document.location = '/login';
            }else{
                password = '';
                cpassword = '';
                return window.alert(text)

            }
        }
    })

}
