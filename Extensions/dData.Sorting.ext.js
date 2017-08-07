///////////////////////
// SORTING EXTENSION //
///////////////////////

( function dDataSortExtension(){

    /* naturalSort https://github.com/overset/javascript-natural-sort */
    function naturalSort(e,a){var r,t,n=/(^([+\-]?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?(?=\D|\s|$))|^0x[\da-fA-F]+$|\d+)/g,l=/^\s+|\s+$/g,i=/\s+/g,s=/(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/,c=/^0x[0-9a-f]+$/i,p=/^0/,u=function(e){return(naturalSort.insensitive&&(""+e).toLowerCase()||""+e).replace(l,"")},d=u(e),f=u(a),o=d.replace(n,"\0$1\0").replace(/\0$/,"").replace(/^\0/,"").split("\0"),h=f.replace(n,"\0$1\0").replace(/\0$/,"").replace(/^\0/,"").split("\0"),w=parseInt(d.match(c),16)||1!==o.length&&Date.parse(d),$=parseInt(f.match(c),16)||w&&f.match(s)&&Date.parse(f)||null,m=function(e,a){return(!e.match(p)||1==a)&&parseFloat(e)||e.replace(i," ").replace(l,"")||0};if($){if(w<$)return-1;if(w>$)return 1}for(var g=0,N=o.length,x=h.length,v=Math.max(N,x);g<v;g++){if(r=m(o[g]||"",N),t=m(h[g]||"",x),isNaN(r)!==isNaN(t))return isNaN(r)?1:-1;if(/[^\x00-\x80]/.test(r+t)&&r.localeCompare){var C=r.localeCompare(t);return C/Math.abs(C)}if(r<t)return-1;if(r>t)return 1}}

    dData.extensions.push({attribute: "sort", setup: setupSort});

    function setupSort(element, dDataElement, attributeValue){
        element.addEventListener("click", function(event){
            var listToSort = attributeValue.split(":")[0];
            var key = attributeValue.split(":")[1];
            var dir = attributeValue.split(":")[2];
            var zParent = dData.findNearestDDataParent(element);
            var children = qsa(zParent, "[name='"+listToSort+"']");
            var chParent = children[0].parentElement;
            children.sort(function(a,b){
                return sort(a,b,key,dir);
            });
            for (var i=0; i<children.length; i++){
                chParent.appendChild(children[i]);
            }
        });
    }

    // this function is needed to return an array of elements instead of a nodeList
    function qsa(parent, selector){return [].slice.call(parent.querySelectorAll(selector) )}

    function sort(a, b, key, dir) {
        if (dir == "desc"){ return naturalSort(b.value[key].toLowerCase(), a.value[key].toLowerCase() ); }
        else { return naturalSort(a.value[key].toLowerCase(), b.value[key].toLowerCase() ) }   
    }

})();