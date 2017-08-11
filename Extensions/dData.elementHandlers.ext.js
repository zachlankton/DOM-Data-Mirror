////////////////////////////////////////////////////////////////////////
////////////////// DEFAULT ELEMENT HANDLER EXTENSION ///////////////////
////////////////////////////////////////////////////////////////////////


( function(){
    var evHandler = dData.elementValueHandler;
    var ERHandler = dData.elementRenderHandler;

    ERHandler.INPUT = function(element, value){
        var elmAttr = "";
        if (element.type == "text"){elmAttr = "value";}
        if (element.type == "checkbox"){elmAttr = "checked";};
        if (element.type == "radio"){ setRadio(element, value); return;}

        element[elmAttr] = value;
    }

    function setRadio(element,value){
        var dParent = dData.findNearestDDataParent(element);
        dParent.querySelector("input[value='"+value+"']").checked = true;
    }

    evHandler.INPUT = function(data, element, elementName, emitDataRendered){
        var elmAttr = "";
        
        if (element.type == "checkbox"){elmAttr = "checked";};
        if (element.type == "radio"){ handleRadios(data, element, elementName, emitDataRendered); return; }
        else { elmAttr = "value";} 

        Object.defineProperty(data, elementName, {
            get: function(){ return element[elmAttr]; }, 
            set: function(newVal){ element[elmAttr] = newVal; emitDataRendered(element);},
            enumerable: true
        }); 
    }

    function handleRadios(data, element, elementName, emitDataRendered){
        
        var radioGet = function(){
            var dParent = dData.findNearestDDataParent(element);
            var radios = dParent.querySelectorAll("[name='"+elementName+"']");
            var radioCount = radios.length;
            for (var i=0; i<radioCount; i++){
                if (radios[i].checked){return radios[i].value}
            }
        }

        var radioSet = function(newVal){
            setRadio(element,newVal);
        }

        var propObj = {
            get: radioGet,
            set: radioSet,
            enumerable: true
        }

        var isDefined = data.hasOwnProperty(elementName);
        if ( isDefined ){
            return ;
        }else {
            Object.defineProperty(data, elementName, propObj);    
        }
        
    }
       
})();