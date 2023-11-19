var Ministere = (function() {
    var __PDF_DOC = 0,
		__CURRENT_PAGE = 0,
		__TOTAL_PAGES = 0,
		__PAGE_RENDERING_IN_PROGRESS = 0,
		__CANVAS = {},
		__CANVAS_CTX = null;

    this.social = {
        youtube: {
            url: 'https://www.googleapis.com/youtube/v3/search',
            key: '',
            channelId: '',
            nextPageToken: null
        }
    };

    this.init = function() {
        Ministere.yearCopyright();
        Ministere.toggleSearchForm();
        Ministere.actionChangeFontSize();
        Ministere.printFooterVideoThumbs();
        Ministere.waypoint();

        $('.nav .dropdown-toggle').on('click', function(e) {
            if ($('body').width() >= 768) {
                location.href = $(this).attr('href');
            }
        });

        $('.nav .dropdown-submenu-toggle').on('click', function(e) {
            var element = $(this);

            setTimeout(function(){
                element.closest('li').toggleClass('open');
            }, 200);
            e.preventDefault();
            e.stopPropagation();
        });

        // afficher le loader au chargement des pages
        // if ($('.preloader').length) {
        //     $('.preloader').delay(200).fadeOut(500);
        // }

        if ($.pageReady) $.pageReady($);
    };

    this.yearCopyright = function() {
        var date = new Date();
        var yearCopy = date.getFullYear().toString();

        $('#yearCopyright').html(yearCopy);
    };

    this.toggleSearchForm = function() {
        $('.search-link').on('click', function() {
            $('.search-overlay').addClass('active');
            return false;
        });

        $('.close-btn').on('click', function() {
            $('.search-overlay').removeClass('active');
            return false;
        });
    };

    this.actionChangeFontSize = function() {
        $('.decreaseFontSize>a').on('click', function() {
            Ministere.toggleFontSize('down');
        });

        $('.increaseFontSize>a').on('click', function() {
            Ministere.toggleFontSize('up');
        });
    };

    this.toggleFontSize = function(direction) {
        var $container = $('.content-body');

        $container.find('*').each(function() {
            var k = parseInt($(this).css('font-size'));
            var newSize = 0;

            if (direction === 'down') {
                newSize = ((k*90)/100);
            } else {
                newSize = ((k*110)/100);
            }

            $(this).animate({ 'font-size': newSize });
        });
    }

    this.fetchYoutubeVideos = function(callback, maxResults = 3) {
        // if (Ministere.social.youtube.url != '' && Ministere.social.youtube.nextPageToken != null) {
        if (Ministere.social.youtube.url != '') {
            $.get(Ministere.social.youtube.url, {
                part: 'snippet',
                maxResults: maxResults,
                order: 'date',
                pageToken: Ministere.social.youtube.nextPageToken,
                key: Ministere.social.youtube.key,
                channelId: Ministere.social.youtube.channelId
            }, function(data) {
                if (callback) {
                    callback(data);
                }
            });
        }
    };

    this.printFooterVideoThumbs = function() {
        Ministere.fetchYoutubeVideos(function(data) {
            var content = '';

            $.each( data.items, function(i, item ) {
                const alt = item.snippet.title;
                const title = item.snippet.title;
                const src = item.snippet.thumbnails.default.url;
                const tmp = `<div class="video-thumbs"><div></div><img alt="${alt}" title="${title}" src="${src}" class="video" /></div>`;

                content += tmp;
            });

            $('#video-thumbs').append(content);
        });
    };

    this.waypoint = function() {
        new Waypoint({
            element: document.getElementById('menu'),
            handler: function(direction) {
                if (direction == 'down') {
                    $('#menu').addClass('fixed');
                } else if (direction == 'up') {
                    $('#menu').removeClass('fixed');
                }
            }
        });
    };

    this.showPage = function(page_no) {
		__PAGE_RENDERING_IN_PROGRESS = 1;
		__CURRENT_PAGE = page_no;

		__PDF_DOC
			.getPage(page_no)
			.then(function(page) {
				var scale_required = 1;
				var viewport = page.getViewport(scale_required);

				__CANVAS.height = viewport.height * scale_required;
				__CANVAS.width = viewport.width * scale_required;

				var renderContext = {
						canvasContext: __CANVAS_CTX,
						viewport: viewport
					};

				page
					.render(renderContext)
					.then(function() {
						__PAGE_RENDERING_IN_PROGRESS = 0;

						$('#pdf-next, #pdf-prev').removeAttr('disabled');
						$('#pdf-current-page').text(__CURRENT_PAGE);
					})
			})
	};

	this.showPDF = function(pdf_url) {
		PDFJS
			.getDocument({url: pdf_url})
			.then(function(pdf_doc) {
				__PDF_DOC = pdf_doc;
				__TOTAL_PAGES = __PDF_DOC.numPages;

				$('#pdf-current-page').text(__CURRENT_PAGE);
				$('#pdf-total-pages').text(__TOTAL_PAGES);

				showPage(1);
			})
			.catch(function(error) {
				console.log(error);
			});
	};

    this.initPDFViewer = function() {
        __CANVAS = $('#pdf-canvas').get(0),
		__CANVAS_CTX = __CANVAS.getContext('2d')

		$('#pdf-prev').on('click', function() {
			if (__CURRENT_PAGE != 1) {
				showPage(--__CURRENT_PAGE)
			}
		});

		$('#pdf-next').on('click', function() {
			if (__CURRENT_PAGE != __TOTAL_PAGES) {
				showPage(++__CURRENT_PAGE);
			}
		});

		showPDF(pdf_url);
    };

    return {
        init: init,
        social: social,
        waypoint: waypoint,
        yearCopyright: yearCopyright,
        toggleSearchForm: toggleSearchForm,
        actionChangeFontSize: actionChangeFontSize,
        toggleFontSize: toggleFontSize,
        fetchYoutubeVideos: fetchYoutubeVideos,
        printFooterVideoThumbs: printFooterVideoThumbs,
        initPDFViewer: initPDFViewer
    };
}());
