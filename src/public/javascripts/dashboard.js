let banks;
let banks_cards=[];

//
// AJAX HELPERS
//

function getAll() {
    $.ajax({
        url: '/api/banks/userid/' + Cookies.get('id'),
        type: "GET",
        processData: false, //!!!
        contentType: false, //!!!
        success: (res) => {
            banks = res
            parseAll()
        },
        error: (err) => {
            err
        }
    })
}

function addBank(url, data) {
    return $.ajax({
        url: url,
        type: "POST",
        processData: false,
        contentType: false,
        data: data,
        success: (res) => {
            banks.push(res)
            parse(res)
        },
        error: (err) => {
            setError($('.error__wrapper'), err.responseJSON.err)
        }
    })
}

function bankAction(method, data) {
    return $.ajax({
        url: '/dashboard',
        type: method,
        async: true,
        data: data
    })
}


//
// BANK PROTOTYPE (custom attributes [isMutated, inRedactMode], helper function) TODO!!! можна було зробити набагато кращу декомпозицію та НОРМАЛЬНИЙ ES6 class..
//

function Bank(bank) {
    let parent = $(`
            <div class="list__bank bank">
                    <div class="bank__controls">
                        <div class="loading hide"><img src="../images/dashboard/loading.gif" alt="#"></div>
                        <div class="controls__redact">
                            <img src="../images/dashboard/svg/redact.svg" alt="#">
                            <img src="../images/dashboard/svg/done.svg" class="hide" alt="#">
                        </div>
                        <div class="controls__download">
                            <img src="../images/dashboard/svg/download.svg" alt="#">
                        </div>
                        <div class="controls__delete">
                            <img src="../images/dashboard/svg/delete.svg" alt="#">
                        </div>
                    </div>
                    <div class="bank__info-field">
                        <input autocomplete="off" type="text" name="bankName" class="bank__input input_val-string-accept-whitespace required" value="${bank.bankName}" disabled>
                    </div>
                    <div class="bank__info-field">
                        <span class="info-field__title">Interest rate (%):</span>
                        <input autocomplete="off" type="text" name="bankInterest" class="bank__input input_val-numeric required" value="${bank.bankInterest}" disabled>
                    </div>
                    <div class="bank__info-field">
                        <span class="info-field__title">Down payment (%):</span>
                        <input autocomplete="off" type="text" name="bankMDP" class="bank__input input_val-numeric required" value="${bank.bankMDP}" disabled>
                    </div>
                    <div class="bank__info-field">
                        <span class="info-field__title">Max loan:</span>
                        <input autocomplete="off" type="text" name="bankMaxLoan" class="bank__input input_val-numeric required" value="${bank.bankMaxLoan}" disabled>
                    </div>
                    <div class="bank__info-field">
                        <span class="info-field__title">Loan term (month):</span>
                        <input autocomplete="off" type="text" name="bankLoanTerm" class="bank__input input_val-numeric required" value="${bank.bankLoanTerm}" disabled>
                    </div>
                </div>
        `)

    Object.defineProperty(parent, "inRedactMode", {
        value: 0,
        writable: true,
    })
    Object.defineProperty(parent, "isMutated", {
        value: 0,
        writable: true,
    })

    let binded_parent = bindBank(parent)
    banks_cards.push(binded_parent)
    return binded_parent
}

// примітка: функція створена у зв'язку з тим, що злітають бінди під час сортування jQuery instance елементів TODO!!! fixable??

