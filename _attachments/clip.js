/**
Copyright (c) 2012, Martin Kirchgessner

"THE BEER-WARE LICENSE" (Revision 42):
<martin@mkir.ch> wrote this file. As long as you retain this notice you
can do whatever you want with this stuff. If we meet some day, and you think
this stuff is worth it, you can buy me a beer in return.
*/

/**
 * Class tied to a clip button (the big squares)
 * Instanciating a new one will create the button and the AUDIO (hidden) tag
 *
 * Drag'n'drop callbacks follow
 * append it in the parent element.
 * @param the corresponding CouchDB document
 */
function Clip(doc) {
	this.id = 'clip' + Clip.clipsCount++;
	this.doc = doc;
	var src = $.db.uri + this.doc._id + '/' + this.doc.title
	
	var container = $('<li>')
		.addClass('clip')
		.attr({id:this.id, draggable:'true'});
	
	var label = $('<p>')
		.text(this.doc.title)
		.appendTo(container);
	
	var loopBtn = $('<span>')
		.addClass('btnLoop')
		.text('⟳') // aka UTF8's CLOCKWISE GAPPED CIRCLE ARROW FTW
		.appendTo(container);
	
	var player = $('<audio>')
		.attr({src:src, preload:'auto'})
		.appendTo(container);
		
	// PLAY/PAUSE
	container.click(function(e) {
		e.preventDefault();
		var audioElem = player[0];
		
		if (audioElem.currentTime == 0 || audioElem.ended) {
			audioElem.play();
			container.addClass('playing');
		} else {
			audioElem.pause();
			audioElem.currentTime = 0;
			player.trigger('ended');
		}
	});
	
	// End Of Playin' callback
	player.bind('ended', function(e) {
		container.removeClass('playing');	
	});
	
	var looping = false;
	
	// Loop toggler
	loopBtn.click(function(e) {
		e.stopPropagation();
		
		if (looping) {
			container.removeClass('looping');
			player.removeAttr('loop');
		} else {
			container.addClass('looping');
			player.attr('loop','loop');
		}
		
		looping = !self.looping;
	});
	
	if (this.doc.loop)
		loopBtn.click();
	
	if (Clip.clipsCount == 1) {
		$('#emptyClip').remove();
	}
	
	container.data('object', this);
	container.appendTo($('#clips'));
}

Clip.clipsCount = 0;

// Drag and drop to re-order clips
$(document).on('dragstart', '.clip', function(e) {
	var data = e.originalEvent.dataTransfer;
	var container = $(e.target).data('object');
	
	data.setData('application/x-id', container.id);
	data.effectAllowed = "move";
	data.dropEffect = "move";
	
}).on('dragenter', '.clip', function(e) {
	var dt = e.originalEvent.dataTransfer;
	
	if (dt.types.contains('application/x-id') || dt.types.contains('Files') || dt.files != null) {
		$(this).addClass('draggedOver');
		e.stopPropagation();
		e.preventDefault();
	}
	
}).on('dragover', '.clip', function(e) {
	var dt = e.originalEvent.dataTransfer;

	if (dt.types.contains('application/x-id') || dt.types.contains('Files') || dt.files != null) {
		e.stopPropagation();
		e.preventDefault();
	}
	
}).on('dragleave', '.clip', function(e) {
	$(this).removeClass('draggedOver');
			
}).on('drop', '.clip', function(e) {	
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