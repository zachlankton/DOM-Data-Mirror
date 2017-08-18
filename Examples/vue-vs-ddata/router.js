( function(){
    window.router = {};
    var hash = location.hash.substr(1);
    var viewPort = undefined;
    var templates = undefined;
    var errorTemplate = undefined;
    var templateRouteIndex = [];

    if (hash == ""){
        location.hash = "/";
    }

    document.addEventListener("DOMContentLoaded", function(){
        viewPort = document.querySelector("[router-view]");

        templates = document.getElementsByTagName("template");

        errorTemplate = document.getElementById("errorTemplate");
        updateRouteIndex();

        updateView();
    });

    window.addEventListener("hashchange", function(){

        hash = location.hash.substr(1);
        if (hash == ""){
            location.hash = "/";
        }
        updateView();

    });

    function updateView(){
        var template = getTemplate();
        template = template || errorTemplate;
        var clone = document.importNode(template.content, true);
        viewPort.innerHTML = "";
        viewPort.appendChild(clone);
    }

    function updateRouteIndex(){
        var tempLen = templates.length;
        for (var i=0; i<tempLen; i++){
            if (!templates[i].hasAttribute("route")){continue;}
            var routes = templates[i].getAttribute("route").split("/");
            
            templateRouteIndex.push({routes});
        }
    }

    function getTemplate(){
        var len = templateRouteIndex.length;
        
        var hashRoutes = hash.split("/");
        var hashRouteLen = hashRoutes.length;

        for (var i=0; i<len; i++){  // search through the index to find a matching route
            var tempRoutes = templateRouteIndex[i].routes;
            var tempRouteLen = tempRoutes.length;

            // if the template route does not have the same number of arguments, continue
            if (hashRouteLen != tempRouteLen){ continue; }

            if ( routes_match(tempRoutes, hashRoutes) ){ return templates[i]; }

        }
    }

    function routes_match(templateRoute, hashRoute){
        var len = templateRoute.length;

        for (var i=0; i<len; i++){
            var tr = templateRoute[i];
            var hr = hashRoute[i];
            if( tr.indexOf(":") == 0 ){ // if this parameter is a variable
                var param = tr.substr(1);
                window.router[param] = hr;
                continue;
            } 
            if (tr != hr){return false;}
        }

        return true;
    }

    
} )();


( function dDataSetRoute(){
    dData.extensions.push({attribute: "set-route", setup: setRoute });

    function setRoute(element, dDataElement, attrVal){
        
        element.addEventListener("click", function(){
            var hashRoute = attrVal.split("/");
            hashRoute.shift();
            var len = hashRoute.length;
            var hashStr = "";
            for (var i=0; i<len; i++){
                var param = hashRoute[i];
                if (param.indexOf(":") == 0){ param = dDataElement.value[ param.substr(1) ]; }
                hashStr += "/" + param;
            }
            location.hash = hashStr;
        });
        
    }
})();