function bindBank(parent){
    parent
        .find('.input_val-numeric-zero-prevent')
        .on('input', function (e) {
            e.preventDefault()
            e.stopPropagation()
            $(this).parent().siblings('.form__error').removeClass('active')
            $(this).removeClass("required__unset").val($(this).val().replace(/^0/, '').replace(/[^0-9]+/g, ''))
        })

    parent
        .find('.input_val-string-accept-whitespace')
        .on('input', function (e) {
            e.preventDefault()
            e.stopPropagation()
            $(this).removeClass("required__unset").val($(this).val().replace(/[^a-zA-Zа-яА-ЯйЙёЁґҐїЇъЪіІыЫєЄэЭ0-9_\s]+/g, ''))
        })

    parent
        .find('input')
        .on('input', function (e) {
            e.preventDefault()
            e.stopPropagation()
            parent.isMutated = 1
        })

    parent
        .find('.controls__redact')
        .on('click', function (e) {
            e.preventDefault()
            e.stopPropagation()
            let inp = $(this)
            if (parent.isMutated && parent.inRedactMode) {
                parent.find('.loading').removeClass('hide')
                let err = defaultValidation(parent)
                if (err) {
                    setError(err)
                    return
                }
                let bank = banks[parent.index()]
                let data = {
                    Users_id: bank.Users_id,
                    id: bank.id
                }
                parent
                    .find('input')
                    .each(function (index, element) {
                        data[$(element).attr("name")] = $(element).val()
                    })
                let action = bankAction("PUT", data)
                action
                    .done(function (res) {
                        parent.inRedactMode = 0
                        parent.isMutated = 0
                        banks[parent.index()] = data
                        banks_cards[parent.index()] = parent
                        parent.find('input').attr("disabled", true)
                        parent.removeClass('collapsed')
                        inp.find('img').toggleClass('hide')
                        parent.find('.loading').addClass('hide')

                    })
                    .fail(function (err) {
                        parent.inRedactMode = 0
                        parent.isMutated = 0
                        parent.find('input').attr("disabled", true)
                        parent.removeClass('collapsed')
                        inp.find('img').toggleClass('hide')
                        parent.find('.loading').addClass('hide')

                    })
                return
            }
            if (!parent.isMutated && parent.inRedactMode) {
                parent
                    .find('input')
                    .attr("disabled", true)
                parent.inRedactMode = 0
                parent.removeClass('collapsed')
                inp.find('img').toggleClass('hide')
                return;
            }
            parent.find('input').removeAttr('disabled')
            inp.find('img').toggleClass('hide')
            parent.inRedactMode = 1
            parent.addClass('collapsed')
        })

    parent
        .find('.controls__download')
        .on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            downloadFile(banks[parent.index()])
        })

    parent
        .find('.controls__delete')
        .on('click', function (e) {
            e.preventDefault()
            e.stopPropagation()
            let index = parent.index()
            let bank = banks[index]
            let data = {
                id: bank.id,
                Users_id: bank.Users_id
            }
            parent.find('.loading').removeClass('hide')
            let action = bankAction('DELETE', data)
            action
                .done(function (res) {
                    banks.splice(index, 1)
                    banks_cards.splice(index, 1)
                    parent.hide(300).queue(function (nxt) {
                        $(this).remove()
                        nxt();
                    });
                    parent.find('.loading').addClass('hide')
                })
                .fail(function (err) {
                    console.log(err.responseJSON.err)
                    parent.find('.loading').addClass('hide')
                })

        })
    return parent
}

function parseAll() {
    for (let i = 0; i < banks.length; i++) {
        parse(banks[i])
    }
    updateCalculator()
}

function parse(bank) {
    let parent = new Bank(bank)
    $(".banks__list").append(parent)
}

//
// SORTING FEATURE (main logic, helper function) TODO!!! NOT TESTED PROPERLY!!! бож прийшлось багато переписати..
//

function reParse() {
    let active_sort = $('.sort__category.active')
    let criteria = `input[name="${active_sort.attr('data-sort-type')}"]`
    let isReversed = $('.sort__order').hasClass('reversed')
    let temp = [...banks_cards]
    $('.banks__list').empty()
    if (isReversed){
        temp.sort((b, a) => {
            return parseInt(a.find(criteria).val()) - parseInt(b.find(criteria).val())
        })
    }else {
        temp.sort((a, b) => {
            return parseInt(a.find(criteria).val()) - parseInt(b.find(criteria).val())
        })
    }
    temp.forEach(function (element, _) {
        $('.banks__list').append(bindBank($(element)))
    })
}

$('.sort__category').on('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    if ($(this).hasClass('active')){
        $(this).removeClass('active')
        banks_cards.forEach(function (element, _) {
            $('.banks__list').append($(element))
        })
        return
    }
    $(this).siblings('.sort__category').removeClass('active')
    $(this).addClass('active')
    reParse()
})

$('.sort__order').on('click', function (e) {
    e.preventDefault()
    e.stopPropagation()
    $(this).toggleClass('reversed')
    reParse()
})

//
// ADDING A BANK FROM FILE FEATURE (event routing: [.button_type--upload] ALWAYS refers to [.sendfile], main logic)
//

$('.sendfile')
    .find('input')
    .on('click', function (e) {

    })
    .on('change', function (e) {
        let formdata = new FormData($(this).parent()[0])
        $('.controls__add').find('.loading').addClass('is_loading')
        let action = addBank('/dashboard/fromfile', formdata)
        action
            .done(function () {
                $('.controls__add').find('.loading').removeClass('is_loading')
            })
            .fail(function (err) {
                $('.controls__add').find('.loading').removeClass('is_loading')
                setError($('.error__wrapper'), err.responseJSON.err)
            })
    })

$('.button_type--upload').on('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    $('.sendfile').css('pointer-events', 'all').find('input').trigger('click')
})

//
// ERROR INDICATION (Sets an error)
//

function setError(parent, err) {
    parent.children('.error').text(err).addClass('active')
    if (parent.hasClass('error__wrapper')){
        let timer = setTimeout(() => {
            parent.children('.error').removeClass('active')
            clearTimeout(timer)
        }, 5000)
    }
}

//
// ADDING A BANK (event routing: [.button_type--add] ALWAYS refers to [.addbank] form, main logic)
//

$('.addbank')
    .find('.form__button')
    .on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        let parent = $(this).parents('.addbank')
        let err = defaultValidation(parent)
        if (err) {
            setError(parent, "Please, fill all required inputs!")
            return
        }
        let formdata = new FormData(parent[0])
        parent.find('.loading').addClass('is_loading')
        let action = addBank('/dashboard', formdata)
        action
            .done(function () {
                parent.find('input').val('')
                parent.removeClass('active')
                parent.find('.loading').removeClass('is_loading')
                $('.wrapper').removeClass('hide')

            })
            .fail(function (err) {
                setError(parent, err.responseJSON.err)
                parent.find('.loading').removeClass('is_loading')
            })
    })

