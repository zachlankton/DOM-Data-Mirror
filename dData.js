/*
        d-data web directive
        written by: Zach Lankton 2017       
*/

dData = {};  // dData Global Object
dData.extensions = []; // An array to store d-data extensions

function registerDData(dDataProto){
        
    if (dDataProto.hasOwnProperty("value") ){return 0; /* this element has already been registered */ }
    
    // these are the core properties of d-data which provide its main functionality
    Object.defineProperty(dDataProto, "value", { get: valueGetter, set: dataRender, enumerable: true }  );
    Object.defineProperty(dDataProto, "valueElementTree", { get: valueElementTree}  );
    Object.defineProperty(dDataProto, "name", { get: nameAttributeGetter,   set: nameAttributeSetter });

    // these are the public methods that are available on an element with the d-data attribute
    dDataProto.add = addSibling;
    dDataProto.remove = removeSibling;

    // these are public utility functions for working with descendant elements of d-data elements
    // these are available in the global dData Object and can be used by extensions or any other custom code
    dData.findRootDData = findRootDData;
    dData.findNearestDDataParent = findNearestDDataParent;
    dData.findTemplateParent = findTemplateParent;

    // Initialize this element
    init(dDataProto);

    function init(dDataProto){
        // all elements with the d-data attribute need a name attribute
        if (dDataProto.getAttribute("name") == "") {throw ("d-data elements require a name attribute")}

        // we can only setup child templates on elements that are connected to the dom, becuase they need a parentElement
        if (dDataProto.isConnected){
            if (!dDataProto.parentElement.childTemplates){ dDataProto.parentElement.childTemplates = {}; } 
            dDataProto.parentElement.childTemplates[dDataProto.getAttribute("name")] = dDataCloneNode(dDataProto);
            dDataProto.parentElement.setAttribute("has-d-data-children", true);
        }  

        setupChildTemplates(dDataProto);

        // Setup any extensions that may be available in dData.extensions
        setupExtensions(dDataProto, dDataProto); 

        // if this is a root d-data element, assign a root attribute, create a reference, and delete initial children
        setupRootDData(dDataProto);

        // Dispatch Event for builtins to respond to
        var dDataInitEvent = new CustomEvent("dDataInitialized", {bubbles:true});
        dDataProto.dispatchEvent(dDataInitEvent);

    }

    function setupChildTemplates(element){
        var dDataChildren = element.querySelectorAll('[d-data]');
        for (var i=0; i<dDataChildren.length; i++) {
            if (!dDataChildren[i].parentElement.childTemplates){dDataChildren[i].parentElement.childTemplates = {};}
            dDataChildren[i].parentElement.childTemplates[dDataChildren[i].getAttribute('name')] = dDataCloneNode(dDataChildren[i]);  
            dDataChildren[i].parentElement.setAttribute("has-d-data-children", true);
        }
    }

    function setupRootDData(dDataProto){
        if ( findRootDData(dDataProto) == dDataProto ){ 
            // Setup Scope
            var scope = dData;  
            var initialData = false;
            if ( dDataProto.hasAttribute("scope") ){
                scope = eval(dDataProto.getAttribute("scope"));
                if (scope.hasOwnProperty(dDataProto.name) ){ // Look for initial data on the scope
                    initialData = Object.assign({}, scope[dDataProto.name]);
                }
            }
            Object.defineProperty(scope, dDataProto.name, { get: valueGetter, set: dataRender, enumerable: true } );
            if (initialData) {scope[dDataProto.name] = initialData;}
        } 
    }

    function findRootDData(element){
        var ddRoot = element;
        if (!element.isConnected){return null;}
        while (element = element.parentElement){
            if (element.hasAttribute("d-data") ) {ddRoot = element}
        }
        return ddRoot;
    }

    function findNearestDDataParent(element){
        var ddRoot = element;
        while (element = element.parentElement){
            if (element.hasAttribute("d-data") ) {ddRoot = element; break;}
        }
        return ddRoot;
    }

    function dataRender(v){
        deleteExtraElements(dDataProto);
        renderValues(v, dDataProto);
        renderChildren(v, dDataProto);

        // dispatch dDataRendered Event for Builtins to respond to
        emitDataRendered(dDataProto);

    };

    function emitDataRendered(element){
        var dDataInitEvent = new CustomEvent("dDataRendered", {bubbles:true});
        element.dispatchEvent(dDataInitEvent);
    }

    function deleteExtraElements(element){
        
        var extraElements = element.querySelectorAll("[d-data]");

        for (var i=0; i<extraElements.length; i++){
            var ee = extraElements[i];
            var eeParent = ee.parentElement;
            eeParent.removeChild(ee);
        } 
    }

    function renderValues(values, element){
        var tree = element.valueElementTree;
        for (var key in values){
            if (tree.hasOwnProperty(key)){
                if (typeof(tree[key].value) == "string" ){
                    tree[key].value = values[key];    
                } else {
                    tree[key].innerHTML = values[key];    
                }  
            }else if(typeof(values[key]) !== "object" ) {
                var hiddenInput = document.createElement("input");
                hiddenInput.type = "hidden";
                hiddenInput.name = key;
                hiddenInput.value = values[key];
                element.append(hiddenInput);
            }
        }
    }

    function renderValOrHTML(element, value){
        if (element.value){
            element.value = value;
        }else{
            element.innerHTML = value;
        }
    }

    function renderChildren(value, element){
        for (var key in value){
            if (typeof(value[key]) == "object" && element.parentElement.childTemplates[element.getAttribute("name")].value.hasOwnProperty(key) )  {
                renderList(element, value[key], key);
            } else if (Array.isArray(value[key]) ){
                renderHiddenList(element, value[key], key);
            }
        }
    }

    function renderList(element, value, name){
        for (var i=0; i<value.length; i++){
            element.add(name, value[i]);
        };
    }

    function renderHiddenList(element, value, name){
        var div = document.createElement("div");
        div.setAttribute("d-data", "");
        div.setAttribute("name", name);
        element.append(div);
        registerDData(div);
        element.removeChild(div);
        renderList(element, value, name);
    }

    function addSibling(childName, data){
        if (childName){
            var name = childName;
            var parent = findTemplateParent(dDataProto, name);
            var element = parent.childTemplates[name];
            var clone = dDataCloneNode(element);
        }else{
            var name = dDataProto.getAttribute("name");
            var parent = dDataProto.parentElement;
            var clone = dDataCloneNode(parent.childTemplates[name]);
        }

        var lastSibling = getLastSibling(parent, name);
       
        if (lastSibling){ parent.insertBefore(clone, lastSibling.nextElementSibling); }
       
        else { parent.appendChild(clone); }

        var inpVals = clone.querySelectorAll("[name]"); //clear all values that may have leaked into the template;
        for (var i=0; i<inpVals.length;i++){renderValOrHTML(inpVals[i], ""); }
        
        if(data){ clone.value = data; }

    }

    function removeSibling() {
        dDataProto.parentElement.removeChild(dDataProto);
    }

    function getLastSibling(parent, name){
        var siblings = parent.querySelectorAll("[name='"+name+"']");
        var lastSiblingIndex = siblings.length - 1;
        return siblings[lastSiblingIndex];
    }

    function findTemplateParent(element, name){
        if ( element.hasAttribute("has-d-data-children") ){
            return element
        }else{
            var templateParent = element.querySelectorAll( "[has-d-data-children]" );
            for (var i=0; i<templateParent.length;i++){
                if (templateParent[i].childTemplates[name]){
                    return templateParent[i];
                    break;
                }
            }   
        }
    }

    function dDataCloneNode(element){
        var clone = element.cloneNode(true);
        return registerDData(clone);
    }
    
    function valueElementTree(){
        return valueGetter(undefined,dDataProto,true);
    }

    function valueGetter(data, element, getElementTree){
        var rootElement = false;
        if (data == undefined){rootElement = true;}
        var data = data || {};
        var element = element || dDataProto;

        for(var i=0; i<element.childElementCount; i++){
            var child = element.children[i];
            evaluateChild(data, child, getElementTree);
        };

        if (rootElement){
            Object.defineProperty(data, "add", {get: function(){
                return element.add;
            } });
        }
        
        return data;
    }

    function evaluateChild(data, child, getElementTree){
        if      (child.hasAttribute("d-data") )     { getNestedDData(data, child, getElementTree)   }
        else if (child.hasAttribute("name"))    { getElementValue(data, child, getElementTree)  }
        else                                    { valueGetter(data, child, getElementTree)  } //descend into child dom elements recursively
    }

    function getNestedDData(data, child, getElementTree){
        if (data[child.getAttribute("name")] == undefined){
            data[child.getAttribute("name")] = [];
            data[child.getAttribute("name")].add = function(zChild, data){
                child.add(zChild, data);
            };
            data[child.getAttribute("name")].remove = function(index){
                child.parentElement.querySelectorAll("[name='"+child.getAttribute("name")+"']")[index].remove();
            }
        }
        if ( getElementTree ){ data[child.getAttribute("name")].push(child.valueElementTree); }
        else { data[child.getAttribute("name")].push(child.value); }
    }

    function getElementValue(data, child, getElementTree){
        child.name = child.name || child.getAttribute("name");
        if ( getElementTree ) { data[child.getAttribute("name")] = child;  }
        else { 
            if (typeof(child.value)=="string" ) { 
                Object.defineProperty(data, child.getAttribute("name"), {
                    get: function(){ return child.value; }, 
                    set: function(newVal){ child.value = newVal; emitDataRendered(child);},
                    enumerable: true,
                }); 
            }else{
                Object.defineProperty(data, child.getAttribute("name"), {
                    get: function(){ return child.innerHTML; }, 
                    set: function(newVal){ child.innerHTML = newVal; emitDataRendered(child);},
                    enumerable: true
                }); 
            } 
        } 
    }

    function nameAttributeGetter(){return dDataProto.getAttribute("name") || ""; };
    function nameAttributeSetter(newVal){ dDataProto.setAttribute("name", newVal) };

    function setupExtensions(element, dDataElement){
        // extensions provide additional functionality when a given attribute is present on 
        // any descendant element of d-data, these attributes can be custom or native
        // multiple extensions for the same attribute may be possible, but collisions may occur, this has not been tested
        var children = element.children;
        for (var i=0; i<children.length; i++){
            var child = children[i];
            if (child.hasAttribute("d-data")){  //then descend no further  
            }else{
                evaluteElementForExtensions(child, dDataElement);
                setupExtensions(child, dDataElement); //continue looking through immediate children
            }
        }
    }

    function evaluteElementForExtensions(element, ddata){
        // extension objects = {attribute: "attribute name", setup: function(element, dData, attributeValue) }
        var ext = dData.extensions
        for (var i=0; i<ext.length; i++){
            if ( element.hasAttribute( ext[i].attribute ) ){ 
                var attrVal = element.getAttribute( ext[i].attribute );
                ext[i].setup(element, ddata, attrVal) 
            }
        }   
    }

    return dDataProto;
}

// this mutation observer watches for elements with the d-data attribute and registers them
var dDataObserver = new MutationObserver(function(mutations){
    if (typeof(mutationDoneTimer) !== "undefined"){
        clearTimeout(mutationDoneTimer)};
        mutationDoneTimer = setTimeout(function(){
            var mutationDoneEvent = new Event("MutationDone");
            document.dispatchEvent(mutationDoneEvent);
        }, 100);
    mutations.forEach(function(mutation){
        if (mutation.type == "childList"){
            mutation.addedNodes.forEach(function(node){
                if (node.nodeType === 1 && node.hasAttribute("d-data") ){
                    registerDData(node);
                }
            });
        }
        if (mutation.type == "attributes"){
            if (mutation.target.nodeType === 1 && mutation.target.hasAttribute("d-data") ){
                registerDData(mutation.target);
            }
            
        }
    });
});


dDataObserver.observe(document, {
    childList: true,
    subtree: true,
    attributeFilter: ['d-data']
});