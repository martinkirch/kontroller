/**
Copyright (c) 2012, Martin Kirchgessner

"THE BEER-WARE LICENSE" (Revision 42):
<martin@mkir.ch> wrote this file. As long as you retain this notice you
can do whatever you want with this stuff. If we meet some day, and you think
this stuff is worth it, you can buy me a beer in return.
*/

/**
 * Class tied to a "Play" button (the big squares)
 * Instanciating a new one will create the button, the AUDIO (hidden) tag and 
 * append it in the parent element.
 * @param the corresponding CouchDB document
 */
function Player(doc) {
	this.id = 'player'+Player.playersCount++;
	this.doc = doc;
	var src = $.db.uri + this.doc._id + '/' + this.doc.title
	
	var container = $('<li>')
		.addClass('player')
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
	
	if (Player.playersCount == 1) {
		$('#emptyPlayer').remove();
	}
	
	container.data('object', this);
	container.appendTo($('#players'));
}

Player.playersCount = 0;