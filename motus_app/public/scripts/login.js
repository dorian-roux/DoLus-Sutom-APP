const btn_login = document.getElementById('submit_login');

const ipt_username = document.getElementById('clt_username')
const ipt_password = document.getElementById('clt_password')


btn_login.addEventListener("click", (event) => {   

    event.preventDefault()

    var username = ipt_username.value;
    var password = ipt_password.value;

    if (username == ''){
        window.alert('You must fill the USERNAME')
    }else if(password == ''){
        window.alert('You must fill the PASSWORD')
    }else{
        fetch('http://localhost:4200/loginUser/?username=' + username + '&password=' + password)
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

                }else if (text == "Wrong USERNAME / USERNAME not REGISTERED"){
                    window.alert(text)

                }else if (text== "Wrong PASSWORD / PASSWORD not REGISTERED"){
                    window.alert(text)
                }
            }
        })
    }
})




function register_user(){
    

}