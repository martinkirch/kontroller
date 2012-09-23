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
	var self = this;
	this.doc = doc;
	
	for (var filename in doc._attachments) // there should be only one here
		this.src = Db.uri + this.doc._id + '/' + filename
	
	this.container = $('<li>')
		.addClass('clip')
		.attr({id:this.doc._id, draggable:'true'})
		.click(function(e){e.stopPropagation(); e.preventDefault(); self.togglePlayback() })
		.on('ended', function(e) {
			$(this).removeClass('playing');
		})
		.data('object', this);
	
	this.label = $('<p>')
		.text(this.doc.title)
		.appendTo(this.container);
	
	this.loopBtn = $('<span>')
		.addClass('btnLoop button')
		.text('⟳') // aka UTF8's CLOCKWISE GAPPED CIRCLE ARROW FTW
		.click(function(e){e.stopPropagation(); e.preventDefault(); self.toggleLoop(); })
		.appendTo(this.container);
	
	this.removeBtn = $('<span>')
		.addClass('btnRemove button')
		.text('x')
		.click(function(e){e.stopPropagation(); e.preventDefault(); self.removeFromSet(); })
		.appendTo(this.container);
	
	$('#emptyClip').remove();
	this.container.appendTo($('#clips'));
	
	if (this.doc.loop) {
		this.container.addClass('looping');
		this.player = new LoopPlayer(this.src, this.container);
	} else {
		this.player = new Player(this.src, this.container);
	}	
}

Clip.prototype.togglePlayback = function() {
	if ( this.container.hasClass('playing')) {
		this.player.stop();
		this.container.removeClass('playing');
	} else {
		this.player.play();
		this.container.addClass('playing');
	}
};

Clip.prototype.toggleLoop = function() {	
	this.player.remove();
	
	if (this.container.hasClass('looping')) {
		this.player = new Player(this.src, this.container);
		this.doc.loop = false;
	} else {
		this.player = new LoopPlayer(this.src, this.container);
		this.doc.loop = true;
	}
	
	Db.update(this.doc);
	this.container.toggleClass('looping');
};

Clip.prototype.removeFromSet = function() {
	if (this.removeBtn.text().trim() == 'x') {
		this.removeBtn.text('Sure ?');
		var btn = this.removeBtn;
		setTimeout(function() { btn.text('x'); }, 3000);
	} else {
		this.container.empty();
		this.container.remove();
	}
}



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