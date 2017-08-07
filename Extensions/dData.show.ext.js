//////////
// SHOW //
//////////

(function(){  /* Usage: show="nameOfFunction" <--- the function needs to return true of false
                 Example: show="test"         <---  element.hidden == test()    
                 function test(){  return expr ? true : false; }               
*/  
    dData.extensions.push({attribute: "show", setup: setupShow});

    function setupShow(element, dDataElement, attrVal){

        dDataElement.addEventListener("dDataRendered", showHide);
        dDataElement.addEventListener("change", showHide);

        function showHide(){
            var attrSplit = attrVal.split(".");
            var func = window;
            var i=0;
            while (typeof(func) != "function" ){
                func = func[attrSplit[i]];
                i++;
            }
            element.hidden = func(); 
        }
    }

})();