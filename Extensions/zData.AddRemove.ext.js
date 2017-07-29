/////////////////////////////////
// ADD AND REMOVE EXTENSIONS   //
/////////////////////////////////

( function zDataChildAdderExtension(){
    zData.extensions.push({attribute: "add", setup: setupAdder });

    function setupAdder(element, zdata, attrVal){
        element.addEventListener("click", function(event){
            zdata.add(attrVal);
        })
    }
})();

( function zDataChildRemoverExtension(){
    zData.extensions.push({attribute: "remove", setup: setupRemover });

    function setupRemover(element, zdata, attrVal){
        element.addEventListener("click", function(event){
            zdata.remove();
        })
    }
})();