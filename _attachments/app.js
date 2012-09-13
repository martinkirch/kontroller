$(document).ready(function() {
	var parent = $('#players');
	new Player(parent, 'loops/calgoneNimp.wav', true);
	new Player(parent, 'jingles/batterie.wav');
	new Player(parent, 'jingles/coucou.wav');
	
	
	
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
				// TODO use dt.files[i] slice() , .name , .size
			}
		}
		
	});
});