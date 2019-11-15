
$(document).ready(function() {
     // GET PROFILE DATA GET PROFILE DATA GET PROFILE DATA GET PROFILE DATA
    const get_profile = () => {
        $.ajax({
            type: "GET", //GET, POST, PUT
            url: '/users/me',  //the url to call   
            contentType: "application/json; charset=utf-8", 
            beforeSend: function (xhr) {   //Include the bearer token in header
                // xhr.setRequestHeader("Authorization", 'Bearer '+ login_res.token);
                xhr.setRequestHeader("Authorization", getAuthCookie());
            }
        }).done(function (response) {
                $('#profile').removeClass('hide');
                $('#profile').addClass('grid');
                if(response.avatar === undefined) {
                    $('#image-wrapper').prepend("<img id='profile-image' src='https://via.placeholder.com/150'/>")
                }
                else {
                    $('#image-wrapper').prepend(
                        `<img id='profile-image' src='data:image/png;base64,${response.avatar}'/>`    
                    );
                }
                $('#profile-header').append(`<h1>${response.name}</h1>`);
            // let profile_data = 
        }).fail(function (err)  {
            console.log('fail');
            $('#no-user').addClass('flex');
            $('#no-user').removeClass('hide');
        });
    }
    get_profile();
    // GET PROFILE DATA GET PROFILE DATA GET PROFILE DATA GET PROFILE DATA

    
    // CHANGE AVATAR BUTTON
    $('#change-profile').click(function(event){
        $('#image-upload-form').toggleClass('hide');
        $('#image-upload-form').toggleClass('flex');
    });
    // CHANGE AVATAR BUTTON
    // IMAGE UPLOAD BUTTON START 
    $('#image-upload-form').submit(function() {
        event.preventDefault();
        var formData = new FormData(this);
        
        console.log("hi" + formData)
        $.ajax({
            type: "POST", //GET, POST, PUT
            url: '/users/me/avatar',  //the url to call  
            beforeSend: function (xhr) {   //Include the bearer token in header
                // xhr.setRequestHeader("Authorization", 'Bearer '+ login_res.token);
                xhr.setRequestHeader("Authorization", getAuthCookie());
                // xhr.setRequestHeader('Content-Type', 'charset=utf-8');
            },
            data: formData,
            async: false,
            cache: false,
            processData: false, 
            contentType: false 
        }).done(function (response) {
            window.location.replace(TASK_MANAGER_API + '/profile');
            // let profile_data = 
        }).fail(function (err)  {
            console.log('fail ON IMAGE UPLOAD');
        });
    });
    // IMAGE UPLOAD BUTTON END

    $('#login-or-signup').click(function(event) {
        window.location.replace(TASK_MANAGER_API + '/login.html');
    });

});
