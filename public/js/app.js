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
    $('#log-in').submit(function(event){

        event.preventDefault();

        $.ajax({
            beforeSend: function(xhrObj){
                xhrObj.setRequestHeader("Content-Type","application/json");
                xhrObj.setRequestHeader("Accept","application/json");
            },
            method: "POST",
            url: TASK_MANAGER_API + "/users/login",
            dataType: 'json',
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

    



})