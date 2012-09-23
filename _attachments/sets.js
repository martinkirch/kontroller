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
		Sets.showLatestClips();
		
		var selector = $('#setSelector');
		
		Db.getSetsList(function(sets) {
			for (var i=0; i < sets.length; i++) {
				selector.append(
					$('<option>').attr('value', sets[i].id).text(sets[i].key)
				);
			};
		});
	},
	
	showLatestClips : function() {
		$('#clips').empty();
		Sets.current = {};

		Db.latestClips(20, function(docs) {
			if (docs.length == 0) {
				Sets.showEmptySet();
			} else {
				for (var i=0; i < docs.length; i++) {
					new Clip(docs[i]);
				};
			}
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
		
		Db.update(Sets.current, function(doc) {
			$('#setSelector').append(
				$('<option>').attr('value', doc._id).text(doc.title)
			).val(doc._id);
		});
	},
	
	load: function(id) {
		Db.get(id, function(doc) {
			Sets.current = doc;
		});
		
		Db.listClipsBySet(id, function(docs) {
			$('#clips').empty();
			for (var i=0; i < docs.length; i++) {
				new Clip(docs[i]);
			};
		});
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
});

$('#deleteSet').click(function(e) {
	e.preventDefault();
	e.stopPropagation();
	
	if (!Sets.current._id) {
		$(this).text('Not saved !');
		var btn = this;
		setTimeout(function() { $(btn).text('Delete') }, 3000);
	} else if ($(this).text().trim() == 'Delete') {
		$(this).text('Sure ?');
		var btn = this;
		setTimeout(function() { $(btn).text('Delete') }, 3000);
	} else if (Sets.current._id) {
		Db.delete(Sets.current, function() {
			var deleted = $('#setSelector').children(':selected');
			$('#setSelector').val(-1);
			deleted.remove();
			Sets.showLatestClips();
		});
	}
});

$('#setSelector').change(function(e) {
	var selectedId = $(this).val();
	if (selectedId == -1) {
		Sets.showEmpty();
	} else {
		Sets.load(selectedId);
	}
});