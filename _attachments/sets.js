/**
Copyright (c) 2012, Martin Kirchgessner

"THE BEER-WARE LICENSE" (Revision 42):
<martin@mkir.ch> wrote this file. As long as you retain this notice you
can do whatever you want with this stuff. If we meet some day, and you think
this stuff is worth it, you can buy me a beer in return.
*/

var Sets = {
	current: {},
	
	init: function() {
		Db.latestClips(20, function(docs) {
			if (docs.length == 0) {
				Sets.showEmptySet();
			} else {
				for (var i=0; i < docs.length; i++) {
					new Clip(docs[i]);
				};
			}
		});
		
		var selector = $('#setSelector');
		
		Db.getSetsList(function(sets) {
			for (var i=0; i < sets.length; i++) {
				selector.append(
					$('<option>').attr('value', sets[i].id).text(sets[i].key)
				);
			};
		});
	},
	
	showEmpty: function() {
		$('#clips').empty();
		Sets.current = {};
		$("<li>").addClass('clip')
			.attr('id', 'emptyClip')
			.append('Drop audio clips here !')
			.appendTo($('#clips'));
	},
	
	saveCurrent: function() {
		if (!Sets.current.title) {
			Sets.current.title = prompt("Please give a name to this set.");
			Sets.current.type = 'set';
		}
		
		var clipIds = [];
		$('#clips').children('li').each(function(i, elem) {
			clipIds.push(elem.id);
		});
		Sets.current.clips = clipIds;
		
		Db.update(Sets.current);
	}
};

$('#newSet').click(function(e) {
	e.preventDefault();
	e.stopPropagation();
	Sets.showEmpty();
});

$('#saveSet').click(function(e) {
	e.preventDefault();
	e.stopPropagation();
	Sets.saveCurrent();
})