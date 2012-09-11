$(document).ready(function() {
	var parent = $('#players');
	var player1 = new Player(parent[0], 'loops/calgoneNimp.wav', true);
	var player1 = new Player(parent[0], 'jingles/batterie.wav');
	var player2 = new Player(parent[0], 'jingles/coucou.wav');
	
	
	
	// Drag and drop to re-order players
	$('.player').attr({draggable:'true'}).on('dragstart', function(e) {
		var data = e.originalEvent.dataTransfer;
		var container = $(e.target).data('object');
		
		data.setData('application/x-id', container.id);
		data.effectAllowed = "move";
		data.dropEffect = "move";
		// TODO : see e.dataTransfer.files and http://jsfiddle.net/9C2EF/
		
	}).on('dragenter', function(e) {
		if (e.originalEvent.dataTransfer.types.contains('application/x-id')) {
			$(this).addClass('draggedOver');
			e.preventDefault();
		}
		
	}).on('dragover', function(e) {
		if (e.originalEvent.dataTransfer.types.contains('application/x-id')) {
			e.preventDefault();
		}
		
	}).on('dragleave', function(e) {
		$(this).removeClass('draggedOver');
				
	}).on('drop', function(e) {
		$(this).removeClass('draggedOver');
		
		var sourceId = '#' + e.originalEvent.dataTransfer.getData('application/x-id');
		
		if ($(this).next('li').length == 0) {
			$(sourceId).detach().insertAfter($(this));
		} else {
			$(sourceId).detach().insertBefore($(this));
		}
	});
});