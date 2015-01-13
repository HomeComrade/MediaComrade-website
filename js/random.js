$(document).on('change', '.random-show-checkbox', function() {
	showTitle = $(this).val();
	
	try {
		randomSelectedShows = $.parseJSON($.cookie(COOKIE_NAMES.randomSelectedShows));
	}
	catch (error) {
		randomSelectedShows = [];
	}
	
	if (this.checked) {
		if (-1 == $.inArray(showTitle, randomSelectedShows)) {
			randomSelectedShows.push(showTitle);
		}
	}
	else {
		if (-1 != $.inArray(showTitle, randomSelectedShows)) {
			for (i = 0; i < randomSelectedShows.length; i++) {
				if (randomSelectedShows[i] == showTitle) {
					randomSelectedShows.splice(i, 1);
				}
			}
		}
	}
	
	$.cookie(COOKIE_NAMES.randomSelectedShows, JSON.stringify(randomSelectedShows), { expires: 1000 });
});