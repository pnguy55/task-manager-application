const TASK_MANAGER_API = 'https://phi-task-manager.herokuapp.com'
//const TASK_MANAGER_API = 'http://localhost:3000'

function togglePasswordView() {
    var x = document.getElementById('login-password');
    if (x.type === "password") {
        x.type = 'text';
    } else {
        x.type = 'password';
    }
}

$(document).ready(function() {

    $('#login-form').click(function(event){
        $('#form-select-buttons').removeClass('flex');
        $('#form-select-buttons').addClass('hide');
        $('.input-field').addClass('flex');
        $('.input-field').removeClass('hide');
        $('#login-button').removeClass('hide');
        $('#signup-button').addClass('hide');
    });
    $('#signup-form').click(function(event){
        $('#form-select-buttons').removeClass('flex');
        $('#form-select-buttons').addClass('hide');
        $('.input-field').addClass('flex');
        $('.input-field').removeClass('hide');
        $('#signup-button').removeClass('hide');
        $('#login-button').addClass('hide');
    });

    $('#back-to-form-select').click(function(event){
        $('#form-select-buttons').removeClass('hide');
        $('#form-select-buttons').addClass('flex');
        $('.input-field').addClass('hide');
        $('.input-field').removeClass('flex');
        $('#signup-button').removeClass('flex');
        $('#login-button').removeClass('flex');
        $('#signup-button').addClass('hide');
        $('#login-button').addClass('hide');
    });

    // login code - needs to add more to the body of the view profile after log-in
    $('#login-button').click(function(event){

        event.preventDefault();

        

        $.ajax({
            beforeSend: function(xhrObj){
                xhrObj.setRequestHeader("Content-Type","application/json");
                xhrObj.setRequestHeader("Accept","application/json");
            },
            method: "POST",
            url: TASK_MANAGER_API + "/users/login",
            dataType: 'json',
            data: JSON.stringify({
                "email": $('#login-email').val(),
                "password": $('#login-password').val()
            })
        })
        .done(function( login_res ) {
            // ONCE WE ARE LOGGED IN WE HAVE ACCESS TO THE JWT TOKEN on the login_res object
            $.ajax({
                type: "GET", //GET, POST, PUT
                url: '/users/me',  //the url to call      
                beforeSend: function (xhr) {   //Include the bearer token in header
                    xhr.setRequestHeader("Authorization", 'Bearer '+ login_res.token);
                }
            }).done(function (response) {
                let name = response.name

                $('#login').html(name)
                // let profile_data = 
            }).fail(function (err)  {
                //Error during request
            });
        });
    })
    // SIGN UP CODE just change the AJAX POST to send the correct body
    $('#signup-button').click(function(event) {
        $.ajax({
            beforeSend: function(xhrObj){
                xhrObj.setRequestHeader("Content-Type","application/json");
                xhrObj.setRequestHeader("Accept","application/json");
            },
            method: "POST",
            url: TASK_MANAGER_API + "/users/create-user",
            dataType: 'json',
            data: JSON.stringify({
                "email": $('#login-email').val(),
                "password": $('#login-password').val()
            })
        })
        .done(function( login_res ) {
            $.ajax({
                type: "GET", //GET, POST, PUT
                url: '/users/me',  //the url to call      
                beforeSend: function (xhr) {   //Include the bearer token in header
                    xhr.setRequestHeader("Authorization", 'Bearer '+ login_res.token);
                }
            }).done(function (response) {
                let name = response.name

                $('#login').html(name)
                // let profile_data = 
            }).fail(function (err)  {
                //Error during request
            });
        });
    });

    



})