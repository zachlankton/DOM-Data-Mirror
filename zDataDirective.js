/*
        z-data web directive
        written by: Zach Lankton 2017       
*/

zData = {};  // zData Global Object
zData.children = {}; // An Object of root element children
zData.extensions = []; // An array to store z-data extensions

function registerZData(zDataProto){
        
    if (zDataProto.hasOwnProperty("value") ){return 0; /* this element has already been registered */ }
    
    // these are the core properties of z-data which provide its main functionality
    Object.defineProperty(zDataProto, "value", { get: valueGetter, set: dataRender, enumerable: true }  );
    Object.defineProperty(zDataProto, "valueElementTree", { get: valueElementTree}  );
    Object.defineProperty(zDataProto, "name", { get: nameAttributeGetter,   set: nameAttributeSetter });

    // these are the public methods that are available on an element with the z-data attribute
    zDataProto.add = addSibling;
    zDataProto.remove = removeSibling;

    // these are public utility functions for working with descendant elements of z-data elements
    // these are available in the global zData Object and can be used by extensions or any other custom code
    zData.findRootZData = findRootZData;
    zData.findNearestZDataParent = findNearestZDataParent;
    zData.findTemplateParent = findTemplateParent;

    // Initialize this element
    init(zDataProto);

    function init(zDataProto){
        // all elements with the z-data attribute need a name attribute
        if (zDataProto.getAttribute("name") == "") {throw ("z-data elements require a name attribute")}

        // we can only setup child templates on elements that are connected to the dom, becuase they need a parentElement
        if (zDataProto.isConnected){
            if (!zDataProto.parentElement.childTemplates){ zDataProto.parentElement.childTemplates = {}; } 
            zDataProto.parentElement.childTemplates[zDataProto.getAttribute("name")] = zDataCloneNode(zDataProto);
            zDataProto.parentElement.setAttribute("has-z-data-children", true);
        }  

        setupChildTemplates(zDataProto);

        // if this is a root z-data element, assign a root attribute, create a reference, and delete initial children
        if ( findRootZData(zDataProto) == zDataProto ){ 
            zDataProto.setAttribute("root-z-data", true);
            Object.defineProperty(zData.children, zDataProto.name, { get: valueGetter, set: dataRender, enumerable: true } );
            if (zDataProto.isConnected) {deleteExtraElements(zDataProto); }
        } 

        // Setup any extensions that may be available in zData.extensions
        setupExtensions(zDataProto, zDataProto); 

        // Dispatch Event for builtins to respond to
        var zDataInitEvent = new CustomEvent("zDataInitialized", {bubbles:true});
        zDataProto.dispatchEvent(zDataInitEvent);

    }

    function setupChildTemplates(element){
        var zDataChildren = element.querySelectorAll('[z-data]');
        for (var i=0; i<zDataChildren.length; i++) {
            if (!zDataChildren[i].parentElement.childTemplates){zDataChildren[i].parentElement.childTemplates = {};}
            zDataChildren[i].parentElement.childTemplates[zDataChildren[i].getAttribute('name')] = zDataCloneNode(zDataChildren[i]);  
            zDataChildren[i].parentElement.setAttribute("has-z-data-children", true);
        }
    }

    function findRootZData(element){
        var zdRoot = element;
        if (!element.isConnected){return null;}
        while (element = element.parentElement){
            if (element.hasAttribute("z-data") ) {zdRoot = element}
        }
        return zdRoot;
    }

    function findNearestZDataParent(element){
        var zdRoot = element;
        while (element = element.parentElement){
            if (element.hasAttribute("z-data") ) {zdRoot = element; break;}
        }
        return zdRoot;
    }

    function dataRender(v){
        deleteExtraElements(zDataProto);
        renderValues(v, zDataProto);
        renderChildren(v, zDataProto);

        // dispatch zDataRendered Event for Builtins to respond to
        emitDataRendered(zDataProto);

    };

    function emitDataRendered(element){
        var zDataInitEvent = new CustomEvent("zDataRendered", {bubbles:true});
        element.dispatchEvent(zDataInitEvent);
    }

    function deleteExtraElements(element){
        
        var extraElements = element.querySelectorAll("[z-data]");

        for (var i=0; i<extraElements.length; i++){
            var ee = extraElements[i];
            var eeParent = ee.parentElement;
            eeParent.removeChild(ee);
        } 
    }

    function renderValues(values, element){
        tree = element.valueElementTree;
        for (var key in values){
            if (tree.hasOwnProperty(key)){
                if (typeof(tree[key].value) == "string" ){
                    tree[key].value = evaluateValue(values, key, tree[key]);    
                } else {
                    tree[key].innerHTML = evaluateValue(values, key, tree[key]);    
                }  
            }else if(typeof(values[key]) !== "object" ) {
                var hiddenInput = document.createElement("input");
                hiddenInput.type = "hidden";
                hiddenInput.name = key;
                hiddenInput.value = evaluateValue(values, key, hiddenInput);
                element.append(hiddenInput);
            }
        }
    }

    function evaluateValue(values, key, element){
        if (typeof(values[key]) == 'function'){
            var zdata = findNearestZDataParent(element);
            var root = findRootZData(element);
            if (!zdata.computedProps){ zdata.computedProps = []; }
            
            var fun = function(zdata){
                renderValOrHTML(element, values[key](zdata, root) );
            }
            zdata.computedProps.push(fun);
            
            return values[key](zdata, root);
        } else {
            return values[key];
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
        div.setAttribute("z-data", "");
        div.setAttribute("name", name);
        element.append(div);
        registerZData(div);
        element.removeChild(div);
        renderList(element, value, name);
    }

    function addSibling(childName, data){
        if (childName){
            var name = childName;
            var parent = findTemplateParent(zDataProto, name);
            var element = parent.childTemplates[name];
            var clone = zDataCloneNode(element);
        }else{
            var name = zDataProto.getAttribute("name");
            var parent = zDataProto.parentElement;
            var clone = zDataCloneNode(parent.childTemplates[name]);
        }

        var lastSibling = getLastSibling(parent, name);
       
        if (lastSibling){ parent.insertBefore(clone, lastSibling.nextElementSibling); }
       
        else { parent.appendChild(clone); }

        
        var zdc = clone.querySelectorAll("[z-data]");  // remove all child zData elements from cloned template
        for (var i=0; i<zdc.length;i++){zdc[i].parentElement.removeChild(zdc[i]);}

        var inpVals = clone.querySelectorAll("[name]"); //clear all values that may have leaked into the template;
        for (var i=0; i<inpVals.length;i++){renderValOrHTML(inpVals[i], ""); }
        
        if(data){ clone.value = data; }

    }

    function removeSibling() {
        zDataProto.parentElement.removeChild(zDataProto);
    }

    function getLastSibling(parent, name){
        var siblings = parent.querySelectorAll("[name='"+name+"']");
        var lastSiblingIndex = siblings.length - 1;
        return siblings[lastSiblingIndex];
    }

    function findTemplateParent(element, name){
        if ( element.hasAttribute("has-z-data-children") ){
            return element
        }else{
            var templateParent = element.querySelectorAll( "[has-z-data-children]" );
            for (var i=0; i<templateParent.length;i++){
                if (templateParent[i].childTemplates[name]){
                    return templateParent[i];
                    break;
                }
            }   
        }
    }

    function zDataCloneNode(element){
        var clone = element.cloneNode(true);
        return registerZData(clone);
    }
    
    function valueElementTree(){
        return valueGetter(undefined,zDataProto,true);
    }

    function valueGetter(data, element, getElementTree){
        var data = data || {};
        var element = element || zDataProto;

        for(var i=0; i<element.childElementCount; i++){
            var child = element.children[i];
            evaluateChild(data, child, getElementTree);
        };

//         data.add = function(zChild, data){
//             element.add(zChild, data);
//         }

        return data;
    }

    function evaluateChild(data, child, getElementTree){
        if      (child.hasAttribute("z-data") )     { getNestedZData(data, child, getElementTree)   }
        else if (child.hasAttribute("name"))    { getElementValue(data, child, getElementTree)  }
        else                                    { valueGetter(data, child, getElementTree)  } //descend into child dom elements recursively
    }

    function getNestedZData(data, child, getElementTree){
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
            if (child.value) { 
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

    function nameAttributeGetter(){return zDataProto.getAttribute("name") || ""; };
    function nameAttributeSetter(newVal){ zDataProto.setAttribute("name", newVal) };

    function setupExtensions(element, zDataElement){
        // extensions provide additional functionality when a given attribute is present on 
        // any descendant element of z-data, these attributes can be custom or native
        // multiple extensions for the same attribute may be possible, but collisions may occur, this has not been tested
        var children = element.children;
        for (var i=0; i<children.length; i++){
            var child = children[i];
            if (child.hasAttribute("z-data")){  //then descend no further  
            }else{
                evaluteElementForExtensions(child, zDataElement);
                setupExtensions(child, zDataElement); //continue looking through immediate children
            }
        }
    }

    function evaluteElementForExtensions(element, zdata){
        // extension objects = {attribute: "attribute name", setup: function(element, zData, attributeValue) }
        var ext = zData.extensions
        for (var i=0; i<ext.length; i++){
            if ( element.hasAttribute( ext[i].attribute ) ){ 
                var attrVal = element.getAttribute( ext[i].attribute );
                ext[i].setup(element, zdata, attrVal) 
            }
        }   
    }

    return zDataProto;
}

// this mutation observer watches for elements with the z-data attribute and registers them
var zDataObserver = new MutationObserver(function(mutations){
    if (typeof(mutationDoneTimer) !== "undefined"){
        clearTimeout(mutationDoneTimer)};
        mutationDoneTimer = setTimeout(function(){
            var mutationDoneEvent = new Event("MutationDone");
            document.dispatchEvent(mutationDoneEvent);
        }, 100);
    mutations.forEach(function(mutation){
        if (mutation.type == "childList"){
            mutation.addedNodes.forEach(function(node){
                if (node.nodeType === 1 && node.hasAttribute("z-data") ){
                    registerZData(node);
                }
            });
        }
        if (mutation.type == "attributes"){
            if (mutation.target.nodeType === 1 && mutation.target.hasAttribute("z-data") ){
                registerZData(mutation.target);
            }
            
        }
    });
});


zDataObserver.observe(document, {
    childList: true,
    subtree: true,
    attributeFilter: ['z-data']
});
