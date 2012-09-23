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
 * @param Clip's background color - optional, defaults to a random value
 */
function Clip(doc, color) {
	var self = this;
	this.doc = doc;
	
	for (var filename in doc._attachments) // there should be only one here
		this.src = Db.uri + this.doc._id + '/' + filename
	
	this.container = $('<li>')
		.addClass('clip')
		.css('background', color ? color : Clip.generateRandomColor())
		.attr({id:this.doc._id, draggable:'true'})
		.click(function(e){e.stopPropagation(); e.preventDefault(); self.togglePlayback() })
		.on('ended', function(e) {
			$(this).removeClass('playing');
		})
		.data('object', this);
	
	this.label = $('<p>')
		.text(this.doc.title)
		.appendTo(this.container);
	
	var buttons = $('<p>')
		.addClass('buttons')
		.appendTo(this.container);
	
	this.loopBtn = $('<span>')
		.addClass('btnLoop button')
		.attr('title', 'Loop')
		.text('⟳') // aka UTF8's CLOCKWISE GAPPED CIRCLE ARROW FTW
		.click(function(e){e.stopPropagation(); e.preventDefault(); self.toggleLoop(); })
		.appendTo(buttons);
	
	this.editBtn = $('<span>')
		.addClass('btnEdit button')
		.attr('title', 'Edit clip title')
		.text('✎') // LOVER RIGHT PENCIL
		.click(function(e){e.stopPropagation(); e.preventDefault(); self.editTitle(); })
		.appendTo(buttons);
	
	this.removeBtn = $('<span>')
		.addClass('btnRemove button')
		.attr('title', 'Remove from set')
		.text('x')
		.click(function(e){e.stopPropagation(); e.preventDefault(); self.removeFromSet(); })
		.appendTo(buttons);
	
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

Clip.prototype.editTitle = function() {
	var newTitle = prompt('Clip title :', this.doc.title);
	if (newTitle) {
		this.doc.title = newTitle;
		this.label.text(newTitle);
		Db.update(this.doc);
	}
}

Clip.generateRandomColor = function() {
	var dict = '56789ABCDEF';
	return '#' + (function lol(c) {
		return dict[Math.floor(Math.random() * dict.length)] + (c && lol(c-1));
	})(4);
}

// Drag and drop to re-order clips
$(document).on('dragstart', '.clip', function(e) {
	var data = e.originalEvent.dataTransfer;
	var container = $(e.target).data('object');
	
	data.setData('application/x-id', $(e.target).attr('id'));
	data.effectAllowed = "move";
	data.dropEffect = "move";
	
	$('#deleteClip').show();
	
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
		
		if ($(this).is('#deleteClip')) {
			Db.delete($(sourceId).data('object').doc, function() {
				$(sourceId).empty().remove();
			});
		} else if ($(this).next('li').length == 0) {
			$(sourceId).detach().insertAfter($(this));
		} else {
			$(sourceId).detach().insertBefore($(this));
		}
	} else if (dt.files && dt.files.length > 0) { // doesn't work locally !
		for (var i=0; i < dt.files.length; i++) {
			Db.addClipToSet(dt.files[i]);
		}
	}
	
	$('#deleteClip').hide();
});