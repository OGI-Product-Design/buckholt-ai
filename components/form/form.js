// Input clear button ____________________________________________________________
$( document ).ready(function() {
    var fadeTime = 150;

    // If no value, hide clear button
    $('.input').each(function(){
        if($(this).find('.input-clear').length !== 0 && !$(this).find('input').val()){
            $(this).find('.input-clear').css('display', 'none');
        }
    });

    // Show clear button when input has value 
    $('.input').on('input', function() {
        if($(this).find('input').val() ){
            $(this).find('.input-clear').fadeIn(fadeTime).css('display', '');
        } else {
            $(this).find('.input-clear').fadeOut(fadeTime);
        }
    });

    // Clear input with clear button
    $('.input-clear').click(function() {
        $(this).parent().find('input').val('');
        $(this).hide();
    });
});



// Checkbox states _______________________________________________________________
$(document).ready(function() {
    $('.indeterminate').prop('indeterminate', true);
    $(document).on('click', 'input.indeterminate', function () {
        $(this)
        .prop('indeterminate', false) // removes the visual indeterminate state
        .removeClass('indeterminate'); // removes the class
    });

    $('input[type="checkbox"].selected').prop('checked', true);
    $('input[type="checkbox"].selected').on('click', function () {
        $(this).removeClass('selected');
    });

    $('.state_disabled').find('.form-check-input').prop("disabled", true);
    $('.state_readonly').find('.form-check-input').prop("readonly", true);
    $('.state_error').find('.form-check-input').addClass("is-invalid", true);

    $(document).on('click', '.form-check-input[readonly]', function (e) {
        e.preventDefault();
    });

    // Checkbox input disabled
    $('.input:has(.check-input)').each(function () {
        const $inputs = $(this).find('input[type="checkbox"], input[type="radio"]');
        const allDisabled = $inputs.length && $inputs.filter(':not(:disabled)').length === 0;

        if (allDisabled) {
            $(this).addClass('disabled');
        }
    });
});



// Text area character count __________________________________________________________
$(document).ready(function() {
    $('textarea').keyup(function() {
        var count = $(this).val().length,
            maxlength = $(this).attr('maxlength'),
            range = maxlength - 10;

        $(this).parent('.response').find('.counting').text(count);

        if(count >= range && count <= maxlength) {
            $(this).parent('.response').find('.counter').addClass('counter-warning');
        } else if (count < range) {
            $(this).parent('.response').find('.counter').removeClass('counter-warning');
        }
    });
    
});


// Number input step buttons _____________________________________________________
$('.step-btn').off('click').on('click', function () {

    if(!$(this).parent().find('input').val()) {
        $(this).parent().find('input').val('0');
    }

    if ($(this).hasClass('step-add')) {
        var addValue = parseInt($(this).parent().find('input').val()) + 1;
        $(this).parent().find('input').val(addValue).trigger('change');
    }

    if ($(this).hasClass('step-minus')) {
        var removeValue = parseInt($(this).parent().find('input').val()) - 1;

        // if( removeValue == 0 ) {
        //     removeValue = 1;
        // }
        $(this).parent().find('input').val(removeValue).trigger('change');
    }

});

// $('.quantity input').off('change').on('change', function() {
//     console.log($(this).val());
// });