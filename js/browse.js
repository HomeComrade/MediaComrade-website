var _selectedFiles = [];

$(document).on('change', '.entry-checkbox', function() {
	file = $.cookie(COOKIE_NAMES.browseDir)+'/'+$(this).val();
	
	if (this.checked) {
		if (-1 == $.inArray(file, _selectedFiles)) {
			_selectedFiles.push(file);
		}
	}
	else {
		if (-1 != $.inArray(file, _selectedFiles)) {
			for (i = 0; i < _selectedFiles.length; i++) {
				if (_selectedFiles[i] == file) {
					_selectedFiles.splice(i, 1);
				}
			}
		}
	}
	
	setButtonVisibility();
});

function loadCurrentDirectory() {
	//$('#sorted-list').empty();//clear the html
	
	rawDirList = $.parseJSON(localStorage.getItem('dirList'));
	
	dirList = [];
	playableFileList = [];
	notPlayableFileList = [];
	
	$.each(rawDirList, function(i, item) {
		if ('file' == item.type) {
			if (true == item.isPlayable) {
				playableFileList.push(item);
			}
			else {
				notPlayableFileList.push(item);
			}
		}
		else if ('dir' == item.type) {
			dirList.push(item);
		}
	});
	
	dirList.sort(alphabetize);
	playableFileList.sort(alphabetize);
	notPlayableFileList.sort(alphabetize);
	
	browseDir = $.cookie(COOKIE_NAMES.browseDir)
	
	$('#browse-dir').html(browseDir);
	
	html = '';
	alphabetList = [];
	
	if ('/' != browseDir) {
		html += '<a href="#" class="command left" command-id="browse" data-icon="back" data-role="button" browse-dir="..">&lt;back&gt;</a>';
	}
	
	$.each(dirList, function(i, item) {
		html += '<a href="#" data-role="button" class="command left" command-id="browse" data-icon="plus" browse-dir="'+item.name+'">'+item.name+'</a>';
	});
	
	$.each(playableFileList, function(i, item) {
		html += '<label>'+item.name+'<input class="entry-checkbox" type="checkbox" id="'+i+'" value="'+item.name+'" /></label>';
	});
	
	$.each(notPlayableFileList, function(i, item) {
		html += '	<a class="left ui-disabled" data-role="button" data-icon="forbidden">'+item.name+'</a>';
	});
	
	$('#sorted-list').html(html);
	_selectedFiles = [];
	
	$('#sorted-list').trigger('create');
	setButtonVisibility();
	
	window.scrollTo(0, 0);
}

function setButtonVisibility() {
	if (_selectedFiles.length > 0) {
		_selectedFiles.sort();
		
		$('#play-button').prop('disabled', false);
		$('#enqueue-button').prop('disabled', false);
		$('#insert-at-button').prop('disabled', false);
	}
	else {
		$('#play-button').prop('disabled', true);
		$('#enqueue-button').prop('disabled', true);
		$('#insert-at-button').prop('disabled', true);
	}
}

function alphabetize(a, b) {
	if (a.name < b.name) {
		return -1;
	}
	if (a.name > b.name) {
		return 1;
	}
	
	return 0;
}
