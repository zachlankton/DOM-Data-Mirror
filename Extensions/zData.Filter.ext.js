///////////////////////
// FILTER  EXTENSION //
///////////////////////

( function zDataFilterExtension(){

    zData.extensions.push({attribute: "filter", setup: setupFilter})

    function setupFilter(filter, zdata){
        
        filter.addEventListener("keyup", function(event){
            var dataToFilter = filter.getAttribute('filter');
            var searchKeys = filter.value.split(" ");
            var parent = zData.findNearestZDataParent(filter);
            var children = parent.querySelectorAll("[name='"+dataToFilter+"']");
            for (var i=0; i<children.length; i++){
                var f = filterArr_AND(children[i].value, searchKeys);
                if (f || filter.value == "") {
                    children[i].style.display = "" ;   
                }else{
                    children[i].style.display = "none";
                }

            }
        });      
    }

    function filterArr(obj, searchVal){ 
        // this function will filter a nested array to elements containing searchVal  
        if ( Array.isArray(obj) ){
            var results = []
            for (var i=0; i<obj.length; i++){
                 var r = filterArr( obj[i], searchVal ) 
                 if (r) { results.push(r) }
            }
            if (results.length == 0 ){ return false } else { return results }
        } else if (typeof(obj)=="object" ) {
            var results = {};
            for (var key in obj) {
                var r = filterArr( obj[key], searchVal )
                if (r) { results[key] = r } 
            }
            if (Object.keys(results).length == 0) { return false } else { return obj }
        } else {
            if (obj && obj.toLowerCase().indexOf(searchVal.toLowerCase()) > -1 ) { return obj; } else { return false; }
        }
    }

    function filterArr_AND(obj, searchKeys){
        // this function will filter a nested array to elements including all search keys
        var results = obj;
        for (var i=0; i<searchKeys.length;i++ ){
            results = filterArr(results, searchKeys[i]);
            if (results.length == 0 || results == false) {break;}
        }
        return results;
    }

})();