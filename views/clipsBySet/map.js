// use include_docs = true
function(doc) {
	if (doc.type == 'set') {
		var keyPrefix = doc._id + '-';
		for (var i=0; i < doc.clips.length; i++) {
			var clip = doc.clips[i];
			emit(keyPrefix + i, {
				_id: clip.id,
				color: clip.color
			});
		};
		
	}
};