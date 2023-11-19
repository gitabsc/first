var Contact = (function() {
    this.initForm = function() {
        var $form = $('#contact-us');
        var regName = /^[\w\-\sàáâãäåçèéêëìíîïðòóôõöùúûüýÿ]+$/i;

        $.validator.addMethod('regex', function(value, element, regexp) {
            return this.optional(element) || regexp.test(value);
        }, 'Veuillez vérifier votre champ');

        var validator = $form.validate({
            rules: {
                name: {
                    required: true,
                    minlength: 2,
                    regex: regName
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
                element.parents( ".col-md-8" ).addClass( "has-feedback" );

                if ( element.prop( "type" ) === "checkbox" ) {
                    error.insertAfter( element.parent( "label" ) );
                } else {
                    error.insertAfter( element );
                }
                if ( !element.next( "span" )[ 0 ] ) {
                    $( "<span class='glyphicon glyphicon-remove form-control-feedback'></span>" ).insertAfter( element );
                }
            },
            success: function ( label, element ) {
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
                    url: '/submit/contact.twg',
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

    this.initMap = function() {
        var latitude = coords.lat;
        var longitude = coords.lng;
        var map = L.map('map', {
            scrollWheelZoom: false
        }).setView([latitude, longitude], 14);

        L.marker([latitude, longitude]).addTo(map);

        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://www.aninf.ga">Aninf</a>'
        }).addTo(map);
    };

    return {
        initForm: initForm,
        initMap: initMap
    };
}());

if (typeof Ministere != 'undefined') {
    Likia = $.extend(Ministere, Contact);

    $.pageReady = function() {
        Ministere.initForm();
        Ministere.initMap();
    }
}
