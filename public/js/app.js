const TASK_MANAGER_API = 'phi-task-manager.herokuapp.com'
//const TASK_MANAGER_API = 'localhost:3000'

function togglePasswordView() {
    var x = document.getElementById('login-password');
    if (x.type === "password") {
        x.type = 'text';
    } else {
        x.type = 'password';
    }
}

$(document).ready(function() {
    // $('log-in').submit(function(event){
    //     var _email = $('#login-email').val();
    //     var _password = $('#password').val();
    //     $.post(TASK_MANAGER_API + "/users/login",{
    //         email: _email,
    //         password: _password
    //     }).done(function(data){
    //         console.log(data+ 'hi')
    //         // $.cookie('token',data.token)
    //     })
    // })

    $.ajax({
        method: "POST",
        url: TASK_MANAGER_API + "/users/login",
        data: {
            "email": $('#login-email').val(),
            "password": $('#password').val()
        }
    })
    .done(function( login_res ) {
        alert( "Logged in " );
        $.ajax({
            type: "GET", //GET, POST, PUT
            url: '/users/me',  //the url to call
            data: yourData,     //Data sent to server
            contentType: contentType,           
            beforeSend: function (xhr) {   //Include the bearer token in header
                xhr.setRequestHeader("Authorization", 'Bearer '+ login_res.token);
            }
        }).done(function (response) {
            $(body).append(response)
        }).fail(function (err)  {
            //Error during request
        });
    });



})