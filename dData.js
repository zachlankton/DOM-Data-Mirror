/*
        d-data web directive
        written by: Zach Lankton & Gavin McGraw 2017       
*/

dData = {};  // dData Global Object
dData.extensions = []; // An array to store d-data extensions
dData.elementRenderHandler = {}; // An Object to store custom element render handlers;
dData.elementValueHandler = {}; // An Object to store custom element value handlers

// Polyfill for element.isConnected
(function (supported){
  if (supported) return;
  Object.defineProperty(window.Node.prototype, 'isConnected', {get})
  function get() {
    return document.contains(this);
  }
})('isConnected' in window.Node.prototype);

function registerDData(dDataProto){
        
    if (dDataProto.hasOwnProperty("value") ){return 0; /* this element has already been registered */ }
    
    // these are the core properties of d-data which provide its main functionality
    Object.defineProperty(dDataProto, "value", { get: valueGetter, set: dataRender, enumerable: true }  );
    Object.defineProperty(dDataProto, "valueElementTree", { get: valueElementTree}  );
    Object.defineProperty(dDataProto, "name", { get: nameAttributeGetter,   set: nameAttributeSetter });

    // these are the public methods that are available on an element with the d-data attribute
    dDataProto.add = function(data){
        return addSibling(null, data);
    }
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
            var templateParent = dDataProto.parentElement;
            if ( findRootDData(dDataProto) == dDataProto ){ templateParent = dDataProto; }
            if (!templateParent.childTemplates){ templateParent.childTemplates = {}; } 
            templateParent.childTemplates[dDataProto.getAttribute("name")] = dDataCloneNode(dDataProto);
            templateParent.setAttribute("has-d-data-children", true);
        }  

        // Setup any extensions that may be available in dData.extensions
        evaluateElementForExtensions(dDataProto, dDataProto);
        setupExtensions(dDataProto, dDataProto); 

        // if this is a root d-data element, setup scope and initial data
        setupRootDData(dDataProto);

        // Dispatch Event for builtins to respond to
        var dDataInitEvent = new CustomEvent("dDataInitialized", {bubbles:true});
        dDataProto.dispatchEvent(dDataInitEvent);

    }

    function setupRootDData(dDataProto){
        if ( findRootDData(dDataProto) == dDataProto ){ 
            dDataProto.add = addSibling;
            var scope = dData;      // Setup Scope.
            if ( dDataProto.hasAttribute("scope") ){
                var scope = setupScope(dDataProto);
                var initialData = lookForInitialData(scope, dDataProto);
            }

            Object.defineProperty(scope, dDataProto.name, { get: valueGetter, set: dataRender, enumerable: true } );
            if (initialData) {scope[dDataProto.name] = initialData;}
        } 
    }

    function setupScope(dDataProto){
        
        var scope = dDataProto.getAttribute("scope");
        if (scope == ""){ return window; }
        var paths = scope.split(".");
        var path = window;

        for (i=0; i<paths.length; i++){
            if ( typeof(path[paths[i]])=="undefined" ){
                path[paths[i]] = {};
            }
            path = path[paths[i]];
        }

        return path;
    }

    function lookForInitialData(scope, dDataProto){
        if (scope.hasOwnProperty(dDataProto.name) ){ // Look for initial data on the scope
            return Object.assign({}, scope[dDataProto.name]);
        }
        return false;
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
                elementRenderHandler(tree[key], values[key])
            }else if(typeof(values[key]) !== "object" ) {
                createHiddenInput(element, values, key)
            }
        }
    }

    function createHiddenInput(element, values, key){
        var hiddenInput = document.createElement("input");
        hiddenInput.type = "hidden";
        hiddenInput.name = key;
        hiddenInput.value = values[key];
        element.append(hiddenInput);
    }

    function elementRenderHandler( element, value ){
        var tagName = element.nodeName;
        var erHandler = dData.elementRenderHandler;
        if (erHandler[tagName]){
            erHandler[tagName](element, value);
            return 0;
        }

        // default element handler works with value and innerHTML;
        if (typeof(element.value) == "string" ){
            element.value = value;    
        } else {
            element.innerHTML = value;    
        }  
    }

    function renderValOrHTML(element, value){
        if (element.type == "checkbox" ) {
            element.checked = value == "" ? false : true ;
        } else if (element.value){
            element.value = value;
        }else{
            element.innerHTML = value;
        }
    }

    function renderChildren(value, element){
        var elemName = element.getAttribute("name");
        var parent = element.parentElement;
        var templateParent = findTemplateParent(element, elemName);
        if (!templateParent){return 0;}
        var childTemplate = templateParent.childTemplates[elemName];
        var templateValue = childTemplate.value;
        for (var key in value){
            if (typeof(value[key]) == "object" && templateValue.hasOwnProperty(key) )  {
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

        return clone;
    }

    function removeSibling() {
        var parent = dDataProto.parentElement;
        parent.removeChild(dDataProto);
        emitDataRendered(parent);
    }

    function getLastSibling(parent, name){
        var siblings = parent.querySelectorAll("[name='"+name+"']");
        var lastSiblingIndex = siblings.length - 1;
        return siblings[lastSiblingIndex];
    }

    function findTemplateParent(element, name){
        if ( element.hasAttribute("has-d-data-children") && element.childTemplates[name]){
            return element;
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
            Object.defineProperty(data, "element", {get: function(){
                return dDataProto;
            }} );
            Object.defineProperty(data, "elementTree", {get: valueElementTree} );
        }
        
        return data;
    }

    function evaluateChild(data, child, getElementTree){
        if      (child.hasAttribute("d-data") )     { getNestedDData(data, child, getElementTree)   }
        else if (child.hasAttribute("name"))    { getElementValue(data, child, getElementTree)  }
        else                                    { valueGetter(data, child, getElementTree)  } //descend into child dom elements recursively
    }

    function getNestedDData(data, child, getElementTree){
        var childName = child.getAttribute("name");
        if (data[childName] == undefined){
            data[childName] = [];
            data[childName].add = function(data){
                child.add(null, data);
            };
            data[childName].remove = function(index){
                child.parentElement.querySelectorAll("[name='"+childName+"']")[index].remove();
            }
        }
        if ( getElementTree ){ data[childName].push(child.valueElementTree); }
        else { data[childName].push(child.value); }
    }

    function getElementValue(data, child, getElementTree){
        child.name = child.name || child.getAttribute("name");
        var childName = child.name;
        if ( getElementTree ) { data[childName] = child;  }
        else { 
            elementValueHandler(data, child, childName);
        } 
    }

    function elementValueHandler(data, child, childName){
        var tagName = child.nodeName;
        var evHandler = dData.elementValueHandler;
        if (evHandler[tagName]){
            evHandler[tagName](data, child, childName, emitDataRendered);
            return;
        }

        // default Element Value Handler works with value attribute and innerHTML
        var childAttr = "";
        if (typeof(child.value)=="string" ) 
            { childAttr = "value"; }
        else{ childAttr = "innerHTML"; } 

        Object.defineProperty(data, childName, {
            get: function(){ return child[childAttr]; }, 
            set: function(newVal){ child[childAttr] = newVal; emitDataRendered(child);},
            enumerable: true,
        }); 
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
                evaluateElementForExtensions(child, dDataElement);
                setupExtensions(child, dDataElement); //continue looking through immediate children
            }
        }
    }

    function evaluateElementForExtensions(element, ddata){
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


(function(){

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
                var nodes = mutation.addedNodes;
                for(var i=0;i<nodes.length;i++){
                    if (nodes[i].nodeType === 1 && nodes[i].hasAttribute("d-data") ){
                        registerDData(nodes[i]);
                    }
                }
                
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
        subtree: true
    });

})();

