/**
Copyright (c) 2012, Martin Kirchgessner

"THE BEER-WARE LICENSE" (Revision 42):
<martin@mkir.ch> wrote this file. As long as you retain this notice you
can do whatever you want with this stuff. If we meet some day, and you think
this stuff is worth it, you can buy me a beer in return.
*/

/**
 * This wraps all CouchDB operations
 */
var Db = {
	// Put your own DB name here
	_db : $.couch.db("kontroller"),
	
	uri : $.couch.db("kontroller").uri,
	
	onError : function(status, error, reason) {
		$('#errors').show().append("<p>"+status+": "+error+" - "+reason+"</p>");
	},
	
	get: function(id, callback) {
		Db._db.openDoc(id, {
			success:callback,
			error: Db.onError
		});
	},
	
	update: function(doc, callback) {
		var setId = !doc._id;
		doc.modified_at = new Date().toJSON();
		
		Db._db.saveDoc(doc, {
			success: function(data) {
				doc._rev = data.rev;
				if (setId)
					doc._id = data.id;
				if (callback)
					callback(doc);
			},
			error: Db.onError
		});
	},
	
	delete: function(doc, callback) {
		var id = {
			_id: doc._id,
			_rev: doc._rev
		};
		Db._db.removeDoc(id, {
			success: function(data) {
				if (data.ok)
					callback();
			},
			error: Db.onError
		});
	},
	
	/**
	 * Uploads the given file and creates a Clip for it
	 * @param File object
	 */
	addClipToSet : function(file) {
		Uploader.queue(file, function(attachmentDoc){
			Db.get(attachmentDoc._id, function(doc){ // re-get to have an authentic _attachments object
				doc.type = 'clip';
				doc.title = file.name.substr(0, file.name.lastIndexOf('.'));
				doc.loop = false;
				doc.modified_at = new Date().toJSON();

				Db._db.saveDoc(doc, {
					success: function(data) {
						doc._rev = data.rev;
						new Clip(doc);
					},
					error: Db.onError
				});
			});
		});
	},
	
	/**
	 * Fetchs metadata about the "max" latest clips, then invoke the callback with the fetched documents array
	 */
	latestClips : function(max, callback) {
		Db._db.view("kontroller/latest-clips", {
			include_docs: true,
			limit: max,
			descending: true,
			success: function(data) {
				callback(data.rows.map(function(row){ return row.doc}) );
			},
			error: Db.onError
		});
	},
	
	/**
	 * Fetch the sets index, feed the callback with an array[{id: , key: }]
	 */
	getSetsList: function(callback) {
		Db._db.view("kontroller/sets", {
			success: function(data) {
				callback(data.rows);
			},
			error: Db.onError
		});
	},
	
	/**
	 * Given a setId, fetch metadata about its contained clips, then invoke the callback with the fetched documents array
	 */
	listClipsBySet: function(setId, callback) {
		Db._db.view("kontroller/clipsBySet", {
			startkey: setId + '-0',
			endkey: setId + '-99999',
			include_docs: true,
			success: function(data) {
				for (var i=0; i < data.rows.length; i++) {
					var row = data.rows[i];
					callback(row.doc, row.value.color);
				};
			},
			error: Db.onError
		});
	}
}