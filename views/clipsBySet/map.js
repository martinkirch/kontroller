// use include_docs = true
function(doc) {
	if (doc.type == 'set') {
		var keyPrefix = doc._id + '-';
		for (var i=0; i < doc.clips.length; i++) {
			emit(keyPrefix+i, {_id: doc.clips[i]});
		};
		
	}
};