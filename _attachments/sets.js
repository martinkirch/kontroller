/**
Copyright (c) 2012, Martin Kirchgessner

"THE BEER-WARE LICENSE" (Revision 42):
<martin@mkir.ch> wrote this file. As long as you retain this notice you
can do whatever you want with this stuff. If we meet some day, and you think
this stuff is worth it, you can buy me a beer in return.
*/

var Sets = {
	init: function() {
		Db.latestClips(20, function(docs) {
			if (docs.length == 0) {
				Sets.showEmptySet();
			} else {
				for (var i=0; i < docs.length; i++) {
					new Clip(docs[i]);
				};
			}
		})
	},
	
	showEmptySet: function() {
		$('#clips').empty();
		$("<li>").addClass('clip')
			.attr('id', 'emptyClip')
			.append('Drop audio clips here !')
			.appendTo($('#clips'));
	}
};

$('#newSet').click(function(e) {
	e.preventDefault();
	e.stopPropagation();
	Sets.showEmptySet();
});