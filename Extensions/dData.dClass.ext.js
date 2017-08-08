///////////
// CLASS //
///////////

( function(){  // Usage: d-class="className:fieldToWatch:valueToMatch"  
               // Example d-class="completed:is_complete:true"
               //       If the "is_complete" field contains the value "true"
               //       then add class "completed" to this element
    
    dData.extensions.push({attribute: "d-class", setup: setupDClass});

    function setupDClass(element, dDataElement, attrVal){
        var attrSplit = attrVal.split(":");
        var className = attrSplit[0];
        var name = attrSplit[1];
        var expression = attrSplit[2];
        dDataElement.valueElementTree[name].addEventListener("change", dClass);
        document.addEventListener("dDataRendered", dClass);

        function dClass(event){
            if (dDataElement.value[name].toString() == expression ){
                element.classList.add(className);
            }else{
                element.classList.remove(className);
            }
            document.removeEventListener("dDataRendered", dClass);
        }

    }

})();