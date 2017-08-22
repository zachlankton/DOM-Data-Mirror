var db = new PouchDB("mmpmg");
var dbChangeHandlers = {};

db.createIndex({
  index: {fields: ['type']}
});

function removeDoc(id){
    db.get(id).then(function(doc){db.remove(doc)});
}

function removeAllDocs(){
    db.allDocs({include_docs:true}).then(function(allDocs){
        var docs = allDocs.rows;
        var len = docs.length;
        for (var i=0; i<len; i++){
            db.remove(docs[i].doc);
        }
    }); 
}

function generateUUID() {
	var d = new Date().getTime();
	var uuid = 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxx-xxxxxx'.replace(/[xy]/g, function(c) {
		var r = (d + Math.random()*16)%16 | 0;
		d = Math.floor(d/16);
		return (c=='x' ? r : (r&0x3|0x8)).toString(16);
	});
	return uuid;
};

( function dDataPouchDBExtension(){
	dData.extensions.push({attribute: "pouch-list", setup: setupList });
	dData.extensions.push({attribute: "pouch-load", setup: setupLoad });
	dData.extensions.push({attribute: "new", setup: setupNew });
	dData.extensions.push({attribute: "save", setup: setupSave });
	dData.extensions.push({attribute: "delete", setup: setupDelete });
	dData.extensions.push({attribute: "form", setup: setupForm });
	var selfSaved = false;

	function setupNew(element, dDataElement, attrVal){
		var dRoot = dData.findRootDData(element);
		attrVal = attrVal || dDataElement.getAttribute("name");
		element.addEventListener("click", function(event){
			dRoot.value = {};
			dRoot.value.type = attrVal;
		});
	};

	function setupLoad(element, dDataElement, attrVal){

		function refresh(){
			var dParent = dData.findRootDData(dDataElement);
			var childName = dDataElement.getAttribute("name");
			var val = eval(attrVal);
			if (dDataElement.isConnected){
				db.get(val).then(function(doc){
					dDataElement.value = doc;
				}).catch(function(err){
					console.log(err);
					alert("There was an error loading this document!")
				});
		   }
		}

		refresh();
	}

	function setupDelete(element, dDataElement, attrVal){
	   
			element.addEventListener("click", function(event){
				event.stopPropagation();
				var id = dDataElement.value._id;
				if (confirm("Are you sure you want to delete?")){
					db.get(id).then(function(doc){
						db.remove(doc);
					});
				};
			});
	   
	}

	function setupForm(element, dDataElement, attrVal){
		var dDataObj = attrVal.split(".");
		var scope = window[dDataObj[0]];
		var obj = dDataObj[1];
		
		 dDataElement.addEventListener("click", function(event){
			if (event.target.hasAttribute("d-data")){
				var dElem = event.target;
			}else{
				var dElem = dData.findNearestDDataParent(event.target);
			}
			
			scope[obj] = dElem.value;
		});

		
	};

	function setupSave(element, dDataElement, attrVal){
		attrVal = attrVal || dDataElement.getAttribute("name");
		if (dbChangeHandlers[attrVal] == undefined){dbChangeHandlers[attrVal] = {};}
		var dRoot = dData.findRootDData(element);

		dbChangeHandlers[attrVal].form = function(change){
            var dRoot = dData.findRootDData(element)
            var id = dDataElement.value._id;
            if (id == undefined){return 0;} // This is a new record
            if (change.doc._id == id && !selfSaved){
                if (change.deleted){
                    dRoot.value._id = "";
                    dRoot.value._rev = "";
                    alert("The Original document was deleted by someone else... make sure you save your work if you want to keep this document alive.");
                    return 0;
                }
                if (confirm("A newer version of this document is available.  \n Would you like to refresh?")) { 
                    db.get(id).then(function(doc){
                        dRoot.value = doc;
                    }).catch(function(err){
                        console.log(err);
                    });
                }
            }else if (change.doc._id == id){
                selfSaved = false;
                db.get(id).then(function(doc){
                    dRoot.value = doc;
                }).catch(function(err){
                    console.log(err);
                });;
            }else{selfSaved = false;}
        }
		
		 element.addEventListener("click", function(event){
			var obj = dRoot.value;
			obj._id = obj._id || generateUUID();
			selfSaved = true;
			db.put(obj).then(function(doc){
				dRoot.value = {_id: doc.id, _rev: doc.rev};
			}).catch(function(err){
				if (err.name == "conflict"){
					if (confirm("Couldn't Save... a newer version of this document is available.  \n Would you like to refresh?")) { 
						db.get(err.docId).then(function(doc){
							dRoot.value = doc;
						});
					}
				}
			});
		});
	};

	function setupList(element, dDataElement, attrVal){
		var dParent = dData.findRootDData(dDataElement);
		var childName = dDataElement.getAttribute("name");
		attrVal = attrVal || childName;

		if (dbChangeHandlers[attrVal] == undefined){dbChangeHandlers[attrVal] = {};};
		   
		if (dParent){
			dbChangeHandlers[attrVal].list = function(change){
				refresh();
			};
		}

		
		function refresh(){
			attrVal = attrVal || childName;
			if (dParent && dParent.isConnected){
				
				db.find({
				  selector: {
					type: attrVal
				  }
				}).then(function(data){

					var docs = {};
					docs[childName] = data.docs;
					dParent.value = docs;

				});		 
		   }
		}
	   
	   refresh();
	   
	};
	
	var dbChanges = db.changes({
		  since: 'now',
		  live: true,
		  include_docs: true
	}).on('change', function(change) {

		var type = change.doc.type;
		if (change.deleted){
			type = getDeletedType(change);
		}else{
			runChangeHandlers(type,change);
		}

	}).on('error', function (err) {
		console.log(err);
	});

	function runChangeHandlers(type, change){
		var keys = [];
		if (dbChangeHandlers[type]){
			keys = Object.keys(dbChangeHandlers[type])
		}
		var keyLen = keys.length;
		for (var i=0; i<keyLen; i++){
			var key = keys[i];
			dbChangeHandlers[type][key](change);
		}
	}

	function getDeletedType(change){
		return db.get(change.id, {revs:true,  open_revs: 'all'}).then(function(revs){
			var id = revs[0].ok._id;
			var prevRev = revs[0].ok._revisions.ids[1];
			var revNo = revs[0].ok._revisions.start - 1;
			var revStr = revNo + "-" + prevRev;
			return db.get(id, {rev:revStr}).then(function(doc){
				runChangeHandlers(doc.type, change);
			});
		});
	}
})();