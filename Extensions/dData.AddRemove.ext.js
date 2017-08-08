/////////////////////////////////
// ADD AND REMOVE EXTENSIONS   //
/////////////////////////////////

( function dDataChildAdderExtension(){  // usage: add="childNameToAdd[:inputToFocus]"

    dData.extensions.push({attribute: "add", setup: setupAdder });

    function setupAdder(element, dDataElement, attrVal){
        element.addEventListener("click", function(event){
            var attrSplit = attrVal.split(":");
            var childToAdd = attrSplit[0];
            var elementToFocus = attrSplit[1];
            var childAdded = dDataElement.add(childToAdd);
            if (elementToFocus){
                childAdded.querySelector("[name='"+elementToFocus+"']").focus();
            }else{
                var input = childAdded.querySelector("input");
                if (input){input.focus();}
            }
        })
    }
})();

( function dDataChildRemoverExtension(){ // usage: remove <-- no arguments needed, just place inside child element
    dData.extensions.push({attribute: "remove", setup: setupRemover });

    function setupRemover(element, dDataElement, attrVal){
        element.addEventListener("click", function(event){
            dDataElement.remove();
        })
    }
})();