/////////////////////////////////
// COMPUTED PROPERTY EXTENSION //
/////////////////////////////////

( function zDataComputers(){

    zData.extensions.push({attribute: "computer", setup: setupComputer});

    document.addEventListener("zDataInitialized", function(event){
        event.target.addEventListener("change", function(event){
            event.stopPropagation();
            runComputers(event.target);
        });
    });

    function setupComputer(element, zdata){

        var computer = eval(element.getAttribute("computer"));
        var zdata = zData.findNearestZDataParent(element);
        var root = zData.findRootZData(element);
        if (!zdata.computedProps){ zdata.computedProps = []; }

        var fun = function(zdata, root){
            if (!computer){ return 0; }/* Make sure computer function is defined */ 
            if (element.value){
                element.value = computer( zdata, root ) ;
            } else {
                element.innerHTML = computer( zdata, root ) ;
            }

        }
        zdata.computedProps.push(fun);

        document.addEventListener("zDataRendered", function(event){ 
            runComputers(element) 
        });
    }


    function runComputers(element){
        var root = zData.findRootZData(element);
        var zDataElement = zData.findNearestZDataParent(element)
        var computers = zDataElement.computedProps
        if (computers){
            for (var i=0; i<computers.length; i++){
                computers[i](zDataElement, root);
            }
        }
    }
})();