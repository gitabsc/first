var Actualites = (function() {
	this.loadActus = function() {
		$('#load-more').on('click', function() {
			var ctime = $('.news-container .news-block:last').data('timestamp');

			$('.spinner i').css('display', 'block');

			$.ajax({
				url: 'ministere/load-more.twg',
				type: 'POST',
				data: {
					ctime: ctime,
					dir: Ministere.idParent
				},
				dataType: 'json',
				success: function(rs) {
					if (rs.success) {
						var content = '';
						var data = rs.data;

                		for (var i = 0; i < data.length; i++) {
                			var title = (data[i].title).length > 150 ? (data[i].title).slice(0, 150) : data[i].title;
							var img = data[i].logo != null ? data[i].logo : 'ministere/img/default-image.png';
                			let tmp = `<div class="col-md-6 news-block" data-timestamp="${data[i].ctime}">
                    					<a href="${data[i].link}">
                        					<div class="thumbs">
                            					<img src="${img}" class="img-responsive img-thumbnail" aria-label="${title}" alt="${title}">
                        					</div>
                        					<div class="text">
                                                <p>${title}</p>
                                            </div>
                    					</a>
                					</div>`;

                			if ((i + 1) % 2 == 0) {
                				tmp += `<div class="clear"></div>`;
                			}

                			content += tmp;
                		}

                		$('.spinner i').css('display', 'none');
                		$('.news-container').append(content);
					}
				},
				error: function(xhr) {

				}
			});

			return false;
		});
	};

	return {
		loadActus: loadActus
	};
}());

if (typeof Ministere != 'undefined') {
    Likia = $.extend(Ministere, Actualites);

    $.pageReady = function() {
    	Ministere.loadActus();
    }
}
