var _selectedRandomShows = [];

$(document).on('change', '.show-checkbox', function() {
	show = $(this).val();
	
	if (this.checked) {
		if (-1 == $.inArray(show, _selectedRandomShows)) {
			_selectedRandomShows.push(show);
		}
	}
	else {
		if (-1 != $.inArray(show, _selectedRandomShows)) {
			for (i = 0; i < _selectedRandomShows.length; i++) {
				if (_selectedRandomShows[i] == show) {
					_selectedRandomShows.splice(i, 1);
				}
			}
		}
	}
	
	_selectedRandomShows.sort();
});
