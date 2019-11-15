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

function getAuthCookie() {
    var cn = "Authorization=";
    var idx = document.cookie.indexOf(cn)
 
    if (idx != -1) {
        var end = document.cookie.indexOf(";", idx + 1);
        if (end == -1) end = document.cookie.length;
        return unescape(document.cookie.substring(idx + cn.length, end));
    } else {
        return "";
   }
 }

function eraseCookie(name) {   
    document.cookie = name+'=; Max-Age=-99999999;';  
}

$(document).ready(function() {

    $('#login-form').click(function(event){
        $('#form-select-buttons').removeClass('flex');
        $('#form-select-buttons').addClass('hide');
        $('.input-field').addClass('flex');
        $('.input-field').removeClass('hide');
        $('.signup-field').removeClass('flex');
        $('.signup-field').addClass('hide');
        $('#login-button').removeClass('hide');
        $('#signup-button').addClass('hide');
    });
    $('#signup-form').click(function(event){
        $('#form-select-buttons').removeClass('flex');
        $('#form-select-buttons').addClass('hide');
        $('.signup-field').addClass('flex');
        $('.signup-field').removeClass('hide');
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

    $('#logout-nav').click(function(event){
        $.ajax({
            type: "POST", //GET, POST, PUT
            url: '/users/logout',  //the url to call   
            contentType: "application/json; charset=utf-8", 
            beforeSend: function (xhr) {   //Include the bearer token in header
                // xhr.setRequestHeader("Authorization", 'Bearer '+ login_res.token);
                xhr.setRequestHeader("Authorization", getAuthCookie());
            }
        }).done(function (response) {
            eraseCookie();
            window.location.replace(TASK_MANAGER_API + '/index.html');
            // let profile_data = 
        }).fail(function (err)  {
            $('#no-user').addClass('flex');
            $('#no-user').removeClass('hide');
        });
        
    });

    $('#login-nav').click(function(event){
        eraseCookie();
        window.location.replace(TASK_MANAGER_API + '/login');
    });

    // login code - needs to add more to the body of the view profile after log-in
    $('#login-button').click(function(event){
        eraseCookie();
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
            var header = `Authorization= Bearer ${login_res.token}`;
            document.cookie = header;
            window.location.replace(TASK_MANAGER_API + '/profile');
        });
    })
    // SIGN UP CODE just change the AJAX POST to send the correct body
    $('#signup-button').click(function(event) {
        eraseCookie();
        event.preventDefault();
        $.ajax({
            beforeSend: function(xhrObj){
                xhrObj.setRequestHeader("Content-Type","application/json");
                xhrObj.setRequestHeader("Accept","application/json");
            },
            method: "POST",
            url: TASK_MANAGER_API + "/users/create-user",
            dataType: 'json',
            data: JSON.stringify({
                "name": $('#signup-name').val(),
                "email": $('#login-email').val(),
                "age": $('#signup-age').val(),
                "password": $('#login-password').val()
            })
        })
        .done(function( login_res ) {
            // ONCE WE ARE LOGGED IN WE HAVE ACCESS TO THE JWT TOKEN on the login_res object
            var header = `Authorization= Bearer ${login_res.token}`;
            document.cookie = header;
            $.ajax({
                type: "GET", //GET, POST, PUT
                url: '/users/me',  //the url to call   
                contentType: "application/json; charset=utf-8", 
                beforeSend: function (xhr) {   //Include the bearer token in header
                    // xhr.setRequestHeader("Authorization", 'Bearer '+ login_res.token);
                    xhr.setRequestHeader("Authorization", getAuthCookie());
                }
            }).done(function (response) {
                var header = `Authorization= Bearer ${login_res.token}`;
                document.cookie = header;
                window.location.replace(TASK_MANAGER_API + '/profile');
                // let profile_data = 
            }).fail(function (err)  {
                //Error during request
            });
        });
    });

    



})