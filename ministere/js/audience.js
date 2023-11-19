var Audience = (function() {
    this.initForm = function() {
        var $form = $('#demande-audience');
        var regName = /^[\w\-\sàáâãäåçèéêëìíîïðòóôõöùúûüýÿ]+$/i;

        $.validator.addMethod('regex', function(value, element, regexp) {
            return this.optional(element) || regexp.test(value);
        }, 'Veuillez vérifier votre champ');

        var validator = $form.validate({
            rules: {
                attribution: {

                },
                lastname: {
                    required: true,
                    minlength: 2,
                    regex: regName
                },
                firstName: {
                    required: true,
                    minlength: 2,
                    regex: regName
                },
                phone: {
                    required: true,
                },
                email: {
                    required: true,
                    email: true
                },
                purpose: {
                    required: true,
                    minlength: 4
                }
            },
            errorElement: 'em',
            errorPlacement: function(error, element) {
                error.addClass( "help-block" );

                // Add `has-feedback` class to the parent div.form-group
                // in order to add icons to inputs
                element.parents( ".col-md-8" ).addClass( "has-feedback" );

                if ( element.prop( "type" ) === "checkbox" ) {
                    error.insertAfter( element.parent( "label" ) );
                } else {
                    error.insertAfter( element );
                }

                // Add the span element, if doesn't exists, and apply the icon classes to it.
                if ( !element.next( "span" )[ 0 ] ) {
                    $( "<span class='glyphicon glyphicon-remove form-control-feedback'></span>" ).insertAfter( element );
                }
            },
            success: function ( label, element ) {
                // Add the span element, if doesn't exists, and apply the icon classes to it.
                if ( !$( element ).next( "span" )[ 0 ] ) {
                    $( "<span class='glyphicon glyphicon-ok form-control-feedback'></span>" ).insertAfter( $( element ) );
                }
            },
            highlight: function ( element, errorClass, validClass ) {
                $( element ).parents( ".col-md-8" ).addClass( "has-error" ).removeClass( "has-success" );
                $( element ).next( "span" ).addClass( "glyphicon-remove" ).removeClass( "glyphicon-ok" );
            },
            unhighlight: function ( element, errorClass, validClass ) {
                $( element ).parents( ".col-md-8" ).addClass( "has-success" ).removeClass( "has-error" );
                $( element ).next( "span" ).addClass( "glyphicon-ok" ).removeClass( "glyphicon-remove" );
            },
            submitHandler: function(form) {
                $.ajax({
                    url: '/ministere/submit/demande-audience.twg',
                    type: 'POST',
                    data: $(form).serialize(),
                    dataType: 'json',
                    success: function(rs) {
                        if (rs.success) {
                            var dialog = bootbox.dialog({
                                message: rs.msg,
                                closeButton: true,
                            });

                            dialog.init(function() {
                                setTimeout(function() {
                                    $form[0].reset();
                                    validator.resetForm();
                                    $('span.glyphicon').remove();
                                    dialog.modal('hide');
                                }, 5000);
                            });
                        }
                    },
                    error: function(xhr) {}
                });
                return false;
            }
        });
    };

    return {
        initForm: initForm
    };
}());

if (typeof Ministere != 'undefined') {
    Likia = $.extend(Ministere, Audience);

    $.pageReady = function() {
         Ministere.initForm();
        console.log('--- audience');
    }
}
