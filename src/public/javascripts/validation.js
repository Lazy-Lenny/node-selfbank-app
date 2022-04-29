// Self-replacing input events (Blocking character by RegEx)

$(".input_val-string:not(.input_val-special)").on('input', function (e) {
    e.preventDefault()
    e.stopPropagation()
    $(this).parent().siblings('.form__error').removeClass('active')
    $(this).removeClass("required__unset").val($(this).val().replace(/[^a-zA-Zа-яА-ЯйЙёЁґҐїЇъЪіІыЫєЄэЭ0-9_]+/g, ''))
})

$(".input_val-string").on('input', function (e) {
    e.preventDefault()
    e.stopPropagation()
    $(this).parent().siblings('.form__error').removeClass('active')
    $(this).removeClass("required__unset").val($(this).val().replace(/[^a-zA-Zа-яА-ЯйЙёЁґҐїЇъЪіІыЫєЄэЭ0-9\_\@\#\!\~\/\*\-\+\&\<\>\?\=\%\.\,]+/g, ''))
})

$(".input_val-numeric").on('input', function (e) {
    e.preventDefault()
    e.stopPropagation()
    $(this).parent().siblings('.form__error').removeClass('active')
    $(this).removeClass("required__unset").val($(this).val().replace(/[^0-9]+/g, ''))
})

$(".input_val-numeric-zero-prevent").on('input', function (e) {
    e.preventDefault()
    e.stopPropagation()
    $(this).parent().siblings('.form__error').removeClass('active')
    $(this).removeClass("required__unset").val($(this).val().replace(/^0/, '').replace(/[^0-9]+/g, ''))
})

$(".input_val-string-accept-whitespace").on('input', function (e) {
    e.preventDefault()
    e.stopPropagation()
    $(this).parent().siblings('.form__error').removeClass('active')
    $(this).removeClass("required__unset").val($(this).val().replace(/[^a-zA-Zа-яА-ЯйЙёЁґҐїЇъЪіІыЫєЄэЭ0-9_\s]+/g, ''))
})
//

$('select').on('input', function (e) {
    e.preventDefault()
    e.stopPropagation()
    let form = $(this).parents('form')
    $(this).removeClass("required__unset")
    form.find('.error').removeClass('active')
})

function defaultValidation(parent) {
    let err = false
    parent.find("input").each(function (index, element) {
        if (!(element.checkValidity() && element.value !== '')) {
            $(element).addClass("required__unset")
            err = true
        }
    })
    parent.find("select").each(function (index, element) {
        if (element.value === 'Select bank...'){
            $(element).addClass("required__unset")
            err = true
        }

    })
    return err
}

