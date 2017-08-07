///////////////////////
// FILTER  EXTENSION //
///////////////////////

( function dDataFilterExtension(){

    dData.extensions.push({attribute: "filter", setup: setupFilter});

    function setupFilter(filter, dDataElement, attrVal){
        
        filter.addEventListener("keyup", function(event){
            var attrSplit = attrVal.split(":");
            var dataToFilter = attrSplit[0];
            var keyToFilterOn = attrSplit[1];

            var searchKeys = filter.value.split(" ");
            var parent = dData.findNearestDDataParent(filter);
            var children = parent.querySelectorAll("[name='"+dataToFilter+"']");
            for (var i=0; i<children.length; i++){
                var f = filterArr_AND(children[i].value, keyToFilterOn, searchKeys);
                if (f || filter.value == "") {
                    children[i].style.display = "" ;   
                }else{
                    children[i].style.display = "none";
                }

            }
        });      
    }

    function filterArr(obj, keyToFilterOn, searchVal){ 
        // this function will filter a nested array to elements containing searchVal  
        if ( Array.isArray(obj) ){
            var results = []
            for (var i=0; i<obj.length; i++){
                 var r = filterArr( obj[i], keyToFilterOn, searchVal ) 
                 if (r) { results.push(r) }
            }
            if (results.length == 0 ){ return false } else { return results }
        } else if (typeof(obj)=="object" ) {
            var results = {};
            for (var key in obj) {
                if (keyToFilterOn != undefined && key != keyToFilterOn){ continue; }
                var r = filterArr( obj[key], keyToFilterOn, searchVal )
                if (r != undefined && r != false) { results[key] = r } 
            }
            if (Object.keys(results).length == 0) { return false } else { return obj }
        } else {
            if (obj != undefined && obj.toString().toLowerCase().indexOf(searchVal.toLowerCase()) > -1 ) { return obj; } else { return undefined; }
        }
    }

    function filterArr_AND(obj, keyToFilterOn, searchKeys){
        // this function will filter a nested array to elements including all search keys
        var results = obj;
        for (var i=0; i<searchKeys.length;i++ ){
            var test = filterArr(results, keyToFilterOn, searchKeys[i]);
            if (test.length == 0 || test == false) {break;}
        }
        return test;
    }

})();