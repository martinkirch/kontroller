function(doc) {
	if (doc.type == 'set') {
		emit(doc.title, null);
	}
};