var db = new PouchDB("mmpmg");
var dbChangeHandlers = {};

db.createIndex({
  index: {fields: ['type']}
});

var dbChanges = db.changes({
      since: 'now',
      live: true,
      include_docs: true
}).on('change', function(change) {
    var type = change.doc.type;
    var keys = [];
    if (dbChangeHandlers[type]){
        keys = Object.keys(dbChangeHandlers[type])
    }
    var keyLen = keys.length;
    for (var i=0; i<keyLen; i++){
        var key = keys[i];
        dbChangeHandlers[type][key](change);
    }
}).on('error', function (err) {
    console.log(err);
});

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
            if (change.doc._id == id && !selfSaved){
                if (confirm("A newer version of this document is available.  \n Would you like to refresh?")) { 
                    db.get(id).then(function(doc){
                        dRoot.value = doc;
                    });
                }
            }else{
                selfSaved = false;
                db.get(id).then(function(doc){
                    dRoot.value = doc;
                });
            }
        }

        
         element.addEventListener("click", function(event){
            var obj = dRoot.value;
            obj._id = obj._id || generateUUID();
            selfSaved = true;
            db.put(obj).catch(function(err){
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
        dbChangeHandlers[attrVal].list = function(change){
                refresh();
        };

        
        
        function refresh(){
            var dParent = dData.findRootDData(dDataElement);
            var childName = dDataElement.getAttribute("name");
            attrVal = attrVal || childName;
            if (dDataElement.isConnected){
                db.find({
                  selector: {
                    type: attrVal
                  }
                }).then(function(data){
                    
                    var docs = data.docs;
                    var docsLen = docs.length;
                    removeAllItems(dParent);
                    for (var i=0; i<docsLen; i++){
                        dParent.add(childName, docs[i]);
                    }
                });  
           }
        }

        function removeAllItems(dParent){
            var items = dParent.querySelectorAll("[name='"+childName+"']");
            var itemsLen = items.length;
            for (var i=0; i<itemsLen; i++){
                items[i].parentElement.removeChild(items[i]);
            }
        }
       
       refresh();
       
    };
})();