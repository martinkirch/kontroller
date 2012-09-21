// just a look-up view : use include_docs
function(doc) {
	if (doc.type == 'clip') {
		emit(doc.modified_at, null);
	}
};