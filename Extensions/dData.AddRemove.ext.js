/////////////////////////////////
// ADD AND REMOVE EXTENSIONS   //
/////////////////////////////////

( function dDataChildAdderExtension(){
    dData.extensions.push({attribute: "add", setup: setupAdder });

    function setupAdder(element, dData, attrVal){
        element.addEventListener("click", function(event){
            dData.add(attrVal);
        })
    }
})();

( function dDataChildRemoverExtension(){
    dData.extensions.push({attribute: "remove", setup: setupRemover });

    function setupRemover(element, dData, attrVal){
        element.addEventListener("click", function(event){
            dData.remove();
        })
    }
})();