$('.addbank')
    .find('.close')
    .on('click', function (e) {
        e.preventDefault()
        e.stopPropagation()
        $(this).parent().find('input').val('')
        $(this).parent().removeClass('active')
        $('.wrapper').removeClass('hide')
    })

$('.button_type--add').on('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    $('.addbank').addClass('active')
    $('.wrapper').addClass('hide')
})

//
// DOWNLOAD BANK AS FILE FEATURE (main logic, simple HASH FUNCTION which uses Remembered Random Numbers as salt/pepper)
//

function downloadFile(bank) {
    let data = {
        bankName: bank.bankName,
        bankInterest: bank.bankInterest,
        bankMDP: bank.bankMDP,
        bankMaxLoan: bank.bankMaxLoan,
        bankLoanTerm: bank.bankLoanTerm,
    }
    const blob = new Blob([shuffle(JSON.stringify(data, null))], {type: 'text/plain'});
    if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, filename);
    } else {
        const elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob);
        elem.download = 'bank_template.bsaf'
        document.body.appendChild(elem);
        elem.click();
        document.body.removeChild(elem);
    }
}

function shuffle(str) {
    let a = str.split(""),
        n = a.length,
        ra = [];
    for (let i = 0; i < n; i++) {
        let rand = Math.random()
        let j = Math.floor(rand * (i + 1));
        let tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
        ra.push(rand)
    }
    return JSON.stringify(ra) + '№%@&$' + a.join("");
}

//
// SEARCH FEATURE (main logic)
//

$('.search__input').on('input', function (e) {
    e.preventDefault()
    e.stopPropagation()
    let banks = $('.bank')
    banks.css('display', 'flex')
    let RegExpr = new RegExp($(this).val(), 'i')
    banks.each(function (index, element) {
        if (!(RegExpr.test($(element).find('input[name="bankName"]').val()))){
            $(element).css('display', 'none')
        }
    })
})

//
// CALCULATOR (helper functions, main event, etc.)
//

$('form.calculator .form__button')
    .on('click', function (e) {
        e.preventDefault()
        e.stopPropagation()
        let parent = $(this).parent()
        let err = defaultValidation(parent)
        if (err) {
            setError(parent, "Please, fill all required inputs!")
            return
        }
        let formdata = new FormData(parent[0])
        let userLoan = formdata.get('userLoan')
        let userDP = formdata.get('userDP')
        let bank = banks[formdata.get('bank')]
        let calculated = calculateMortgage(parseInt(userLoan), parseInt(userDP), bank)
        if (typeof calculated === 'string') {
            setError(parent, calculated)
            return;
        }
        parent.find('.form__result').text(calculated)
    })

function calculateMortgage(userLoan, userDP, bank) {
    let bankInterest = parseInt(bank.bankInterest)
    let bankLoanTerm = parseInt(bank.bankLoanTerm)
    let bankMDP = parseInt(bank.bankMDP)
    if (userDP > userLoan) {
        return "User down payment can't be bigger than loan!"
    }
    if (userLoan > parseInt(bank.bankMaxLoan)) {
        return "User loan can't be bigger than bank's max loan!"
    }
    if (userDP < userLoan*(bankMDP / 100)) {
        return "User DP can't be smaller than bank's minimum DP!"
    }
    return ((userLoan - userDP) * (bankInterest/12) * (1 + bankInterest/12) ** bankLoanTerm) / // Якось забагато виходить, хоча провірив разів 10...
        ((1 + bankInterest/12) ** bankLoanTerm - 1)
}

function updateCalculator() {
    $('form.calculator select .option__bank').remove()
    for (let i = 0; i < banks.length; i++) {
        let bank = banks[i]
        $('form.calculator select').append(`
            <option class="option__bank" value="${i}">${bank.bankName}</option>
        `)
    }
}

//
// LOGOUT (main logic)
//

$('.logout').on('click', function (e) {
    Cookies.remove('id')
    Cookies.remove('userName')
})

//
// HELPERS (check hash, window events)
//

function checkHashState() {
    switch (window.location.hash) {
        case "#banks":
            $('.banks').css('display', 'flex')
            $('.calculator').css('display', 'none')

            break;

        case "#calculator":
            $('.banks').css('display', 'none')
            $('.calculator').css('display', 'flex')

            break;

        default:
            window.location.hash = "#banks"
            break;
    }
}

$(window).on('load', function (e) {
    e.preventDefault()
    e.stopPropagation()
    checkHashState()
    getAll()
    $("body").delay(500).animate({opacity: 1}, 500, "swing", () => {
        $("body").addClass('shown').removeAttr('style')
    })

})

$(window).on('hashchange', function (e) {
    e.preventDefault()
    e.stopPropagation()
    checkHashState()
    updateCalculator()
})
