//Posting form
$(".form__button").on('click', function (e) {
    e.preventDefault();
    e.stopPropagation();

    let parent = $(this).parents('form')

    // reset indicators (error etc.)
    parent.find('.form__error').removeClass('active')
    parent.find('input').removeClass('required__unset')
    parent.find('.loading').addClass('is_loading')

    let err = validateForm(parent)
    if (err) {
        setError(parent, err)
        return
    }

    //build request body (aka serialize)
    let formdata = new FormData(parent[0])

    //getting, adding user
    $.ajax({
        url: parent.attr('action'),
        type: "POST",
        data: formdata,
        processData: false, //!!!
        contentType: false, //!!!
        success: (id) => {
            parent.find('.loading').removeClass('is_loading')
            parent.animate({opacity: "0"}, 400, "swing", () => {
                Cookies.set('id', id)
                Cookies.set('userName', formdata.get('userName'))
                window.location.assign(`/dashboard#banks`)
            })
            // redirecting to dashboard
        },
        error: (err) => {
            //error sent from server (SQL err, bcrypt mismatch etc.)
            let error = err.responseJSON.err;
            if (/not found!/.test(error)) {
                parent.find('.input_type--name').addClass('required__unset')
            } else if (error === 'Wrong password!') {
                parent.find('.input_type--password').addClass('required__unset')
            } else if (/in use!/.test(error)) {
                parent.find('.input_type--name').addClass('required__unset')
            }
            setError(parent, error)
        }
    })
})

//Showing passwords
$(".control_type--showpass").on('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    $(this).children().toggleClass("hide")
    let nextType = $(this).siblings(".input__input").attr("type") === "text" ? "password" : "text"
    $(this).siblings(".input__input").attr("type", nextType)
})


// Set error
function setError(parent, err) {
    parent.children('.error').text(err).addClass('active')
    parent.find('.loading').removeClass('is_loading')
}

//Validate form and update required inputs (можна краще?? TODO??)
function validateForm(parent) {
    let err = defaultValidation(parent)
    if (err) {
        return "Please, fill all required inputs!"
    }
    if (parent.hasClass('form__login')) { //не універсально.. TODO??
        return false
    }
    let password = parent.find('.input_type--password')
    console.log(password)
    console.log(password[0].value)
    let pass_err = isPasswordValid(password[0].value)
    if (pass_err) {
        password.addClass("required__unset")
        return pass_err
    }
    let passwordToCompare = parent.find('.input_type--password_check')
    if (passwordToCompare[0]) {
        if (!(passwordToCompare[0].value === password[0].value)) {
            passwordToCompare.addClass("required__unset")
            return "Passwords don't match!"
        }
    }
    return err
}

function isPasswordValid(password) {
    if (password.length < 6) {
        return "Password should contain at least 6 characters!"
    }
    if (!(/[0-9]/.test(password))) {
        return "Password should contain numbers!"
    }
    if (!(/[a-zа-ягґїъёэыіє]/.test(password))) {
        return "Password should contain lowercase letters!"
    }
    if (!(/[A-ZА-ЯГҐЇЪЁЭЫІЄ]/.test(password))) {
        return "Password should contain uppercase letters!"
    }
    if (!(/[_@#!~\/\*-\+&<>\?=%\.,]/.test(password))) {
        return "Password should contain special characters! (!@# etc.)"
    }
    return false
}