var Home = (function(){
    this.toggleService = function() {
        $('.toggle-services').on('click', function(e) {
            var $elem = $(this).children('i');

            if ($elem.hasClass('fa-angle-double-down')) {
                $elem.removeClass('fa-angle-double-down').addClass('fa-angle-double-up');
                $('.services-container .hidden').removeClass('hidden').addClass('show');
            } else {
                $elem.removeClass('fa-angle-double-up').addClass('fa-angle-double-down');
                $('.services-container .show').removeClass('show').addClass('hidden');
            }

            return false;
        });
    };

    return {
        toggleService: toggleService
    };
}());

if (typeof Ministere != 'undefined') {
    Likia = $.extend(Ministere, Home);

    $.pageReady = function() {
        Ministere.toggleService();
    }
}
