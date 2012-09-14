/**
Copyright (c) 2012, Martin Kirchgessner

"THE BEER-WARE LICENSE" (Revision 42):
<martin@mkir.ch> wrote this file. As long as you retain this notice you
can do whatever you want with this stuff. If we meet some day, and you think
this stuff is worth it, you can buy me a beer in return.
*/

$(document).ready(function() {
	// Put your own DB name here
	$.db = $.couch.db("kontroller");
	
	// Drag and drop to re-order players
	$(document).on('dragstart', '.player', function(e) {
		var data = e.originalEvent.dataTransfer;
		var container = $(e.target).data('object');
		
		data.setData('application/x-id', container.id);
		data.effectAllowed = "move";
		data.dropEffect = "move";
		
	}).on('dragenter', '.player', function(e) {
		var dt = e.originalEvent.dataTransfer;
		
		if (dt.types.contains('application/x-id') || dt.types.contains('Files') || dt.files != null) {
			$(this).addClass('draggedOver');
			e.stopPropagation();
			e.preventDefault();
		}
		
	}).on('dragover', '.player', function(e) {
		var dt = e.originalEvent.dataTransfer;

		if (dt.types.contains('application/x-id') || dt.types.contains('Files') || dt.files != null) {
			e.stopPropagation();
			e.preventDefault();
		}
		
	}).on('dragleave', '.player', function(e) {
		$(this).removeClass('draggedOver');
				
	}).on('drop', '.player', function(e) {	
		e.stopPropagation();
		e.preventDefault();
		$(this).removeClass('draggedOver');
		
		var dt = e.originalEvent.dataTransfer;
		
		if (dt.types.contains('application/x-id')) {
			var sourceId = '#' + dt.getData('application/x-id');

			if ($(this).next('li').length == 0) {
				$(sourceId).detach().insertAfter($(this));
			} else {
				$(sourceId).detach().insertBefore($(this));
			}
		} else if (dt.files && dt.files.length > 0) { // doesn't work locally !
			for (var i=0; i < dt.files.length; i++) {
				Db.addClipToSet(dt.files[i])
			}
		}
		
	});
});