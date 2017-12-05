/*
        d-data web directive
        written by: Zach Lankton & Gavin McGraw 2017       
*/

//DEPENDENCIES -- 
	// PouchDB 6.3.4
			"use strict";function _interopDefault(e){return e&&"object"==typeof e&&"default"in e?e.default:e}function isBinaryObject(e){return e instanceof Buffer}function isPlainObject(e){var t=Object.getPrototypeOf(e);if(null===t)return!0;var n=t.constructor;return"function"==typeof n&&n instanceof n&&funcToString.call(n)==objectCtorString}function clone(e){var t,n,r;if(!e||"object"!=typeof e)return e;if(Array.isArray(e)){for(t=[],n=0,r=e.length;n<r;n++)t[n]=clone(e[n]);return t}if(e instanceof Date)return e.toISOString();if(isBinaryObject(e))return cloneBuffer(e);if(!isPlainObject(e))return e;t={};for(n in e)if(Object.prototype.hasOwnProperty.call(e,n)){var o=clone(e[n]);void 0!==o&&(t[n]=o)}return t}function once(e){var t=!1;return getArguments(function(n){if(t)throw new Error("once called more than once");t=!0,e.apply(this,n)})}function toPromise(e){return getArguments(function(t){var n=this,r="function"==typeof(t=clone(t))[t.length-1]&&t.pop(),o=new PouchPromise$1(function(r,o){var i;try{var a=once(function(e,t){e?o(e):r(t)});t.push(a),(i=e.apply(n,t))&&"function"==typeof i.then&&r(i)}catch(e){o(e)}});return r&&o.then(function(e){r(null,e)},r),o})}function logApiCall(e,t,n){if(e.constructor.listeners("debug").length){for(var r=["api",e.name,t],o=0;o<n.length-1;o++)r.push(n[o]);e.constructor.emit("debug",r);var i=n[n.length-1];n[n.length-1]=function(n,r){var o=["api",e.name,t];o=o.concat(n?["error",n]:["success",r]),e.constructor.emit("debug",o),i(n,r)}}}function adapterFun(e,t){return toPromise(getArguments(function(n){if(this._closed)return PouchPromise$1.reject(new Error("database is closed"));if(this._destroyed)return PouchPromise$1.reject(new Error("database is destroyed"));var r=this;return logApiCall(r,e,n),this.taskqueue.isReady?t.apply(this,n):new PouchPromise$1(function(t,o){r.taskqueue.addTask(function(i){i?o(i):t(r[e].apply(r,n))})})}))}function mangle(e){return"$"+e}function unmangle(e){return e.substring(1)}function Map$1(){this._store={}}function Set$1(e){if(this._store=new Map$1,e&&Array.isArray(e))for(var t=0,n=e.length;t<n;t++)this.add(e[t])}function supportsMapAndSet(){if("undefined"==typeof Symbol||"undefined"==typeof Map||"undefined"==typeof Set)return!1;var e=Object.getOwnPropertyDescriptor(Map,Symbol.species);return e&&"get"in e&&Map[Symbol.species]===Map}function pick(e,t){for(var n={},r=0,o=t.length;r<o;r++){var i=t[r];i in e&&(n[i]=e[i])}return n}function identityFunction(e){return e}function formatResultForOpenRevsGet(e){return[{ok:e}]}function bulkGet(e,t,n){function r(){++u===c&&function(){var e=[];s.forEach(function(t){t.docs.forEach(function(n){e.push({id:t.id,docs:[n]})})}),n(null,{results:e})}()}function o(){if(!(f>=l.length)){var n=Math.min(f+MAX_NUM_CONCURRENT_REQUESTS,l.length),i=l.slice(f,n);!function(n,i){n.forEach(function(n,c){var u=i+c,l=a.get(n),f=pick(l[0],["atts_since","attachments"]);f.open_revs=l.map(function(e){return e.rev}),f.open_revs=f.open_revs.filter(identityFunction);var d=identityFunction;0===f.open_revs.length&&(delete f.open_revs,d=formatResultForOpenRevsGet),["revs","attachments","binary","ajax","latest"].forEach(function(e){e in t&&(f[e]=t[e])}),e.get(n,f,function(e,t){var i;i=e?[{error:e}]:d(t),function(e,t,n){s[e]={id:t,docs:n},r()}(u,n,i),o()})})}(i,f),f+=i.length}}var i=t.docs,a=new ExportedMap;i.forEach(function(e){a.has(e.id)?a.get(e.id).push(e):a.set(e.id,[e])});var c=a.size,u=0,s=new Array(c),l=[];a.forEach(function(e,t){l.push(t)});var f=0;o()}function isChromeApp(){return!1}function hasLocalStorage(){return!1}function nextTick(e){process.nextTick(e)}function attachBrowserEvents(e){isChromeApp()?chrome.storage.onChanged.addListener(function(t){null!=t.db_name&&e.emit(t.dbName.newValue)}):hasLocalStorage()&&("undefined"!=typeof addEventListener?addEventListener("storage",function(t){e.emit(t.key)}):window.attachEvent("storage",function(t){e.emit(t.key)}))}function Changes(){events.EventEmitter.call(this),this._listeners={},attachBrowserEvents(this)}function guardedConsole(e){if("undefined"!==console&&e in console){var t=Array.prototype.slice.call(arguments,1);console[e].apply(console,t)}}function randomNumber(e,t){e=parseInt(e,10)||0,(t=parseInt(t,10))!=t||t<=e?t=(e||1)<<1:t+=1,t>6e5&&(e=3e5,t=6e5);return~~((t-e)*Math.random()+e)}function defaultBackOff(e){var t=0;return e||(t=2e3),randomNumber(e,t)}function PouchError(e,t,n){Error.call(this,n),this.status=e,this.name=t,this.message=n,this.error=!0}function createError(e,t){function n(t){for(var n in e)"function"!=typeof e[n]&&(this[n]=e[n]);void 0!==t&&(this.reason=t)}return n.prototype=PouchError.prototype,new n(t)}function generateErrorFromResponse(e){if("object"!=typeof e){var t=e;(e=UNKNOWN_ERROR).data=t}return"error"in e&&"conflict"===e.error&&(e.name="conflict",e.status=409),"name"in e||(e.name=e.error||"unknown"),"status"in e||(e.status=500),"message"in e||(e.message=e.message||e.reason),e}function tryFilter(e,t,n){try{return!e(t,n)}catch(e){var r="Filter function threw: "+e.toString();return createError(BAD_REQUEST,r)}}function filterChange(e){var t={},n=e.filter&&"function"==typeof e.filter;return t.query=e.query_params,function(r){r.doc||(r.doc={});var o=n&&tryFilter(e.filter,r.doc,t);if("object"==typeof o)return o;if(o)return!1;if(e.include_docs){if(!e.attachments)for(var i in r.doc._attachments)r.doc._attachments.hasOwnProperty(i)&&(r.doc._attachments[i].stub=!0)}else delete r.doc;return!0}}function flatten(e){for(var t=[],n=0,r=e.length;n<r;n++)t=t.concat(e[n]);return t}function f(){}function invalidIdError(e){var t;if(e?"string"!=typeof e?t=createError(INVALID_ID):/^_/.test(e)&&!/^_(design|local)/.test(e)&&(t=createError(RESERVED_ID)):t=createError(MISSING_ID),t)throw t}function isRemote(e){return"boolean"==typeof e._remote?e._remote:"function"==typeof e.type&&(guardedConsole("warn","db.type() is deprecated and will be removed in a future version of PouchDB"),"http"===e.type())}function listenerCount(e,t){return"listenerCount"in e?e.listenerCount(t):events.EventEmitter.listenerCount(e,t)}function parseDesignDocFunctionName(e){if(!e)return null;var t=e.split("/");return 2===t.length?t:1===t.length?[e,e]:null}function normalizeDesignDocFunctionName(e){var t=parseDesignDocFunctionName(e);return t?t.join("/"):null}function parseUri(e){for(var t=parser.exec(e),n={},r=14;r--;){var o=keys[r],i=t[r]||"",a=-1!==["user","password"].indexOf(o);n[o]=a?decodeURIComponent(i):i}return n[qName]={},n[keys[12]].replace(qParser,function(e,t,r){t&&(n[qName][t]=r)}),n}function upsert(e,t,n){return new PouchPromise$1(function(r,o){e.get(t,function(i,a){if(i){if(404!==i.status)return o(i);a={}}var c=a._rev,u=n(a);if(!u)return r({updated:!1,rev:c});u._id=t,u._rev=c,r(tryAndPut(e,u,n))})})}function tryAndPut(e,t,n){return e.put(t).then(function(e){return{updated:!0,rev:e.rev}},function(r){if(409!==r.status)throw r;return upsert(e,t._id,n)})}function rev(){return uuidV4.v4().replace(/-/g,"").toLowerCase()}function winningRev(e){for(var t,n,r,o,i=e.rev_tree.slice();o=i.pop();){var a=o.ids,c=a[2],u=o.pos;if(c.length)for(var s=0,l=c.length;s<l;s++)i.push({pos:u+1,ids:c[s]});else{var f=!!a[1].deleted,d=a[0];t&&!(r!==f?r:n!==u?n<u:t<d)||(t=d,n=u,r=f)}}return n+"-"+t}function traverseRevTree(e,t){for(var n,r=e.slice();n=r.pop();)for(var o=n.pos,i=n.ids,a=i[2],c=t(0===a.length,o,i[0],n.ctx,i[1]),u=0,s=a.length;u<s;u++)r.push({pos:o+1,ids:a[u],ctx:c})}function sortByPos(e,t){return e.pos-t.pos}function collectLeaves(e){var t=[];traverseRevTree(e,function(e,n,r,o,i){e&&t.push({rev:n+"-"+r,pos:n,opts:i})}),t.sort(sortByPos).reverse();for(var n=0,r=t.length;n<r;n++)delete t[n].pos;return t}function collectConflicts(e){for(var t=winningRev(e),n=collectLeaves(e.rev_tree),r=[],o=0,i=n.length;o<i;o++){var a=n[o];a.rev===t||a.opts.deleted||r.push(a.rev)}return r}function compactTree(e){var t=[];return traverseRevTree(e.rev_tree,function(e,n,r,o,i){"available"!==i.status||e||(t.push(n+"-"+r),i.status="missing")}),t}function rootToLeaf(e){for(var t,n=[],r=e.slice();t=r.pop();){var o=t.pos,i=t.ids,a=i[0],c=i[1],u=i[2],s=0===u.length,l=t.history?t.history.slice():[];l.push({id:a,opts:c}),s&&n.push({pos:o+1-l.length,ids:l});for(var f=0,d=u.length;f<d;f++)r.push({pos:o+1,ids:u[f],history:l})}return n.reverse()}function sortByPos$1(e,t){return e.pos-t.pos}function binarySearch(e,t,n){for(var r,o=0,i=e.length;o<i;)n(e[r=o+i>>>1],t)<0?o=r+1:i=r;return o}function insertSorted(e,t,n){var r=binarySearch(e,t,n);e.splice(r,0,t)}function pathToTree(e,t){for(var n,r,o=t,i=e.length;o<i;o++){var a=e[o],c=[a.id,a.opts,[]];r?(r[2].push(c),r=c):n=r=c}return n}function compareTree(e,t){return e[0]<t[0]?-1:1}function mergeTree(e,t){for(var n=[{tree1:e,tree2:t}],r=!1;n.length>0;){var o=n.pop(),i=o.tree1,a=o.tree2;(i[1].status||a[1].status)&&(i[1].status="available"===i[1].status||"available"===a[1].status?"available":"missing");for(var c=0;c<a[2].length;c++)if(i[2][0]){for(var u=!1,s=0;s<i[2].length;s++)i[2][s][0]===a[2][c][0]&&(n.push({tree1:i[2][s],tree2:a[2][c]}),u=!0);u||(r="new_branch",insertSorted(i[2],a[2][c],compareTree))}else r="new_leaf",i[2][0]=a[2][c]}return{conflicts:r,tree:e}}function doMerge(e,t,n){var r,o=[],i=!1,a=!1;if(!e.length)return{tree:[t],conflicts:"new_leaf"};for(var c=0,u=e.length;c<u;c++){var s=e[c];if(s.pos===t.pos&&s.ids[0]===t.ids[0])r=mergeTree(s.ids,t.ids),o.push({pos:s.pos,ids:r.tree}),i=i||r.conflicts,a=!0;else if(!0!==n){var l=s.pos<t.pos?s:t,f=s.pos<t.pos?t:s,d=f.pos-l.pos,h=[],p=[];for(p.push({ids:l.ids,diff:d,parent:null,parentIdx:null});p.length>0;){var v=p.pop();if(0!==v.diff)for(var _=v.ids[2],m=0,g=_.length;m<g;m++)p.push({ids:_[m],diff:v.diff-1,parent:v.ids,parentIdx:m});else v.ids[0]===f.ids[0]&&h.push(v)}var y=h[0];y?(r=mergeTree(y.ids,f.ids),y.parent[2][y.parentIdx]=r.tree,o.push({pos:l.pos,ids:l.ids}),i=i||r.conflicts,a=!0):o.push(s)}else o.push(s)}return a||o.push(t),o.sort(sortByPos$1),{tree:o,conflicts:i||"internal_node"}}function stem(e,t){for(var n,r,o=rootToLeaf(e),i=0,a=o.length;i<a;i++){var c,u=o[i],s=u.ids;if(s.length>t){n||(n={});var l=s.length-t;c={pos:u.pos+l,ids:pathToTree(s,l)};for(var f=0;f<l;f++){var d=u.pos+f+"-"+s[f].id;n[d]=!0}}else c={pos:u.pos,ids:pathToTree(s,0)};r=r?doMerge(r,c,!0).tree:[c]}return n&&traverseRevTree(r,function(e,t,r){delete n[t+"-"+r]}),{tree:r,revs:n?Object.keys(n):[]}}function merge(e,t,n){var r=doMerge(e,t),o=stem(r.tree,n);return{tree:o.tree,stemmedRevs:o.revs,conflicts:r.conflicts}}function revExists(e,t){for(var n,r=e.slice(),o=t.split("-"),i=parseInt(o[0],10),a=o[1];n=r.pop();){if(n.pos===i&&n.ids[0]===a)return!0;for(var c=n.ids[2],u=0,s=c.length;u<s;u++)r.push({pos:n.pos+1,ids:c[u]})}return!1}function getTrees(e){return e.ids}function isDeleted(e,t){t||(t=winningRev(e));for(var n,r=t.substring(t.indexOf("-")+1),o=e.rev_tree.map(getTrees);n=o.pop();){if(n[0]===r)return!!n[1].deleted;o=o.concat(n[2])}}function isLocalId(e){return/^_local/.test(e)}function latest(e,t){for(var n,r=t.rev_tree.slice();n=r.pop();){var o=n.pos,i=n.ids,a=i[0],c=i[1],u=i[2],s=0===u.length,l=n.history?n.history.slice():[];if(l.push({id:a,pos:o,opts:c}),s)for(var f=0,d=l.length;f<d;f++){var h=l[f];if(h.pos+"-"+h.id===e)return o+"-"+a}for(var p=0,v=u.length;p<v;p++)r.push({pos:o+1,ids:u[p],history:l})}throw new Error("Unable to resolve latest revision for id "+t.id+", rev "+e)}function tryCatchInChangeListener(e,t){try{e.emit("change",t)}catch(e){guardedConsole("error",'Error in .on("change", function):',e)}}function Changes$2(e,t,n){function r(){o.cancel()}events.EventEmitter.call(this);var o=this;this.db=e;var i=(t=t?clone(t):{}).complete=once(function(t,n){t?listenerCount(o,"error")>0&&o.emit("error",t):o.emit("complete",n),o.removeAllListeners(),e.removeListener("destroyed",r)});n&&(o.on("complete",function(e){n(null,e)}),o.on("error",n)),e.once("destroyed",r),t.onChange=function(e){o.isCancelled||tryCatchInChangeListener(o,e)};var a=new PouchPromise$1(function(e,n){t.complete=function(t,r){t?n(t):e(r)}});o.once("cancel",function(){e.removeListener("destroyed",r),t.complete(null,{status:"cancelled"})}),this.then=a.then.bind(a),this.catch=a.catch.bind(a),this.then(function(e){i(null,e)},i),e.taskqueue.isReady?o.validateChanges(t):e.taskqueue.addTask(function(e){e?t.complete(e):o.isCancelled?o.emit("cancel"):o.validateChanges(t)})}function processChange(e,t,n){var r=[{rev:e._rev}];"all_docs"===n.style&&(r=collectLeaves(t.rev_tree).map(function(e){return{rev:e.rev}}));var o={id:t.id,changes:r,doc:e};return isDeleted(t,e._rev)&&(o.deleted=!0),n.conflicts&&(o.doc._conflicts=collectConflicts(t),o.doc._conflicts.length||delete o.doc._conflicts),o}function compare(e,t){return e<t?-1:e>t?1:0}function yankError(e,t){return function(n,r){n||r[0]&&r[0].error?((n=n||r[0]).docId=t,e(n)):e(null,r.length?r[0]:r)}}function cleanDocs(e){for(var t=0;t<e.length;t++){var n=e[t];if(n._deleted)delete n._attachments;else if(n._attachments)for(var r=Object.keys(n._attachments),o=0;o<r.length;o++){var i=r[o];n._attachments[i]=pick(n._attachments[i],["data","digest","content_type","length","revpos","stub"])}}}function compareByIdThenRev(e,t){var n=compare(e._id,t._id);if(0!==n)return n;return compare(e._revisions?e._revisions.start:0,t._revisions?t._revisions.start:0)}function computeHeight(e){var t={},n=[];return traverseRevTree(e,function(e,r,o,i){var a=r+"-"+o;return e&&(t[a]=0),void 0!==i&&n.push({from:i,to:a}),a}),n.reverse(),n.forEach(function(e){void 0===t[e.from]?t[e.from]=1+t[e.to]:t[e.from]=Math.min(t[e.from],1+t[e.to])}),t}function allDocsKeysQuery(e,t,n){var r="limit"in t?t.keys.slice(t.skip,t.limit+t.skip):t.skip>0?t.keys.slice(t.skip):t.keys;if(t.descending&&r.reverse(),!r.length)return e._allDocs({limit:0},n);var o={offset:t.skip};return PouchPromise$1.all(r.map(function(n){var r=$inject_Object_assign({key:n,deleted:"ok"},t);return["limit","skip","keys"].forEach(function(e){delete r[e]}),new PouchPromise$1(function(t,i){e._allDocs(r,function(e,r){if(e)return i(e);o.total_rows=r.total_rows,t(r.rows[0]||{key:n,error:"not_found"})})})})).then(function(e){return o.rows=e,o})}function doNextCompaction(e){var t=e._compactionQueue[0],n=t.opts,r=t.callback;e.get("_local/compaction").catch(function(){return!1}).then(function(t){t&&t.last_seq&&(n.last_seq=t.last_seq),e._compact(n,function(t,n){t?r(t):r(null,n),nextTick(function(){e._compactionQueue.shift(),e._compactionQueue.length&&doNextCompaction(e)})})})}function attachmentNameError(e){return"_"===e.charAt(0)&&e+" is not a valid attachment name, attachment names cannot start with '_'"}function AbstractPouchDB(){events.EventEmitter.call(this)}function TaskQueue$1(){this.isReady=!1,this.failed=!1,this.queue=[]}function parseAdapter(e,t){var n=e.match(/([a-z-]*):\/\/(.*)/);if(n)return{name:/https?/.test(n[1])?n[1]+"://"+n[2]:n[2],adapter:n[1]};var r=PouchDB$5.adapters,o=PouchDB$5.preferredAdapters,i=PouchDB$5.prefix,a=t.adapter;if(!a)for(var c=0;c<o.length&&("idb"===(a=o[c])&&"websql"in r&&hasLocalStorage()&&localStorage["_pouch__websqldb_"+i+e]);++c)guardedConsole("log",'PouchDB is downgrading "'+e+'" to WebSQL to avoid data loss, because it was already opened with WebSQL.');var u=r[a];return{name:!(u&&"use_prefix"in u)||u.use_prefix?i+e:e,adapter:a}}function prepareForDestruction(e){function t(t){e.removeListener("closed",n),t||e.constructor.emit("destroyed",e.name)}function n(){e.removeListener("destroyed",t),e.constructor.emit("unref",e)}e.once("destroyed",t),e.once("closed",n),e.constructor.emit("ref",e)}function PouchDB$5(e,t){if(!(this instanceof PouchDB$5))return new PouchDB$5(e,t);var n=this;if(t=t||{},e&&"object"==typeof e&&(e=(t=e).name,delete t.name),this.__opts=t=clone(t),n.auto_compaction=t.auto_compaction,n.prefix=PouchDB$5.prefix,"string"!=typeof e)throw new Error("Missing/invalid DB name");var r=parseAdapter((t.prefix||"")+e,t);if(t.name=r.name,t.adapter=t.adapter||r.adapter,n.name=e,n._adapter=t.adapter,PouchDB$5.emit("debug",["adapter","Picked adapter: ",t.adapter]),!PouchDB$5.adapters[t.adapter]||!PouchDB$5.adapters[t.adapter].valid())throw new Error("Invalid Adapter: "+t.adapter);AbstractPouchDB.call(n),n.taskqueue=new TaskQueue$1,n.adapter=t.adapter,PouchDB$5.adapters[t.adapter].call(n,t,function(e){if(e)return n.taskqueue.fail(e);prepareForDestruction(n),n.emit("created",n),PouchDB$5.emit("created",n.name),n.taskqueue.ready(n)})}function setUpEventEmitter(e){Object.keys(events.EventEmitter.prototype).forEach(function(t){"function"==typeof events.EventEmitter.prototype[t]&&(e[t]=eventEmitter[t].bind(eventEmitter))});var t=e._destructionListeners=new ExportedMap;e.on("ref",function(e){t.has(e.name)||t.set(e.name,[]),t.get(e.name).push(e)}),e.on("unref",function(e){if(t.has(e.name)){var n=t.get(e.name),r=n.indexOf(e);r<0||(n.splice(r,1),n.length>1?t.set(e.name,n):t.delete(e.name))}}),e.on("destroyed",function(e){if(t.has(e)){var n=t.get(e);t.delete(e),n.forEach(function(e){e.emit("destroyed",!0)})}})}function debugPouch(e){e.debug=debug;var t={};e.on("debug",function(e){var n=e[0],r=e.slice(1);t[n]||(t[n]=debug("pouchdb:"+n)),t[n].apply(null,r)})}function getFieldFromDoc(e,t){for(var n=e,r=0,o=t.length;r<o;r++){if(!(n=n[t[r]]))break}return n}function compare$1(e,t){return e<t?-1:e>t?1:0}function parseField(e){for(var t=[],n="",r=0,o=e.length;r<o;r++){var i=e[r];"."===i?r>0&&"\\"===e[r-1]?n=n.substring(0,n.length-1)+".":(t.push(n),n=""):n+=i}return t.push(n),t}function isCombinationalField(e){return combinationFields.indexOf(e)>-1}function getKey(e){return Object.keys(e)[0]}function getValue(e){return e[getKey(e)]}function mergeAndedSelectors(e){var t={};return e.forEach(function(e){Object.keys(e).forEach(function(n){var r=e[n];if("object"!=typeof r&&(r={$eq:r}),isCombinationalField(n))r instanceof Array?t[n]=r.map(function(e){return mergeAndedSelectors([e])}):t[n]=mergeAndedSelectors([r]);else{var o=t[n]=t[n]||{};Object.keys(r).forEach(function(e){var t=r[e];return"$gt"===e||"$gte"===e?mergeGtGte(e,t,o):"$lt"===e||"$lte"===e?mergeLtLte(e,t,o):"$ne"===e?mergeNe(t,o):"$eq"===e?mergeEq(t,o):void(o[e]=t)})}})}),t}function mergeGtGte(e,t,n){void 0===n.$eq&&(void 0!==n.$gte?"$gte"===e?t>n.$gte&&(n.$gte=t):t>=n.$gte&&(delete n.$gte,n.$gt=t):void 0!==n.$gt?"$gte"===e?t>n.$gt&&(delete n.$gt,n.$gte=t):t>n.$gt&&(n.$gt=t):n[e]=t)}function mergeLtLte(e,t,n){void 0===n.$eq&&(void 0!==n.$lte?"$lte"===e?t<n.$lte&&(n.$lte=t):t<=n.$lte&&(delete n.$lte,n.$lt=t):void 0!==n.$lt?"$lte"===e?t<n.$lt&&(delete n.$lt,n.$lte=t):t<n.$lt&&(n.$lt=t):n[e]=t)}function mergeNe(e,t){"$ne"in t?t.$ne.push(e):t.$ne=[e]}function mergeEq(e,t){delete t.$gt,delete t.$gte,delete t.$lt,delete t.$lte,delete t.$ne,t.$eq=e}function massageSelector(e){var t=clone(e),n=!1;"$and"in t&&(t=mergeAndedSelectors(t.$and),n=!0),["$or","$nor"].forEach(function(e){e in t&&t[e].forEach(function(e){for(var t=Object.keys(e),n=0;n<t.length;n++){var r=t[n],o=e[r];"object"==typeof o&&null!==o||(e[r]={$eq:o})}})}),"$not"in t&&(t.$not=mergeAndedSelectors([t.$not]));for(var r=Object.keys(t),o=0;o<r.length;o++){var i=r[o],a=t[i];"object"!=typeof a||null===a?a={$eq:a}:"$ne"in a&&!n&&(a.$ne=[a.$ne]),t[i]=a}return t}function pad(e,t,n){for(var r="",o=n-e.length;r.length<o;)r+=t;return r}function padLeft(e,t,n){return pad(e,t,n)+e}function collate(e,t){if(e===t)return 0;e=normalizeKey(e),t=normalizeKey(t);var n=collationIndex(e),r=collationIndex(t);if(n-r!=0)return n-r;switch(typeof e){case"number":return e-t;case"boolean":return e<t?-1:1;case"string":return stringCollate(e,t)}return Array.isArray(e)?arrayCollate(e,t):objectCollate(e,t)}function normalizeKey(e){switch(typeof e){case"undefined":return null;case"number":return e===1/0||e===-1/0||isNaN(e)?null:e;case"object":var t=e;if(Array.isArray(e)){var n=e.length;e=new Array(n);for(var r=0;r<n;r++)e[r]=normalizeKey(t[r])}else{if(e instanceof Date)return e.toJSON();if(null!==e){e={};for(var o in t)if(t.hasOwnProperty(o)){var i=t[o];void 0!==i&&(e[o]=normalizeKey(i))}}}}return e}function indexify(e){if(null!==e)switch(typeof e){case"boolean":return e?1:0;case"number":return numToIndexableString(e);case"string":return e.replace(/\u0002/g,"").replace(/\u0001/g,"").replace(/\u0000/g,"");case"object":var t=Array.isArray(e),n=t?e:Object.keys(e),r=-1,o=n.length,i="";if(t)for(;++r<o;)i+=toIndexableString(n[r]);else for(;++r<o;){var a=n[r];i+=toIndexableString(a)+toIndexableString(e[a])}return i}return""}function toIndexableString(e){return e=normalizeKey(e),collationIndex(e)+SEP+indexify(e)+"\0"}function parseNumber(e,t){var n,r=t;if("1"===e[t])n=0,t++;else{var o="0"===e[t];t++;var i="",a=e.substring(t,t+MAGNITUDE_DIGITS),c=parseInt(a,10)+MIN_MAGNITUDE;for(o&&(c=-c),t+=MAGNITUDE_DIGITS;;){var u=e[t];if("\0"===u)break;i+=u,t++}n=1===(i=i.split(".")).length?parseInt(i,10):parseFloat(i[0]+"."+i[1]),o&&(n-=10),0!==c&&(n=parseFloat(n+"e"+c))}return{num:n,length:t-r}}function pop(e,t){var n=e.pop();if(t.length){var r=t[t.length-1];n===r.element&&(t.pop(),r=t[t.length-1]);var o=r.element,i=r.index;if(Array.isArray(o))o.push(n);else if(i===e.length-2){o[e.pop()]=n}else e.push(n)}}function parseIndexableString(e){for(var t=[],n=[],r=0;;){var o=e[r++];if("\0"!==o)switch(o){case"1":t.push(null);break;case"2":t.push("1"===e[r]),r++;break;case"3":var i=parseNumber(e,r);t.push(i.num),r+=i.length;break;case"4":for(var a="";;){var c=e[r];if("\0"===c)break;a+=c,r++}a=a.replace(/\u0001\u0001/g,"\0").replace(/\u0001\u0002/g,"").replace(/\u0002\u0002/g,""),t.push(a);break;case"5":var u={element:[],index:t.length};t.push(u.element),n.push(u);break;case"6":var s={element:{},index:t.length};t.push(s.element),n.push(s);break;default:throw new Error("bad collationIndex or unexpectedly reached end of input: "+o)}else{if(1===t.length)return t.pop();pop(t,n)}}}function arrayCollate(e,t){for(var n=Math.min(e.length,t.length),r=0;r<n;r++){var o=collate(e[r],t[r]);if(0!==o)return o}return e.length===t.length?0:e.length>t.length?1:-1}function stringCollate(e,t){return e===t?0:e>t?1:-1}function objectCollate(e,t){for(var n=Object.keys(e),r=Object.keys(t),o=Math.min(n.length,r.length),i=0;i<o;i++){var a=collate(n[i],r[i]);if(0!==a)return a;if(0!==(a=collate(e[n[i]],t[r[i]])))return a}return n.length===r.length?0:n.length>r.length?1:-1}function collationIndex(e){var t=["boolean","number","string","object"].indexOf(typeof e);return~t?null===e?1:Array.isArray(e)?5:t<3?t+2:t+3:Array.isArray(e)?5:void 0}function numToIndexableString(e){if(0===e)return"1";var t=e.toExponential().split(/e\+?/),n=parseInt(t[1],10),r=e<0,o=r?"0":"2",i=padLeft(((r?-n:n)-MIN_MAGNITUDE).toString(),"0",MAGNITUDE_DIGITS);o+=SEP+i;var a=Math.abs(parseFloat(t[0]));r&&(a=10-a);var c=a.toFixed(20);return c=c.replace(/\.?0+$/,""),o+=SEP+c}function createFieldSorter(e){function t(t){return e.map(function(e){var n=parseField(getKey(e));return getFieldFromDoc(t,n)})}return function(e,n){var r=collate(t(e.doc),t(n.doc));return 0!==r?r:compare$1(e.doc._id,n.doc._id)}}function filterInMemoryFields(e,t,n){if(e=e.filter(function(e){return rowFilter(e.doc,t.selector,n)}),t.sort){var r=createFieldSorter(t.sort);e=e.sort(r),"string"!=typeof t.sort[0]&&"desc"===getValue(t.sort[0])&&(e=e.reverse())}if("limit"in t||"skip"in t){var o=t.skip||0,i=("limit"in t?t.limit:e.length)+o;e=e.slice(o,i)}return e}function rowFilter(e,t,n){return n.every(function(n){var r=t[n],o=parseField(n),i=getFieldFromDoc(e,o);return isCombinationalField(n)?matchCominationalSelector(n,r,e):matchSelector(r,e,o,i)})}function matchSelector(e,t,n,r){return!e||Object.keys(e).every(function(o){var i=e[o];return match(o,t,i,n,r)})}function matchCominationalSelector(e,t,n){return"$or"===e?t.some(function(e){return rowFilter(n,e,Object.keys(e))}):"$not"===e?!rowFilter(n,t,Object.keys(t)):!t.find(function(e){return rowFilter(n,e,Object.keys(e))})}function match(e,t,n,r,o){if(!matchers[e])throw new Error('unknown operator "'+e+'" - should be one of $eq, $lte, $lt, $gt, $gte, $exists, $ne, $in, $nin, $size, $mod, $regex, $elemMatch, $type, $allMatch or $all');return matchers[e](t,n,r,o)}function fieldExists(e){return void 0!==e&&null!==e}function fieldIsNotUndefined(e){return void 0!==e}function modField(e,t){var n=t[0],r=t[1];if(0===n)throw new Error("Bad divisor, cannot divide by zero");if(parseInt(n,10)!==n)throw new Error("Divisor is not an integer");if(parseInt(r,10)!==r)throw new Error("Modulus is not an integer");return parseInt(e,10)===e&&e%n===r}function arrayContainsValue(e,t){return t.some(function(t){return e instanceof Array?e.indexOf(t)>-1:e===t})}function arrayContainsAllValues(e,t){return t.every(function(t){return e.indexOf(t)>-1})}function arraySize(e,t){return e.length===t}function regexMatch(e,t){return new RegExp(t).test(e)}function typeMatch(e,t){switch(t){case"null":return null===e;case"boolean":return"boolean"==typeof e;case"number":return"number"==typeof e;case"string":return"string"==typeof e;case"array":return e instanceof Array;case"object":return"[object Object]"==={}.toString.call(e)}throw new Error(t+" not supported as a type.Please use one of object, string, array, number, boolean or null.")}function matchesSelector(e,t){if("object"!=typeof t)throw new Error("Selector error: expected a JSON object");var n=filterInMemoryFields([{doc:e}],{selector:t=massageSelector(t)},Object.keys(t));return n&&1===n.length}function evalFilter(e){var t='(function() {\n"use strict";\nreturn '+e+"\n})()";return vm.runInNewContext(t)}function evalView(e){var t=['"use strict";',"var emitted = false;","var emit = function (a, b) {","  emitted = true;","};","var view = "+e+";","view(doc);","if (emitted) {","  return true;","}"].join("\n");return vm.runInNewContext("(function(doc) {\n"+t+"\n})")}function validate(e,t){if(e.selector&&e.filter&&"_selector"!==e.filter){var n="string"==typeof e.filter?e.filter:"function";return t(new Error('selector invalid for filter "'+n+'"'))}t()}function normalize(e){e.view&&!e.filter&&(e.filter="_view"),e.selector&&!e.filter&&(e.filter="_selector"),e.filter&&"string"==typeof e.filter&&("_view"===e.filter?e.view=normalizeDesignDocFunctionName(e.view):e.filter=normalizeDesignDocFunctionName(e.filter))}function shouldFilter(e,t){return t.filter&&"string"==typeof t.filter&&!t.doc_ids&&!isRemote(e.db)}function filter(e,t){var n=t.complete;if("_view"===t.filter){if(!t.view||"string"!=typeof t.view){var r=createError(BAD_REQUEST,"`view` filter parameter not found or invalid.");return n(r)}var o=parseDesignDocFunctionName(t.view);e.db.get("_design/"+o[0],function(r,i){if(e.isCancelled)return n(null,{status:"cancelled"});if(r)return n(generateErrorFromResponse(r));var a=i&&i.views&&i.views[o[1]]&&i.views[o[1]].map;if(!a)return n(createError(MISSING_DOC,i.views?"missing json key: "+o[1]:"missing json key: views"));t.filter=evalView(a),e.doChanges(t)})}else if(t.selector)t.filter=function(e){return matchesSelector(e,t.selector)},e.doChanges(t);else{var i=parseDesignDocFunctionName(t.filter);e.db.get("_design/"+i[0],function(r,o){if(e.isCancelled)return n(null,{status:"cancelled"});if(r)return n(generateErrorFromResponse(r));var a=o&&o.filters&&o.filters[i[1]];if(!a)return n(createError(MISSING_DOC,o&&o.filters?"missing json key: "+i[1]:"missing json key: filters"));t.filter=evalFilter(a),e.doChanges(t)})}}function applyChangesFilterPlugin(e){e._changesFilterPlugin={validate:validate,normalize:normalize,shouldFilter:shouldFilter,filter:filter}}function isFunction(e){return"function"==typeof e}function getPrefix(e){return isFunction(e.prefix)?e.prefix():e}function clone$2(e){var t={};for(var n in e)t[n]=e[n];return t}function nut(e,t,n){function r(e,r,o,i){return t.encode([e,n.encodeKey(r,o,i)])}function o(e,t){return t&&t.options&&(e.keyEncoding=e.keyEncoding||t.options.keyEncoding,e.valueEncoding=e.valueEncoding||t.options.valueEncoding),e}return e.open(function(){}),{apply:function(t,i,a){i=i||{};for(var c=[],u=-1,s=t.length;++u<s;){var l=t[u];o(l,l.prefix),l.prefix=getPrefix(l.prefix),c.push({key:r(l.prefix,l.key,i,l),value:"del"!==l.type&&n.encodeValue(l.value,i,l),type:l.type})}e.db.batch(c,i,a)},get:function(t,o,i,a){return i.asBuffer=n.valueAsBuffer(i),e.db.get(r(o,t,i),i,function(e,t){e?a(e):a(null,n.decodeValue(t,i))})},createDecoder:function(e){return function(r,o){return{key:n.decodeKey(t.decode(r)[1],e),value:n.decodeValue(o,e)}}},isClosed:function(){return e.isClosed()},close:function(t){return e.close(t)},iterator:function(o){var i=clone$2(o||{}),a=o.prefix||[];return ltgt.toLtgt(o,i,function(e){return r(a,e,i,{})},t.lowerBound,t.upperBound),i.prefix=null,i.keyAsBuffer=i.valueAsBuffer=!1,"number"!=typeof i.limit&&(i.limit=-1),i.keyAsBuffer=t.buffer,i.valueAsBuffer=n.valueAsBuffer(i),function(e){return{next:function(t){return e.next(t)},end:function(t){e.end(t)}}}(e.db.iterator(i))}}}function NotFoundError(){Error.call(this)}function ReadStream(e,t){if(!(this instanceof ReadStream))return new ReadStream(e,t);Readable.call(this,{objectMode:!0,highWaterMark:e.highWaterMark}),this._waiting=!1,this._options=e,this._makeData=t}function sublevelPouch(e){return sublevel$1(nut(e,precodec,codec),[],ReadStream,e.options)}function toObject(e){return e.reduce(function(e,t){return e[t]=!0,e},{})}function parseRevisionInfo(e){if(!/^\d+-./.test(e))return createError(INVALID_REV);var t=e.indexOf("-"),n=e.substring(0,t),r=e.substring(t+1);return{prefix:parseInt(n,10),id:r}}function makeRevTreeFromRevisions(e,t){for(var n=e.start-e.ids.length+1,r=e.ids,o=[r[0],t,[]],i=1,a=r.length;i<a;i++)o=[r[i],{status:"missing"},[o]];return[{pos:n,ids:o}]}function parseDoc(e,t){var n,r,o,i={status:"available"};if(e._deleted&&(i.deleted=!0),t)if(e._id||(e._id=uuid()),r=rev(),e._rev){if((o=parseRevisionInfo(e._rev)).error)return o;e._rev_tree=[{pos:o.prefix,ids:[o.id,{status:"missing"},[[r,i,[]]]]}],n=o.prefix+1}else e._rev_tree=[{pos:1,ids:[r,i,[]]}],n=1;else if(e._revisions&&(e._rev_tree=makeRevTreeFromRevisions(e._revisions,i),n=e._revisions.start,r=e._revisions.ids[0]),!e._rev_tree){if((o=parseRevisionInfo(e._rev)).error)return o;n=o.prefix,r=o.id,e._rev_tree=[{pos:n,ids:[r,i,[]]}]}invalidIdError(e._id),e._rev=n+"-"+r;var a={metadata:{},data:{}};for(var c in e)if(Object.prototype.hasOwnProperty.call(e,c)){var u="_"===c[0];if(u&&!reservedWords[c]){var s=createError(DOC_VALIDATION,c);throw s.message=DOC_VALIDATION.message+": "+c,s}u&&!dataWords[c]?a.metadata[c.slice(1)]=e[c]:a.data[c]=e[c]}return a}function thisAtob(e){var t=new Buffer(e,"base64");if(t.toString("base64")!==e)throw new Error("attachment is not a valid base64 string");return t.toString("binary")}function thisBtoa(e){return bufferFrom(e,"binary").toString("base64")}function typedBuffer(e,t,n){var r=bufferFrom(e,t);return r.type=n,r}function b64ToBluffer(e,t){return typedBuffer(e,"base64",t)}function binStringToBluffer(e,t){return typedBuffer(e,"binary",t)}function blobToBase64(e,t){t(e.toString("base64"))}function binaryMd5(e,t){t(crypto.createHash("md5").update(e,"binary").digest("base64"))}function stringMd5(e){return crypto.createHash("md5").update(e,"binary").digest("hex")}function updateDoc(e,t,n,r,o,i,a,c){if(revExists(t.rev_tree,n.metadata.rev))return r[o]=n,i();var u=t.winningRev||winningRev(t),s="deleted"in t?t.deleted:isDeleted(t,u),l="deleted"in n.metadata?n.metadata.deleted:isDeleted(n.metadata),f=/^1-/.test(n.metadata.rev);if(s&&!l&&c&&f){var d=n.data;d._rev=u,d._id=n.metadata.id,n=parseDoc(d,c)}var h=merge(t.rev_tree,n.metadata.rev_tree[0],e);if(c&&(s&&l&&"new_leaf"!==h.conflicts||!s&&"new_leaf"!==h.conflicts||s&&!l&&"new_branch"===h.conflicts)){var p=createError(REV_CONFLICT);return r[o]=p,i()}var v=n.metadata.rev;n.metadata.rev_tree=h.tree,n.stemmedRevs=h.stemmedRevs||[],t.rev_map&&(n.metadata.rev_map=t.rev_map);var _=winningRev(n.metadata),m=isDeleted(n.metadata,_),g=s===m?0:s<m?-1:1;a(n,_,m,v===_?m:isDeleted(n.metadata,v),!0,g,o,i)}function rootIsMissing(e){return"missing"===e.metadata.rev_tree[0].ids[1].status}function processDocs(e,t,n,r,o,i,a,c,u){function s(){++d===h&&u&&u()}e=e||1e3;var l=c.new_edits,f=new ExportedMap,d=0,h=t.length;t.forEach(function(e,t){if(e._id&&isLocalId(e._id)){var r=e._deleted?"_removeLocal":"_putLocal";n[r](e,{ctx:o},function(e,n){i[t]=e||n,s()})}else{var a=e.metadata.id;f.has(a)?(h--,f.get(a).push([e,t])):f.set(a,[[e,t]])}}),f.forEach(function(t,n){function o(){++f<t.length?u():s()}function u(){var u=t[f],s=u[0],d=u[1];if(r.has(n))updateDoc(e,r.get(n),s,i,d,o,a,l);else{var h=merge([],s.metadata.rev_tree[0],e);s.metadata.rev_tree=h.tree,s.stemmedRevs=h.stemmedRevs||[],function(e,t,n){var r=winningRev(e.metadata),o=isDeleted(e.metadata,r);if("was_delete"in c&&o)return i[t]=createError(MISSING_DOC,"deleted"),n();if(l&&rootIsMissing(e)){var u=createError(REV_CONFLICT);return i[t]=u,n()}a(e,r,o,o,!1,o?0:1,t,n)}(s,d,o)}}var f=0;u()})}function safeJsonParse(e){try{return JSON.parse(e)}catch(t){return vuvuzela.parse(e)}}function safeJsonStringify(e){try{return JSON.stringify(e)}catch(t){return vuvuzela.stringify(e)}}function readAsBlobOrBuffer(e,t){return e.type=t,e}function prepareAttachmentForStorage(e,t){t(e)}function createEmptyBlobOrBuffer(e){return typedBuffer("","binary",e)}function getCacheFor(e,t){var n=t.prefix()[0],r=e._cache,o=r.get(n);return o||(o=new ExportedMap,r.set(n,o)),o}function LevelTransaction(){this._batch=[],this._cache=new ExportedMap}function getWinningRev(e){return"winningRev"in e?e.winningRev:winningRev(e)}function getIsDeleted(e,t){return"deleted"in e?e.deleted:isDeleted(e,t)}function fetchAttachment(e,t,n){var r=e.content_type;return new PouchPromise$1(function(o,i){t.binaryStore.get(e.digest,function(t,a){var c;if(t){if("NotFoundError"!==t.name)return i(t);c=n.binary?binStringToBluffer("",r):""}else c=n.binary?readAsBlobOrBuffer(a,r):a.toString("base64");delete e.stub,delete e.length,e.data=c,o()})})}function fetchAttachments(e,t,n){var r=[];return e.forEach(function(e){if(e.doc&&e.doc._attachments){Object.keys(e.doc._attachments).forEach(function(t){var n=e.doc._attachments[t];"data"in n||r.push(n)})}}),PouchPromise$1.all(r.map(function(e){return fetchAttachment(e,t,n)}))}function LevelPouch$1(e,t){function n(){h.docStore=f.sublevel(DOC_STORE,{valueEncoding:safeJsonEncoding}),h.bySeqStore=f.sublevel(BY_SEQ_STORE,{valueEncoding:"json"}),h.attachmentStore=f.sublevel(ATTACHMENT_STORE,{valueEncoding:"json"}),h.binaryStore=f.sublevel(BINARY_STORE,{valueEncoding:"binary"}),h.localStore=f.sublevel(LOCAL_STORE,{valueEncoding:"json"}),h.metaStore=f.sublevel(META_STORE,{valueEncoding:"json"}),"object"==typeof e.migrate?e.migrate.doMigrationTwo(f,h,r):r()}function r(){h.metaStore.get(UPDATE_SEQ_KEY,function(e,n){void 0===f._updateSeq&&(f._updateSeq=n||0),h.metaStore.get(DOC_COUNT_KEY,function(e,n){f._docCount=e?0:n,h.metaStore.get(UUID_KEY,function(e,n){l=e?uuid():n,h.metaStore.put(UUID_KEY,l,function(){nextTick(function(){t(null,d)})})})})})}function o(e,t){try{e.apply(null,t)}catch(e){t[t.length-1](e)}}function i(){var e=f._queue.peekFront();"read"===e.type?function(e){var t=[e],n=1,r=f._queue.get(n);for(;void 0!==r&&"read"===r.type;)t.push(r),n++,r=f._queue.get(n);var a=0;t.forEach(function(e){var n=e.args,r=n[n.length-1];n[n.length-1]=getArguments(function(e){r.apply(null,e),++a===t.length&&nextTick(function(){t.forEach(function(){f._queue.shift()}),f._queue.length&&i()})}),o(e.fun,n)})}(e):function(e){var t=e.args,n=t[t.length-1];t[t.length-1]=getArguments(function(e){n.apply(null,e),nextTick(function(){f._queue.shift(),f._queue.length&&i()})}),o(e.fun,t)}(e)}function a(e){return getArguments(function(t){f._queue.push({fun:e,args:t,type:"write"}),1===f._queue.length&&nextTick(i)})}function c(e){return getArguments(function(t){f._queue.push({fun:e,args:t,type:"read"}),1===f._queue.length&&nextTick(i)})}function u(e){return("0000000000000000"+e).slice(-16)}function s(e,t){m.destroy(e,t)}var l,f,d=this,h={},p=(e=clone(e)).revs_limit,v=e.name;void 0===e.createIfMissing&&(e.createIfMissing=!0);var _,m=e.db,g=functionName(m);dbStores.has(g)?_=dbStores.get(g):(_=new ExportedMap,dbStores.set(g,_)),_.has(v)?(f=_.get(v),n()):_.set(v,sublevelPouch(levelup(v,e,function(r){if(r)return _.delete(v),t(r);(f=_.get(v))._docCount=-1,f._queue=new Deque,"object"==typeof e.migrate?e.migrate.doMigrationOne(v,f,n):n()}))),d._remote=!1,d.type=function(){return"leveldb"},d._id=function(e){e(null,l)},d._info=function(e){var t={doc_count:f._docCount,update_seq:f._updateSeq,backend_adapter:functionName(m)};return nextTick(function(){e(null,t)})},d._get=c(function(e,t,n){t=clone(t),h.docStore.get(e,function(e,r){if(e||!r)return n(createError(MISSING_DOC,"missing"));var o;if(t.rev)o=t.latest?latest(t.rev,r):t.rev;else{o=getWinningRev(r);if(getIsDeleted(r,o))return n(createError(MISSING_DOC,"deleted"))}var i=r.rev_map[o];h.bySeqStore.get(u(i),function(e,t){if(!t)return n(createError(MISSING_DOC));if("_id"in t&&t._id!==r.id)return n(new Error("wrong doc returned"));if(t._id=r.id,"_rev"in t){if(t._rev!==o)return n(new Error("wrong doc returned"))}else t._rev=o;return n(null,{doc:t,metadata:r})})})}),d._getAttachment=function(e,t,n,r,o){var i=n.digest,a=n.content_type;h.binaryStore.get(i,function(e,t){if(e)return"NotFoundError"!==e.name?o(e):o(null,r.binary?createEmptyBlobOrBuffer(a):"");r.binary?o(null,readAsBlobOrBuffer(t,a)):o(null,t.toString("base64"))})},d._bulkDocs=a(function(e,t,n){function r(e,t){var n=PouchPromise$1.resolve();e.forEach(function(e,t){n=n.then(function(){return new PouchPromise$1(function(n,r){d._doCompactionNoLock(t,e,{ctx:g},function(e){if(e)return r(e);n()})})})}),n.then(function(){t()},t)}function o(){r(m,function(e){if(e&&c(e),d.auto_compaction)return function(e){var t=new ExportedMap;_.forEach(function(e,n){t.set(n,compactTree(e))}),r(t,e)}(c);c()})}function i(e,t,r,o,i,c,s,f){function d(e){k++,w||(e?f(w=e):k===S.length&&E())}function p(e,t,n,r){return function(o){!function(e,t,n,r,o){var i=e.data._attachments[n];delete i.data,i.digest=t,i.length=r.length;var c=e.metadata.id,u=e.metadata.rev;i.revpos=parseInt(u,10),a(c,u,t,function(e,n){return e?o(e):0===r.length?o(e):n?(g.batch([{type:"put",prefix:h.binaryStore,key:t,value:bufferFrom(r,"binary")}]),void o()):o(e)})}(e,MD5_PREFIX+o,t,n,r)}}function v(e,t,n){return function(r){binaryMd5(r,p(e,t,r,n))}}function E(){var t=e.metadata.rev_map[e.metadata.rev];if(t)return f();t=++b,e.metadata.rev_map[e.metadata.rev]=e.metadata.seq=t;var n=[{key:u(t),value:e.data,prefix:h.bySeqStore,type:"put"},{key:e.metadata.id,value:e.metadata,prefix:h.docStore,type:"put"}];g.batch(n),l[s]={ok:!0,id:e.metadata.id,rev:e.metadata.rev},_.set(e.metadata.id,e.metadata),f()}y+=c;var w=null,k=0;e.metadata.winningRev=t,e.metadata.deleted=r,e.data._id=e.metadata.id,e.data._rev=e.metadata.rev,o&&(e.data._deleted=!0),e.stemmedRevs.length&&m.set(e.metadata.id,e.stemmedRevs);for(var S=e.data._attachments?Object.keys(e.data._attachments):[],D=0;D<S.length;D++){var P=S[D],O=e.data._attachments[P];if(O.stub){a(e.data._id,e.data._rev,O.digest,d)}else{var T;if("string"==typeof O.data){try{T=thisAtob(O.data)}catch(e){return void n(createError(BAD_ARG,"Attachment is not a valid base64 string"))}v(e,P,d)(T)}else prepareAttachmentForStorage(O.data,v(e,P,d))}}S.length||E()}function a(e,t,n,r){function o(r){var o=[e,t].join("@"),i={};return r?r.refs&&(i.refs=r.refs,i.refs[o]=!0):(i.refs={},i.refs[o]=!0),new PouchPromise$1(function(e){g.batch([{type:"put",prefix:h.attachmentStore,key:n,value:i}]),e(!r)})}var i=S[n]||PouchPromise$1.resolve();S[n]=i.then(function(){return new PouchPromise$1(function(e,t){g.get(h.attachmentStore,n,function(n,r){if(n&&"NotFoundError"!==n.name)return t(n);e(r)})}).then(o).then(function(e){r(null,e)},r)})}function c(e){if(e)return nextTick(function(){n(e)});g.batch([{prefix:h.metaStore,type:"put",key:UPDATE_SEQ_KEY,value:b},{prefix:h.metaStore,type:"put",key:DOC_COUNT_KEY,value:f._docCount+y}]),g.execute(f,function(e){if(e)return n(e);f._docCount+=y,f._updateSeq=b,levelChanges.notify(v),nextTick(function(){n(null,l)})})}var s=t.new_edits,l=new Array(e.docs.length),_=new ExportedMap,m=new ExportedMap,g=new LevelTransaction,y=0,b=f._updateSeq,E=e.docs,w=E.map(function(e){if(e._id&&isLocalId(e._id))return e;var t=parseDoc(e,s);return t.metadata&&!t.metadata.rev_map&&(t.metadata.rev_map={}),t}),k=w.filter(function(e){return e.error});if(k.length)return n(k[0]);var S={};if(!w.length)return n(null,[]);!function(e){var t=[];if(E.forEach(function(e){e&&e._attachments&&Object.keys(e._attachments).forEach(function(n){var r=e._attachments[n];r.stub&&t.push(r.digest)})}),!t.length)return e();var n,r=0;t.forEach(function(o){!function(e,t){g.get(h.attachmentStore,e,function(n){if(n){var r=createError(MISSING_STUB,"unknown stub attachment with digest "+e);t(r)}else t()})}(o,function(o){o&&!n&&(n=o),++r===t.length&&e(n)})})}(function(e){if(e)return n(e);!function(e){function t(){if(++r===E.length)return e(n)}var n,r=0;E.forEach(function(e){if(e._id&&isLocalId(e._id))return t();g.get(h.docStore,e._id,function(r,o){r?"NotFoundError"!==r.name&&(n=r):_.set(e._id,o),t()})})}(function(e){if(e)return n(e);processDocs(p,w,d,_,g,l,i,t,o)})})}),d._allDocs=c(function(e,t){e=clone(e),function(e){f.isClosed()?e(new Error("database is closed")):e(null,f._docCount)}(function(n,r){if(n)return t(n);var o={},i=e.skip||0;if(e.startkey&&(o.gte=e.startkey),e.endkey&&(o.lte=e.endkey),e.key&&(o.gte=o.lte=e.key),e.descending){o.reverse=!0;var a=o.lte;o.lte=o.gte,o.gte=a}var c;if("number"==typeof e.limit&&(c=e.limit),0===c||"start"in o&&"end"in o&&o.start>o.end)return t(null,{total_rows:r,offset:e.skip,rows:[]});var s=[],l=h.docStore.readStream(o),f=through2.obj(function(t,n,r){function o(t){var n={id:a.id,key:a.id,value:{rev:f}};if(e.include_docs){if(n.doc=t,n.doc._rev=n.value.rev,e.conflicts){var o=collectConflicts(a);o.length&&(n.doc._conflicts=o)}for(var i in n.doc._attachments)n.doc._attachments.hasOwnProperty(i)&&(n.doc._attachments[i].stub=!0)}if(!1===e.inclusive_end&&a.id===e.endkey)return r();if(d){if("ok"!==e.deleted)return r();n.value.deleted=!0,n.doc=null}s.push(n),r()}var a=t.value,f=getWinningRev(a),d=getIsDeleted(a,f);if(d){if("ok"!==e.deleted)return void r()}else{if(i-- >0)return void r();if("number"==typeof c&&c--<=0)return l.unpipe(),l.destroy(),void r()}if(e.include_docs){var p=a.rev_map[f];h.bySeqStore.get(u(p),function(e,t){o(t)})}else o()},function(n){PouchPromise$1.resolve().then(function(){if(e.include_docs&&e.attachments)return fetchAttachments(s,h,e)}).then(function(){t(null,{total_rows:r,offset:e.skip,rows:s})},t),n()}).on("unpipe",function(){f.end()});l.on("error",t),l.pipe(f)})}),d._changes=function(e){function t(){e.done=!0,l&&e.limit&&e.limit<i.length&&(i.length=e.limit),g.unpipe(y),g.destroy(),e.continuous||e.cancelled||(e.include_docs&&e.attachments?fetchAttachments(i,h,e).then(function(){e.complete(null,{results:i,last_seq:a})}):e.complete(null,{results:i,last_seq:a}))}if((e=clone(e)).continuous){var n=v+":"+uuid();return levelChanges.addListener(v,n,d,e),levelChanges.notify(v),{cancel:function(){levelChanges.removeListener(v,n)}}}var r,o=e.descending,i=[],a=e.since||0,c=0,s={reverse:o};"limit"in e&&e.limit>0&&(r=e.limit),s.reverse||(s.start=u(e.since||0));var l,p=e.doc_ids&&new ExportedSet(e.doc_ids),_=filterChange(e),m=new ExportedMap;l="return_docs"in e?e.return_docs:!("returnDocs"in e)||e.returnDocs;var g=h.bySeqStore.readStream(s),y=through2.obj(function(n,s,d){function v(t){function n(n){var r=e.processChange(n,t,e);r.seq=t.seq;var o=_(r);if("object"==typeof o)return e.complete(o);o&&(c++,e.attachments&&e.include_docs?fetchAttachments([r],h,e).then(function(){e.onChange(r)}):e.onChange(r),l&&i.push(r)),d()}var r=getWinningRev(t);if(t.seq!==g)return d();if(a=g,r===y._rev)return n(y);var o=t.rev_map[r];h.bySeqStore.get(u(o),function(e,t){n(t)})}if(r&&c>=r)return t(),d();if(e.cancelled||e.done)return d();var g=function(e){return parseInt(e,10)}(n.key),y=n.value;if(g===e.since&&!o)return d();if(p&&!p.has(y._id))return d();var b;if(b=m.get(y._id))return v(b);h.docStore.get(y._id,function(t,n){if(e.cancelled||e.done||f.isClosed()||isLocalId(n.id))return d();m.set(y._id,n),v(n)})},function(t){if(e.cancelled)return t();l&&e.limit&&e.limit<i.length&&(i.length=e.limit),t()}).on("unpipe",function(){y.end(),t()});return g.pipe(y),{cancel:function(){e.cancelled=!0,t()}}},d._close=function(e){if(f.isClosed())return e(createError(NOT_OPEN));f.close(function(t){t?e(t):(_.delete(v),e())})},d._getRevisionTree=function(e,t){h.docStore.get(e,function(e,n){e?t(createError(MISSING_DOC)):t(null,n.rev_tree)})},d._doCompaction=a(function(e,t,n,r){d._doCompactionNoLock(e,t,n,r)}),d._doCompactionNoLock=function(e,t,n,r){if("function"==typeof n&&(r=n,n={}),!t.length)return r();var o=n.ctx||new LevelTransaction;o.get(h.docStore,e,function(i,a){function c(n){if(n&&(p=n),++_===t.length){if(p)return r(p);!function(){function n(e){e&&(i=e),++a===r.length&&s(i)}var r=Object.keys(v);if(!r.length)return s();var i,a=0;var c=new ExportedMap;t.forEach(function(t){c.set(e+"@"+t,!0)}),r.forEach(function(e){o.get(h.attachmentStore,e,function(t,r){if(t)return"NotFoundError"===t.name?n():n(t);var o=Object.keys(r.refs||{}).filter(function(e){return!c.has(e)}),i={};o.forEach(function(e){i[e]=!0}),o.length?d.push({key:e,type:"put",value:{refs:i},prefix:h.attachmentStore}):d=d.concat([{key:e,type:"del",prefix:h.attachmentStore},{key:e,type:"del",prefix:h.binaryStore}]),n()})})}()}}function s(e){return e?r(e):(o.batch(d),n.ctx?r():void o.execute(f,r))}if(i)return r(i);var l=t.map(function(e){var t=a.rev_map[e];return delete a.rev_map[e],t});traverseRevTree(a.rev_tree,function(e,n,r,o,i){var a=n+"-"+r;-1!==t.indexOf(a)&&(i.status="missing")});var d=[];d.push({key:a.id,value:a,type:"put",prefix:h.docStore});var p,v={},_=0;l.forEach(function(e){d.push({key:u(e),type:"del",prefix:h.bySeqStore}),o.get(h.bySeqStore,u(e),function(e,t){if(e)return"NotFoundError"===e.name?c():c(e);Object.keys(t._attachments||{}).forEach(function(e){var n=t._attachments[e].digest;v[n]=!0}),c()})})})},d._getLocal=function(e,t){h.localStore.get(e,function(e,n){e?t(createError(MISSING_DOC)):t(null,n)})},d._putLocal=function(e,t,n){"function"==typeof t&&(n=t,t={}),t.ctx?d._putLocalNoLock(e,t,n):d._putLocalWithLock(e,t,n)},d._putLocalWithLock=a(function(e,t,n){d._putLocalNoLock(e,t,n)}),d._putLocalNoLock=function(e,t,n){delete e._revisions;var r=e._rev,o=e._id,i=t.ctx||new LevelTransaction;i.get(h.localStore,o,function(a,c){if(a&&r)return n(createError(REV_CONFLICT));if(c&&c._rev!==r)return n(createError(REV_CONFLICT));e._rev=r?"0-"+(parseInt(r.split("-")[1],10)+1):"0-1";var u=[{type:"put",prefix:h.localStore,key:o,value:e}];i.batch(u);var s={ok:!0,id:e._id,rev:e._rev};if(t.ctx)return n(null,s);i.execute(f,function(e){if(e)return n(e);n(null,s)})})},d._removeLocal=function(e,t,n){"function"==typeof t&&(n=t,t={}),t.ctx?d._removeLocalNoLock(e,t,n):d._removeLocalWithLock(e,t,n)},d._removeLocalWithLock=a(function(e,t,n){d._removeLocalNoLock(e,t,n)}),d._removeLocalNoLock=function(e,t,n){var r=t.ctx||new LevelTransaction;r.get(h.localStore,e._id,function(o,i){if(o)return n("NotFoundError"!==o.name?o:createError(MISSING_DOC));if(i._rev!==e._rev)return n(createError(REV_CONFLICT));r.batch([{prefix:h.localStore,type:"del",key:e._id}]);var a={ok:!0,id:e._id,rev:"0-0"};if(t.ctx)return n(null,a);r.execute(f,function(e){if(e)return n(e);n(null,a)})})},d._destroy=function(e,t){var n,r=functionName(m);if(!dbStores.has(r))return s(v,t);(n=dbStores.get(r)).has(v)?(levelChanges.removeAllListeners(v),n.get(v).close(function(){n.delete(v),s(v,t)})):s(v,t)}}function formatSeq(e){return("0000000000000000"+e).slice(-16)}function LevelDownPouch(e,t){var n=e.db;if(!n&&(n=requireLeveldown())instanceof Error)return t(n);var r=$inject_Object_assign({db:n,migrate:migrate},e);LevelPouch$1.call(this,r,t)}function applyTypeToBuffer(e,t){e.type=t.headers["content-type"]}function defaultBody(){return bufferFrom("","binary")}function ajaxCore$1(e,t){e=clone(e);return(e=$inject_Object_assign({method:"GET",headers:{},json:!0,processData:!0,timeout:1e4,cache:!1},e)).json&&(e.binary||(e.headers.Accept="application/json"),e.headers["Content-Type"]=e.headers["Content-Type"]||"application/json"),e.binary&&(e.encoding=null,e.json=!1),e.processData||(e.json=!1),request(e,function(n,r,o){if(n)return t(generateErrorFromResponse(n));var i,a=r.headers&&r.headers["content-type"],c=o||defaultBody();if(!e.binary&&(e.json||!e.processData)&&"object"!=typeof c&&(/json/.test(a)||/^[\s]*\{/.test(c)&&/\}[\s]*$/.test(c)))try{c=JSON.parse(c.toString())}catch(e){}r.statusCode>=200&&r.statusCode<300?function(t,n,r){if(!e.binary&&e.json&&"string"==typeof t)try{t=JSON.parse(t)}catch(e){return r(e)}Array.isArray(t)&&(t=t.map(function(e){return e.error||e.missing?generateErrorFromResponse(e):e})),e.binary&&applyTypeToBuffer(t,n),r(null,t,n)}(c,r,t):((i=generateErrorFromResponse(c)).status=r.statusCode,t(i))})}function ajax(e,t){return ajaxCore$1(e,t)}function pool(e,t){return new PouchPromise$1(function(n,r){function o(){l++,e[f++]().then(a,c)}function i(){++d===h?s?r(s):n():u()}function a(){l--,i()}function c(e){l--,s=s||e,i()}function u(){for(;l<t&&f<h;)o()}var s,l=0,f=0,d=0,h=e.length;u()})}function readAttachmentsAsBlobOrBuffer(e){var t=e.doc&&e.doc._attachments;t&&Object.keys(t).forEach(function(e){var n=t[e];n.data=b64ToBluffer(n.data,n.content_type)})}function encodeDocId(e){return/^_design/.test(e)?"_design/"+encodeURIComponent(e.slice(8)):/^_local/.test(e)?"_local/"+encodeURIComponent(e.slice(7)):encodeURIComponent(e)}function preprocessAttachments$2(e){return e._attachments&&Object.keys(e._attachments)?PouchPromise$1.all(Object.keys(e._attachments).map(function(t){var n=e._attachments[t];if(n.data&&"string"!=typeof n.data)return new PouchPromise$1(function(e){blobToBase64(n.data,e)}).then(function(e){n.data=e})})):PouchPromise$1.resolve()}function hasUrlPrefix(e){if(!e.prefix)return!1;var t=parseUri(e.prefix).protocol;return"http"===t||"https"===t}function getHost(e,t){if(hasUrlPrefix(t)){var n=t.name.substr(t.prefix.length);e=t.prefix+encodeURIComponent(n)}var r=parseUri(e);(r.user||r.password)&&(r.auth={username:r.user,password:r.password});var o=r.path.replace(/(^\/|\/$)/g,"").split("/");return r.db=o.pop(),-1===r.db.indexOf("%")&&(r.db=encodeURIComponent(r.db)),r.path=o.join("/"),r}function genDBUrl(e,t){return genUrl(e,e.db+"/"+t)}function genUrl(e,t){var n=e.path?"/":"";return e.protocol+"://"+e.host+(e.port?":"+e.port:"")+"/"+e.path+n+t}function paramsToStr(e){return"?"+Object.keys(e).map(function(t){return t+"="+encodeURIComponent(e[t])}).join("&")}function HttpPouch(e,t){function n(e,t,n){var r=e.ajax||{},o=$inject_Object_assign(clone(l),r,t),i=clone(l.headers||{});return o.headers=$inject_Object_assign(i,r.headers,t.headers||{}),c.constructor.listeners("debug").length&&c.constructor.emit("debug",["http",o.method,o.url]),c._ajax(o,n)}function r(e,t){return new PouchPromise$1(function(r,o){n(e,t,function(e,t){if(e)return o(e);r(t)})})}function o(e,t){return adapterFun(e,getArguments(function(e){i().then(function(){return t.apply(this,e)}).catch(function(t){e.pop()(t)})}))}function i(){if(e.skipSetup||e.skip_setup)return PouchPromise$1.resolve();if(p)return p;return(p=r({},{method:"GET",url:s}).catch(function(e){return e&&e.status&&404===e.status?(res(404,"PouchDB is just detecting if the remote exists."),r({},{method:"PUT",url:s})):PouchPromise$1.reject(e)}).catch(function(e){return!(!e||!e.status||412!==e.status)||PouchPromise$1.reject(e)})).catch(function(){p=null}),p}function a(e){return e.split("/").map(encodeURIComponent).join("/")}var c=this,u=getHost(e.name,e),s=genDBUrl(u,""),l=(e=clone(e)).ajax||{};if(e.auth||u.auth){var f=e.auth||u.auth,d=f.username+":"+f.password,h=thisBtoa(unescape(encodeURIComponent(d)));l.headers=l.headers||{},l.headers.Authorization="Basic "+h}c._ajax=ajax;var p;nextTick(function(){t(null,c)}),c._remote=!0,c.type=function(){return"http"},c.id=o("id",function(e){n({},{method:"GET",url:genUrl(u,"")},function(t,n){var r=n&&n.uuid?n.uuid+u.db:genDBUrl(u,"");e(null,r)})}),c.request=o("request",function(e,t){e.url=genDBUrl(u,e.url),n({},e,t)}),c.compact=o("compact",function(e,t){"function"==typeof e&&(t=e,e={}),n(e=clone(e),{url:genDBUrl(u,"_compact"),method:"POST"},function(){function n(){c.info(function(r,o){o&&!o.compact_running?t(null,{ok:!0}):setTimeout(n,e.interval||200)})}n()})}),c.bulkGet=adapterFun("bulkGet",function(e,t){function r(t){var r={};e.revs&&(r.revs=!0),e.attachments&&(r.attachments=!0),e.latest&&(r.latest=!0),n(e,{url:genDBUrl(u,"_bulk_get"+paramsToStr(r)),method:"POST",body:{docs:e.docs}},t)}function o(){function n(e){return function(n,r){c[e]=r.results,++a===o&&t(null,{results:flatten(c)})}}for(var r=MAX_SIMULTANEOUS_REVS,o=Math.ceil(e.docs.length/r),a=0,c=new Array(o),u=0;u<o;u++){var s=pick(e,["revs","attachments","latest"]);s.ajax=l,s.docs=e.docs.slice(u*r,Math.min(e.docs.length,(u+1)*r)),bulkGet(i,s,n(u))}}var i=this,a=genUrl(u,""),c=supportsBulkGetMap[a];"boolean"!=typeof c?r(function(e,n){e?(supportsBulkGetMap[a]=!1,res(e.status,"PouchDB is just detecting if the remote supports the _bulk_get API."),o()):(supportsBulkGetMap[a]=!0,t(null,n))}):c?r(t):o()}),c._info=function(e){i().then(function(){n({},{method:"GET",url:genDBUrl(u,"")},function(t,n){if(t)return e(t);n.host=genDBUrl(u,""),e(null,n)})}).catch(e)},c.get=o("get",function(e,t,n){function o(e){var n=e._attachments,o=n&&Object.keys(n);if(n&&o.length){return pool(o.map(function(o){return function(){return function(o){var i=n[o],c=encodeDocId(e._id)+"/"+a(o)+"?rev="+e._rev;return r(t,{method:"GET",url:genDBUrl(u,c),binary:!0}).then(function(e){return t.binary?e:new PouchPromise$1(function(t){blobToBase64(e,t)})}).then(function(e){delete i.stub,delete i.length,i.data=e})}(o)}}),5)}}"function"==typeof t&&(n=t,t={});var i={};(t=clone(t)).revs&&(i.revs=!0),t.revs_info&&(i.revs_info=!0),t.latest&&(i.latest=!0),t.open_revs&&("all"!==t.open_revs&&(t.open_revs=JSON.stringify(t.open_revs)),i.open_revs=t.open_revs),t.rev&&(i.rev=t.rev),t.conflicts&&(i.conflicts=t.conflicts),e=encodeDocId(e);var c={method:"GET",url:genDBUrl(u,e+paramsToStr(i))};r(t,c).then(function(e){return PouchPromise$1.resolve().then(function(){if(t.attachments)return function(e){return Array.isArray(e)?PouchPromise$1.all(e.map(function(e){if(e.ok)return o(e.ok)})):o(e)}(e)}).then(function(){n(null,e)})}).catch(function(t){t.docId=e,n(t)})}),c.remove=o("remove",function(e,t,r,o){var i;"string"==typeof t?(i={_id:e,_rev:t},"function"==typeof r&&(o=r,r={})):(i=e,"function"==typeof t?(o=t,r={}):(o=r,r=t));var a=i._rev||r.rev;n(r,{method:"DELETE",url:genDBUrl(u,encodeDocId(i._id))+"?rev="+a},o)}),c.getAttachment=o("getAttachment",function(e,t,r,o){"function"==typeof r&&(o=r,r={});var i=r.rev?"?rev="+r.rev:"";n(r,{method:"GET",url:genDBUrl(u,encodeDocId(e))+"/"+a(t)+i,binary:!0},o)}),c.removeAttachment=o("removeAttachment",function(e,t,r,o){n({},{method:"DELETE",url:genDBUrl(u,encodeDocId(e)+"/"+a(t))+"?rev="+r},o)}),c.putAttachment=o("putAttachment",function(e,t,r,o,i,c){"function"==typeof i&&(c=i,i=o,o=r,r=null);var s=encodeDocId(e)+"/"+a(t),f=genDBUrl(u,s);if(r&&(f+="?rev="+r),"string"==typeof o){var d;try{d=thisAtob(o)}catch(e){return c(createError(BAD_ARG,"Attachment is not a valid base64 string"))}o=d?binStringToBluffer(d,i):""}n({},{headers:{"Content-Type":i},method:"PUT",url:f,processData:!1,body:o,timeout:l.timeout||6e4},c)}),c._bulkDocs=function(e,t,r){e.new_edits=t.new_edits,i().then(function(){return PouchPromise$1.all(e.docs.map(preprocessAttachments$2))}).then(function(){n(t,{method:"POST",url:genDBUrl(u,"_bulk_docs"),timeout:t.timeout,body:e},function(e,t){if(e)return r(e);t.forEach(function(e){e.ok=!0}),r(null,t)})}).catch(r)},c._put=function(e,t,r){i().then(function(){return preprocessAttachments$2(e)}).then(function(){n(t,{method:"PUT",url:genDBUrl(u,encodeDocId(e._id)),body:e},function(t,n){if(t)return t.docId=e&&e._id,r(t);r(null,n)})}).catch(r)},c.allDocs=o("allDocs",function(e,t){"function"==typeof e&&(t=e,e={});var n,o={},i="GET";(e=clone(e)).conflicts&&(o.conflicts=!0),e.descending&&(o.descending=!0),e.include_docs&&(o.include_docs=!0),e.attachments&&(o.attachments=!0),e.key&&(o.key=JSON.stringify(e.key)),e.start_key&&(e.startkey=e.start_key),e.startkey&&(o.startkey=JSON.stringify(e.startkey)),e.end_key&&(e.endkey=e.end_key),e.endkey&&(o.endkey=JSON.stringify(e.endkey)),void 0!==e.inclusive_end&&(o.inclusive_end=!!e.inclusive_end),void 0!==e.limit&&(o.limit=e.limit),void 0!==e.skip&&(o.skip=e.skip);var a=paramsToStr(o);void 0!==e.keys&&(i="POST",n={keys:e.keys}),r(e,{method:i,url:genDBUrl(u,"_all_docs"+a),body:n}).then(function(n){e.include_docs&&e.attachments&&e.binary&&n.rows.forEach(readAttachmentsAsBlobOrBuffer),t(null,n)}).catch(t)}),c._changes=function(e){var t="batch_size"in e?e.batch_size:CHANGES_BATCH_SIZE;!(e=clone(e)).continuous||"heartbeat"in e||(e.heartbeat=DEFAULT_HEARTBEAT);var r="timeout"in e?e.timeout:"timeout"in l?l.timeout:3e4;"timeout"in e&&e.timeout&&r-e.timeout<CHANGES_TIMEOUT_BUFFER&&(r=e.timeout+CHANGES_TIMEOUT_BUFFER),"heartbeat"in e&&e.heartbeat&&r-e.heartbeat<CHANGES_TIMEOUT_BUFFER&&(r=e.heartbeat+CHANGES_TIMEOUT_BUFFER);var o={};"timeout"in e&&e.timeout&&(o.timeout=e.timeout);var a,c=void 0!==e.limit&&e.limit;a="return_docs"in e?e.return_docs:!("returnDocs"in e)||e.returnDocs;var s=c;if(e.style&&(o.style=e.style),(e.include_docs||e.filter&&"function"==typeof e.filter)&&(o.include_docs=!0),e.attachments&&(o.attachments=!0),e.continuous&&(o.feed="longpoll"),e.conflicts&&(o.conflicts=!0),e.descending&&(o.descending=!0),"heartbeat"in e&&e.heartbeat&&(o.heartbeat=e.heartbeat),e.filter&&"string"==typeof e.filter&&(o.filter=e.filter),e.view&&"string"==typeof e.view&&(o.filter="_view",o.view=e.view),e.query_params&&"object"==typeof e.query_params)for(var f in e.query_params)e.query_params.hasOwnProperty(f)&&(o[f]=e.query_params[f]);var d,h="GET";e.doc_ids?(o.filter="_doc_ids",h="POST",d={doc_ids:e.doc_ids}):e.selector&&(o.filter="_selector",h="POST",d={selector:e.selector});var p,v,_=function(a,l){if(!e.aborted){o.since=a,"object"==typeof o.since&&(o.since=JSON.stringify(o.since)),e.descending?c&&(o.limit=s):o.limit=!c||s>t?t:s;var f={method:h,url:genDBUrl(u,"_changes"+paramsToStr(o)),timeout:r,body:d};v=a,e.aborted||i().then(function(){p=n(e,f,l)}).catch(l)}},m={results:[]},g=function(n,r){if(!e.aborted){var o=0;if(r&&r.results){o=r.results.length,m.last_seq=r.last_seq;({}).query=e.query_params,r.results=r.results.filter(function(t){s--;var n=filterChange(e)(t);return n&&(e.include_docs&&e.attachments&&e.binary&&readAttachmentsAsBlobOrBuffer(t),a&&m.results.push(t),e.onChange(t)),n})}else if(n)return e.aborted=!0,void e.complete(n);r&&r.last_seq&&(v=r.last_seq);var i=c&&s<=0||r&&o<t||e.descending;(!e.continuous||c&&s<=0)&&i?e.complete(null,m):nextTick(function(){_(v,g)})}};return _(e.since||0,g),{cancel:function(){e.aborted=!0,p&&p.abort()}}},c.revsDiff=o("revsDiff",function(e,t,r){"function"==typeof t&&(r=t,t={}),n(t,{method:"POST",url:genDBUrl(u,"_revs_diff"),body:e},r)}),c._close=function(e){e()},c._destroy=function(e,t){n(e,{url:genDBUrl(u,""),method:"DELETE"},function(e,n){if(e&&e.status&&404!==e.status)return t(e);t(null,n)})}}function QueryParseError(e){this.status=400,this.name="query_parse_error",this.message=e,this.error=!0;try{Error.captureStackTrace(this,QueryParseError)}catch(e){}}function NotFoundError$2(e){this.status=404,this.name="not_found",this.message=e,this.error=!0;try{Error.captureStackTrace(this,NotFoundError$2)}catch(e){}}function BuiltInError(e){this.status=500,this.name="invalid_value",this.message=e,this.error=!0;try{Error.captureStackTrace(this,BuiltInError)}catch(e){}}function promisedCallback(e,t){return t&&e.then(function(e){nextTick(function(){t(null,e)})},function(e){nextTick(function(){t(e)})}),e}function callbackify(e){return getArguments(function(t){var n=t.pop(),r=e.apply(this,t);return"function"==typeof n&&promisedCallback(r,n),r})}function fin(e,t){return e.then(function(e){return t().then(function(){return e})},function(e){return t().then(function(){throw e})})}function sequentialize(e,t){return function(){var n=arguments,r=this;return e.add(function(){return t.apply(r,n)})}}function uniq(e){var t=new ExportedSet(e),n=new Array(t.size),r=-1;return t.forEach(function(e){n[++r]=e}),n}function mapToKeysArray(e){var t=new Array(e.size),n=-1;return e.forEach(function(e,r){t[++n]=r}),t}function createBuiltInError(e){return new BuiltInError("builtin "+e+" function requires map values to be numbers or number arrays")}function sum(e){for(var t=0,n=0,r=e.length;n<r;n++){var o=e[n];if("number"!=typeof o){if(!Array.isArray(o))throw createBuiltInError("_sum");t="number"==typeof t?[t]:t;for(var i=0,a=o.length;i<a;i++){var c=o[i];if("number"!=typeof c)throw createBuiltInError("_sum");void 0===t[i]?t.push(c):t[i]+=c}}else"number"==typeof t?t+=o:t[0]+=o}return t}function createBuiltInErrorInVm(e){return{builtInError:!0,name:e}}function convertToTrueError(e){return createBuiltInError(e.name)}function isBuiltInError(e){return e&&e.builtInError}function evalFunctionInVm(e,t){return function(n,r,o){var i='(function() {"use strict";var createBuiltInError = '+createBuiltInErrorInVm.toString()+";var sum = "+sum.toString()+";var log = function () {};var isArray = Array.isArray;var toJSON = JSON.parse;var __emitteds__ = [];var emit = function (key, value) {__emitteds__.push([key, value]);};var __result__ = ("+e.replace(/;\s*$/,"")+")("+JSON.stringify(n)+","+JSON.stringify(r)+","+JSON.stringify(o)+");return {result: __result__, emitteds: __emitteds__};})()",a=vm.runInNewContext(i);return a.emitteds.forEach(function(e){t(e[0],e[1])}),isBuiltInError(a.result)&&(a.result=convertToTrueError(a.result)),a.result}}function TaskQueue$2(){this.promise=new PouchPromise$1(function(e){e()})}function stringify(e){if(!e)return"undefined";switch(typeof e){case"function":case"string":return e.toString();default:return JSON.stringify(e)}}function createViewSignature(e,t){return stringify(e)+stringify(t)+"undefined"}function createView(e,t,n,r,o,i){var a,c=createViewSignature(n,r);if(!o&&(a=e._cachedViews=e._cachedViews||{})[c])return a[c];var u=e.info().then(function(u){var s=u.db_name+"-mrview-"+(o?"temp":stringMd5(c));return upsert(e,"_local/"+i,function(e){e.views=e.views||{};var n=t;-1===n.indexOf("/")&&(n=t+"/"+t);var r=e.views[n]=e.views[n]||{};if(!r[s])return r[s]=!0,e}).then(function(){return e.registerDependentDatabase(s).then(function(t){var o=t.db;o.auto_compaction=!0;var i={name:s,db:o,sourceDB:e,adapter:e.adapter,mapFun:n,reduceFun:r};return i.db.get("_local/lastSeq").catch(function(e){if(404!==e.status)throw e}).then(function(e){return i.seq=e?e.seq:0,a&&i.db.once("destroyed",function(){delete a[c]}),i})})})});return a&&(a[c]=u),u}function parseViewName(e){return-1===e.indexOf("/")?[e,e]:e.split("/")}function isGenOne(e){return 1===e.length&&/^1-/.test(e[0].rev)}function emitError(e,t){try{e.emit("error",t)}catch(e){guardedConsole("error","The user's map/reduce function threw an uncaught error.\nYou can debug this error by doing:\nmyDatabase.on('error', function (err) { debugger; });\nPlease double-check your map/reduce function."),guardedConsole("error",t)}}function createAbstractMapReduce(e,t,n,r){function o(e,t,n){try{t(n)}catch(t){emitError(e,t)}}function i(e,t,n,r,o){try{return{output:t(n,r,o)}}catch(t){return emitError(e,t),{error:t}}}function a(e,t){var n=collate(e.key,t.key);return 0!==n?n:collate(e.value,t.value)}function c(e){var t=e.value;return t&&"object"==typeof t&&t._id||e.id}function u(e){return function(t){return e.include_docs&&e.attachments&&e.binary&&function(e){e.rows.forEach(function(e){var t=e.doc&&e.doc._attachments;t&&Object.keys(t).forEach(function(e){var n=t[e];t[e].data=b64ToBluffer(n.data,n.content_type)})})}(t),t}}function s(e,t,n,r){var o=t[e];void 0!==o&&(r&&(o=encodeURIComponent(JSON.stringify(o))),n.push(e+"="+o))}function l(e){if(void 0!==e){var t=Number(e);return isNaN(t)||t!==parseInt(e,10)?e:t}}function f(e,t){var n=e.descending?"endkey":"startkey",r=e.descending?"startkey":"endkey";if(void 0!==e[n]&&void 0!==e[r]&&collate(e[n],e[r])>0)throw new QueryParseError("No rows can match your key range, reverse your start_key and end_key or set {descending : true}");if(t.reduce&&!1!==e.reduce){if(e.include_docs)throw new QueryParseError("{include_docs:true} is invalid for reduce");if(e.keys&&e.keys.length>1&&!e.group&&!e.group_level)throw new QueryParseError("Multi-key fetches for reduce views must use {group: true}")}["group_level","limit","skip"].forEach(function(t){var n=function(e){if(e){if("number"!=typeof e)return new QueryParseError('Invalid value for integer: "'+e+'"');if(e<0)return new QueryParseError('Invalid value for positive integer: "'+e+'"')}}(e[t]);if(n)throw n})}function d(e){return function(t){if(404===t.status)return e;throw t}}function h(e,t,n){var r="_local/doc_"+e,o={_id:r,keys:[]},i=n.get(e),a=i[0];return(isGenOne(i[1])?PouchPromise$1.resolve(o):t.db.get(r).catch(d(o))).then(function(e){return function(e){return e.keys.length?t.db.allDocs({keys:e.keys,include_docs:!0}):PouchPromise$1.resolve({rows:[]})}(e).then(function(t){return function(e,t){for(var n=[],r=new ExportedSet,o=0,i=t.rows.length;o<i;o++){var c=t.rows[o].doc;if(c&&(n.push(c),r.add(c._id),c._deleted=!a.has(c._id),!c._deleted)){var u=a.get(c._id);"value"in u&&(c.value=u.value)}}var s=mapToKeysArray(a);return s.forEach(function(e){if(!r.has(e)){var t={_id:e},o=a.get(e);"value"in o&&(t.value=o.value),n.push(t)}}),e.keys=uniq(s.concat(e.keys)),n.push(e),n}(e,t)})})}function p(e){var t="string"==typeof e?e:e.name,n=persistentQueues[t];return n||(n=persistentQueues[t]=new TaskQueue$2),n}function v(e){return sequentialize(p(e),function(){return function(e){function n(t,n){return function(){return function(e,t,n){return e.db.get("_local/lastSeq").catch(d({_id:"_local/lastSeq",seq:0})).then(function(r){var o=mapToKeysArray(t);return PouchPromise$1.all(o.map(function(n){return h(n,e,t)})).then(function(t){var o=flatten(t);return r.seq=n,o.push(r),e.db.bulkDocs({docs:o})})})}(e,t,n)}}function r(){return e.sourceDB.changes({conflicts:!0,include_docs:!0,style:"all_docs",since:l,limit:CHANGES_BATCH_SIZE$1}).then(i)}function i(t){var i=t.results;if(i.length){var d=function(t){for(var n=new ExportedMap,r=0,i=t.length;r<i;r++){var f=t[r];if("_"!==f.doc._id[0]){c=[],(u=f.doc)._deleted||o(e.sourceDB,s,u),c.sort(a);var d=function(e){for(var t,n=new ExportedMap,r=0,o=e.length;r<o;r++){var i=e[r],a=[i.key,i.id];r>0&&0===collate(i.key,t)&&a.push(r),n.set(toIndexableString(a),i),t=i.key}return n}(c);n.set(f.doc._id,[d,f.changes])}l=f.seq}return n}(i);if(f.add(n(d,l)),!(i.length<CHANGES_BATCH_SIZE$1))return r()}}var c,u;var s=t(e.mapFun,function(e,t){var n={id:u._id,key:normalizeKey(e)};void 0!==t&&null!==t&&(n.value=normalizeKey(t));c.push(n)}),l=e.seq||0;var f=new TaskQueue$2;return r().then(function(){return f.finish()}).then(function(){e.seq=l})}(e)})()}function _(e,t){return sequentialize(p(e),function(){return function(e,t){function r(t){return t.include_docs=!0,e.db.allDocs(t).then(function(e){return a=e.total_rows,e.rows.map(function(e){if("value"in e.doc&&"object"==typeof e.doc.value&&null!==e.doc.value){var t=Object.keys(e.doc.value).sort(),n=["id","key","value"];if(!(t<n||t>n))return e.doc.value}var r=parseIndexableString(e.doc._id);return{key:r[0],id:r[1],value:"value"in e.doc?e.doc.value:null}})})}function o(r){var o;if(o=u?function(e,t,r){0===r.group_level&&delete r.group_level;var o=r.group||r.group_level,a=n(e.reduceFun),c=[],u=isNaN(r.group_level)?Number.POSITIVE_INFINITY:r.group_level;t.forEach(function(e){var t=c[c.length-1],n=o?e.key:null;if(o&&Array.isArray(n)&&(n=n.slice(0,u)),t&&0===collate(t.groupKey,n))return t.keys.push([e.key,e.id]),void t.values.push(e.value);c.push({keys:[[e.key,e.id]],values:[e.value],groupKey:n})}),t=[];for(var s=0,l=c.length;s<l;s++){var f=c[s],d=i(e.sourceDB,a,f.keys,f.values,!1);if(d.error&&d.error instanceof BuiltInError)throw d.error;t.push({value:d.error?null:d.output,key:f.groupKey})}return{rows:function(e,t,n){return n=n||0,"number"==typeof t?e.slice(n,t+n):n>0?e.slice(n):e}(t,r.limit,r.skip)}}(e,r,t):{total_rows:a,offset:s,rows:r},t.include_docs){var l=uniq(r.map(c));return e.sourceDB.allDocs({keys:l,include_docs:!0,conflicts:t.conflicts,attachments:t.attachments,binary:t.binary}).then(function(e){var t=new ExportedMap;return e.rows.forEach(function(e){t.set(e.id,e.doc)}),r.forEach(function(e){var n=c(e),r=t.get(n);r&&(e.doc=r)}),o})}return o}var a,u=e.reduceFun&&!1!==t.reduce,s=t.skip||0;void 0===t.keys||t.keys.length||(t.limit=0,delete t.keys);{if(void 0!==t.keys){var l=t.keys.map(function(e){return r({startkey:toIndexableString([e]),endkey:toIndexableString([e,{}])})});return PouchPromise$1.all(l).then(flatten).then(o)}var f,d,h={descending:t.descending};if("start_key"in t&&(f=t.start_key),"startkey"in t&&(f=t.startkey),"end_key"in t&&(d=t.end_key),"endkey"in t&&(d=t.endkey),void 0!==f&&(h.startkey=toIndexableString(t.descending?[f,{}]:[f])),void 0!==d){var p=!1!==t.inclusive_end;t.descending&&(p=!p),h.endkey=toIndexableString(p?[d,{}]:[d])}if(void 0!==t.key){var v=toIndexableString([t.key]),_=toIndexableString([t.key,{}]);h.descending?(h.endkey=v,h.startkey=_):(h.startkey=v,h.endkey=_)}return u||("number"==typeof t.limit&&(h.limit=t.limit),h.skip=s),r(h).then(o)}}(e,t)})()}function m(t,n,o){if("function"==typeof t._query)return function(e,t,n){return new PouchPromise$1(function(r,o){e._query(t,n,function(e,t){if(e)return o(e);r(t)})})}(t,n,o);if(isRemote(t))return function(e,t,n){var r,o=[],i="GET";if(s("reduce",n,o),s("include_docs",n,o),s("attachments",n,o),s("limit",n,o),s("descending",n,o),s("group",n,o),s("group_level",n,o),s("skip",n,o),s("stale",n,o),s("conflicts",n,o),s("startkey",n,o,!0),s("start_key",n,o,!0),s("endkey",n,o,!0),s("end_key",n,o,!0),s("inclusive_end",n,o),s("key",n,o,!0),o=o.join("&"),o=""===o?"":"?"+o,void 0!==n.keys){var a="keys="+encodeURIComponent(JSON.stringify(n.keys));a.length+o.length+1<=2e3?o+=("?"===o[0]?"&":"?")+a:(i="POST","string"==typeof t?r={keys:n.keys}:t.keys=n.keys)}if("string"==typeof t){var c=parseViewName(t);return e.request({method:i,url:"_design/"+c[0]+"/_view/"+c[1]+o,body:r}).then(function(e){return e.rows.forEach(function(e){if(e.value&&e.value.error&&"builtin_reduce_error"===e.value.error)throw new Error(e.reason)}),e}).then(u(n))}return r=r||{},Object.keys(t).forEach(function(e){Array.isArray(t[e])?r[e]=t[e]:r[e]=t[e].toString()}),e.request({method:"POST",url:"_temp_view"+o,body:r}).then(u(n))}(t,n,o);if("string"!=typeof n)return f(o,n),tempViewQueue.add(function(){return createView(t,"temp_view/temp_view",n.map,n.reduce,!0,e).then(function(e){return fin(v(e).then(function(){return _(e,o)}),function(){return e.db.destroy()})})}),tempViewQueue.finish();var i=n,a=parseViewName(i),c=a[0],l=a[1];return t.get("_design/"+c).then(function(n){var a=n.views&&n.views[l];if(!a)throw new NotFoundError$2("ddoc "+n._id+" has no view named "+l);r(n,l),f(o,a);return createView(t,i,a.map,a.reduce,!1,e).then(function(e){return"ok"===o.stale||"update_after"===o.stale?("update_after"===o.stale&&nextTick(function(){v(e)}),_(e,o)):v(e).then(function(){return _(e,o)})})})}return{query:function(e,t,n){var r=this;"function"==typeof t&&(n=t,t={}),t=t?function(e){return e.group_level=l(e.group_level),e.limit=l(e.limit),e.skip=l(e.skip),e}(t):{},"function"==typeof e&&(e={map:e});var o=PouchPromise$1.resolve().then(function(){return m(r,e,t)});return promisedCallback(o,n),o},viewCleanup:callbackify(function(){var t=this;return"function"==typeof t._viewCleanup?function(e){return new PouchPromise$1(function(t,n){e._viewCleanup(function(e,r){if(e)return n(e);t(r)})})}(t):isRemote(t)?function(e){return e.request({method:"POST",url:"_view_cleanup"})}(t):function(t){return t.get("_local/"+e).then(function(e){var n=new ExportedMap;Object.keys(e.views).forEach(function(e){var t=parseViewName(e),r="_design/"+t[0],o=t[1],i=n.get(r);i||(i=new ExportedSet,n.set(r,i)),i.add(o)});var r={keys:mapToKeysArray(n),include_docs:!0};return t.allDocs(r).then(function(r){var o={};r.rows.forEach(function(t){var r=t.key.substring(8);n.get(t.key).forEach(function(n){var i=r+"/"+n;e.views[i]||(i=n);var a=Object.keys(e.views[i]),c=t.doc&&t.doc.views&&t.doc.views[n];a.forEach(function(e){o[e]=o[e]||c})})});var i=Object.keys(o).filter(function(e){return!o[e]}).map(function(e){return sequentialize(p(e),function(){return new t.constructor(e,t.__opts).destroy()})()});return PouchPromise$1.all(i).then(function(){return{ok:!0}})})},d({ok:!0}))}(t)})}}function getBuiltIn(e){if(/^_sum/.test(e))return builtInReduce._sum;if(/^_count/.test(e))return builtInReduce._count;if(/^_stats/.test(e))return builtInReduce._stats;if(/^_/.test(e))throw new Error(e+" is not a supported reduce function.")}function mapper(e,t){if("function"==typeof e&&2===e.length){var n=e;return function(e){return n(e,t)}}return evalFunction(e.toString(),t)}function reducer(e){var t=e.toString(),n=getBuiltIn(t);return n||evalFunction(t)}function ddocValidator(e,t){var n=e.views&&e.views[t];if("string"!=typeof n.map)throw new NotFoundError$2("ddoc "+e._id+" has no string view named "+t+", instead found object of type: "+typeof n.map)}function query(e,t,n){return abstract.query.call(this,e,t,n)}function viewCleanup(e){return abstract.viewCleanup.call(this,e)}function isGenOne$1(e){return/^1-/.test(e)}function fileHasChanged(e,t,n){return!e._attachments||!e._attachments[n]||e._attachments[n].digest!==t._attachments[n].digest}function getDocAttachments(e,t){var n=Object.keys(t._attachments);return PouchPromise$1.all(n.map(function(n){return e.getAttachment(t._id,n,{rev:t._rev})}))}function getDocAttachmentsFromTargetOrSource(e,t,n){var r=isRemote(t)&&!isRemote(e),o=Object.keys(n._attachments);return r?e.get(n._id).then(function(r){return PouchPromise$1.all(o.map(function(o){return fileHasChanged(r,n,o)?t.getAttachment(n._id,o):e.getAttachment(r._id,o)}))}).catch(function(e){if(404!==e.status)throw e;return getDocAttachments(t,n)}):getDocAttachments(t,n)}function createBulkGetOpts(e){var t=[];return Object.keys(e).forEach(function(n){e[n].missing.forEach(function(e){t.push({id:n,rev:e})})}),{docs:t,revs:!0,latest:!0}}function getDocs(e,t,n,r){function o(t){return e.allDocs({keys:t,include_docs:!0,conflicts:!0}).then(function(e){if(r.cancelled)throw new Error("cancelled");e.rows.forEach(function(e){e.deleted||!e.doc||!isGenOne$1(e.value.rev)||function(e){return e._attachments&&Object.keys(e._attachments).length>0}(e.doc)||function(e){return e._conflicts&&e._conflicts.length>0}(e.doc)||(e.doc._conflicts&&delete e.doc._conflicts,i.push(e.doc),delete n[e.id])})})}n=clone(n);var i=[],a=!0;return PouchPromise$1.resolve().then(function(){var e=Object.keys(n).filter(function(e){var t=n[e].missing;return 1===t.length&&isGenOne$1(t[0])});if(e.length>0)return o(e)}).then(function(){var o=createBulkGetOpts(n);if(o.docs.length)return e.bulkGet(o).then(function(n){if(r.cancelled)throw new Error("cancelled");return PouchPromise$1.all(n.results.map(function(n){return PouchPromise$1.all(n.docs.map(function(n){var r=n.ok;return n.error&&(a=!1),r&&r._attachments?getDocAttachmentsFromTargetOrSource(t,e,r).then(function(e){var t=Object.keys(r._attachments);return e.forEach(function(e,n){var o=r._attachments[t[n]];delete o.stub,delete o.length,o.data=e}),r}):r}))})).then(function(e){i=i.concat(flatten(e).filter(Boolean))})})}).then(function(){return{ok:a,docs:i}})}function updateCheckpoint(e,t,n,r,o){return e.get(t).catch(function(n){if(404===n.status)return"http"!==e.adapter&&"https"!==e.adapter||res(404,"PouchDB is just checking if a remote checkpoint exists."),{session_id:r,_id:t,history:[],replicator:REPLICATOR,version:CHECKPOINT_VERSION};throw n}).then(function(i){if(!o.cancelled&&i.last_seq!==n)return i.history=(i.history||[]).filter(function(e){return e.session_id!==r}),i.history.unshift({last_seq:n,session_id:r}),i.history=i.history.slice(0,CHECKPOINT_HISTORY_SIZE),i.version=CHECKPOINT_VERSION,i.replicator=REPLICATOR,i.session_id=r,i.last_seq=n,e.put(i).catch(function(i){if(409===i.status)return updateCheckpoint(e,t,n,r,o);throw i})})}function Checkpointer(e,t,n,r,o){this.src=e,this.target=t,this.id=n,this.returnValue=r,this.opts=o}function compareReplicationLogs(e,t){return e.session_id===t.session_id?{last_seq:e.last_seq,history:e.history}:compareReplicationHistory(e.history,t.history)}function compareReplicationHistory(e,t){var n=e[0],r=e.slice(1),o=t[0],i=t.slice(1);if(!n||0===t.length)return{last_seq:LOWEST_SEQ,history:[]};if(hasSessionId(n.session_id,t))return{last_seq:n.last_seq,history:e};return hasSessionId(o.session_id,r)?{last_seq:o.last_seq,history:i}:compareReplicationHistory(r,i)}function hasSessionId(e,t){var n=t[0],r=t.slice(1);return!(!e||0===t.length)&&(e===n.session_id||hasSessionId(e,r))}function isForbiddenError(e){return"number"==typeof e.status&&4===Math.floor(e.status/100)}function backOff(e,t,n,r){if(!1===e.retry)return t.emit("error",n),void t.removeAllListeners();if("function"!=typeof e.back_off_function&&(e.back_off_function=defaultBackOff),t.emit("requestError",n),"active"===t.state||"pending"===t.state){t.emit("paused",n),t.state="stopped";var o=function(){e.current_back_off=STARTING_BACK_OFF};t.once("paused",function(){t.removeListener("active",o)}),t.once("active",o)}e.current_back_off=e.current_back_off||STARTING_BACK_OFF,e.current_back_off=e.back_off_function(e.current_back_off),setTimeout(r,e.current_back_off)}function sortObjectPropertiesByKey(e){return Object.keys(e).sort(collate).reduce(function(t,n){return t[n]=e[n],t},{})}function generateReplicationId(e,t,n){var r=n.doc_ids?n.doc_ids.sort(collate):"",o=n.filter?n.filter.toString():"",i="",a="",c="";return n.selector&&(c=JSON.stringify(n.selector)),n.filter&&n.query_params&&(i=JSON.stringify(sortObjectPropertiesByKey(n.query_params))),n.filter&&"_view"===n.filter&&(a=n.view.toString()),PouchPromise$1.all([e.id(),t.id()]).then(function(e){var t=e[0]+e[1]+o+a+i+r+c;return new PouchPromise$1(function(e){binaryMd5(t,e)})}).then(function(e){return"_local/"+(e=e.replace(/\//g,".").replace(/\+/g,"_"))})}function replicate(e,t,n,r,o){function i(){return E?PouchPromise$1.resolve():generateReplicationId(e,t,n).then(function(o){b=o;var i={};i=!1===n.checkpoint?{writeSourceCheckpoint:!1,writeTargetCheckpoint:!1}:"source"===n.checkpoint?{writeSourceCheckpoint:!0,writeTargetCheckpoint:!1}:"target"===n.checkpoint?{writeSourceCheckpoint:!1,writeTargetCheckpoint:!0}:{writeSourceCheckpoint:!0,writeTargetCheckpoint:!0},E=new Checkpointer(e,t,b,r,i)})}function a(){if(B=[],0!==y.docs.length){var e=y.docs,i={timeout:n.timeout};return t.bulkDocs({docs:e,new_edits:!1},i).then(function(t){if(r.cancelled)throw d(),new Error("cancelled");var n=Object.create(null);t.forEach(function(e){e.error&&(n[e.id]=e)});var i=Object.keys(n).length;o.doc_write_failures+=i,o.docs_written+=e.length-i,e.forEach(function(e){var t=n[e._id];if(t){if(o.errors.push(t),"unauthorized"!==t.name&&"forbidden"!==t.name)throw t;r.emit("denied",clone(t))}else B.push(e)})},function(t){throw o.doc_write_failures+=e.length,t})}}function c(){if(y.error)throw new Error("There was a problem getting docs.");o.last_seq=O=y.seq;var e=clone(o);return B.length&&(e.docs=B,r.emit("change",e)),S=!0,E.writeCheckpoint(y.seq,N).then(function(){if(S=!1,r.cancelled)throw d(),new Error("cancelled");y=void 0,_()}).catch(function(e){throw g(e),e})}function u(){return getDocs(e,t,y.diffs,r).then(function(e){y.error=!e.ok,e.docs.forEach(function(e){delete y.diffs[e._id],o.docs_read++,y.docs.push(e)})})}function s(){r.cancelled||y||(0!==w.length?(y=w.shift(),function(){var e={};return y.changes.forEach(function(t){"_user/"!==t.id&&(e[t.id]=t.changes.map(function(e){return e.rev}))}),t.revsDiff(e).then(function(e){if(r.cancelled)throw d(),new Error("cancelled");y.diffs=e})}().then(u).then(a).then(c).then(s).catch(function(e){f("batch processing terminated with error",e)})):l(!0))}function l(e){0!==k.changes.length?(e||D||k.changes.length>=$)&&(w.push(k),k={seq:0,changes:[],docs:[]},"pending"!==r.state&&"stopped"!==r.state||(r.state="active",r.emit("active")),s()):0!==w.length||y||((T&&R.live||D)&&(r.state="pending",r.emit("paused")),D&&d())}function f(e,t){P||(t.message||(t.message=e),o.ok=!1,o.status="aborting",w=[],k={seq:0,changes:[],docs:[]},d(t))}function d(i){P||r.cancelled&&(o.status="cancelled",S)||(o.status=o.status||"complete",o.end_time=new Date,o.last_seq=O,P=!0,i?((i=createError(i)).result=o,"unauthorized"===i.name||"forbidden"===i.name?(r.emit("error",i),r.removeAllListeners()):backOff(n,r,i,function(){replicate(e,t,n,r)})):(r.emit("complete",o),r.removeAllListeners()))}function h(e){if(r.cancelled)return d();filterChange(n)(e)&&(k.seq=e.seq,k.changes.push(e),l(0===w.length&&R.live))}function p(e){if(I=!1,r.cancelled)return d();if(e.results.length>0)R.since=e.last_seq,_(),l(!0);else{var t=function(){T?(R.live=!0,_()):D=!0,l(!0)};y||0!==e.results.length?t():(S=!0,E.writeCheckpoint(e.last_seq,N).then(function(){S=!1,o.last_seq=O=e.last_seq,t()}).catch(g))}}function v(e){if(I=!1,r.cancelled)return d();f("changes rejected",e)}function _(){function t(){i.cancel()}function o(){r.removeListener("cancel",t)}if(!I&&!D&&w.length<C){I=!0,r._changes&&(r.removeListener("cancel",r._abortChanges),r._changes.cancel()),r.once("cancel",t);var i=e.changes(R).on("change",h);i.then(o,o),i.then(p).catch(v),n.retry&&(r._changes=i,r._abortChanges=t)}}function m(){i().then(function(){if(!r.cancelled)return E.getCheckpoint().then(function(e){R={since:O=e,limit:$,batch_size:$,style:"all_docs",doc_ids:A,selector:x,return_docs:!0},n.filter&&("string"!=typeof n.filter?R.include_docs=!0:R.filter=n.filter),"heartbeat"in n&&(R.heartbeat=n.heartbeat),"timeout"in n&&(R.timeout=n.timeout),n.query_params&&(R.query_params=n.query_params),n.view&&(R.view=n.view),_()});d()}).catch(function(e){f("getCheckpoint rejected with ",e)})}function g(e){S=!1,f("writeCheckpoint completed with error",e)}var y,b,E,w=[],k={seq:0,changes:[],docs:[]},S=!1,D=!1,P=!1,O=0,T=n.continuous||n.live||!1,$=n.batch_size||100,C=n.batches_limit||10,I=!1,A=n.doc_ids,x=n.selector,B=[],N=uuid();o=o||{ok:!0,start_time:new Date,docs_read:0,docs_written:0,doc_write_failures:0,errors:[]};var R={};r.ready(e,t),r.cancelled?d():(r._addedListeners||(r.once("cancel",d),"function"==typeof n.complete&&(r.once("error",n.complete),r.once("complete",function(e){n.complete(null,e)})),r._addedListeners=!0),void 0===n.since?m():i().then(function(){return S=!0,E.writeCheckpoint(n.since,N)}).then(function(){S=!1,r.cancelled?d():(O=n.since,m())}).catch(g))}function Replication(){events.EventEmitter.call(this),this.cancelled=!1,this.state="pending";var e=this,t=new PouchPromise$1(function(t,n){e.once("complete",t),e.once("error",n)});e.then=function(e,n){return t.then(e,n)},e.catch=function(e){return t.catch(e)},e.catch(function(){})}function toPouch(e,t){var n=t.PouchConstructor;return"string"==typeof e?new n(e,t):e}function replicateWrapper(e,t,n,r){if("function"==typeof n&&(r=n,n={}),void 0===n&&(n={}),n.doc_ids&&!Array.isArray(n.doc_ids))throw createError(BAD_REQUEST,"`doc_ids` filter parameter is not a list.");n.complete=r,(n=clone(n)).continuous=n.continuous||n.live,n.retry="retry"in n&&n.retry,n.PouchConstructor=n.PouchConstructor||this;var o=new Replication(n);return replicate(toPouch(e,n),toPouch(t,n),n,o),o}function sync$1(e,t,n,r){return"function"==typeof n&&(r=n,n={}),void 0===n&&(n={}),n=clone(n),n.PouchConstructor=n.PouchConstructor||this,e=toPouch(e,n),t=toPouch(t,n),new Sync(e,t,n,r)}function Sync(e,t,n,r){function o(e){p.emit("change",{direction:"pull",change:e})}function i(e){p.emit("change",{direction:"push",change:e})}function a(e){p.emit("denied",{direction:"push",doc:e})}function c(e){p.emit("denied",{direction:"pull",doc:e})}function u(){p.pushPaused=!0,p.pullPaused&&p.emit("paused")}function s(){p.pullPaused=!0,p.pushPaused&&p.emit("paused")}function l(){p.pushPaused=!1,p.pullPaused&&p.emit("active",{direction:"push"})}function f(){p.pullPaused=!1,p.pushPaused&&p.emit("active",{direction:"pull"})}function d(e){return function(t,n){("change"===t&&(n===o||n===i)||"denied"===t&&(n===c||n===a)||"paused"===t&&(n===s||n===u)||"active"===t&&(n===f||n===l))&&(t in m||(m[t]={}),m[t][e]=!0,2===Object.keys(m[t]).length&&p.removeAllListeners(t))}}function h(e,t,n){-1==e.listeners(t).indexOf(n)&&e.on(t,n)}var p=this;this.canceled=!1;var v=n.push?$inject_Object_assign({},n,n.push):n,_=n.pull?$inject_Object_assign({},n,n.pull):n;this.push=replicateWrapper(e,t,v),this.pull=replicateWrapper(t,e,_),this.pushPaused=!0,this.pullPaused=!0;var m={};n.live&&(this.push.on("complete",p.pull.cancel.bind(p.pull)),this.pull.on("complete",p.push.cancel.bind(p.push))),this.on("newListener",function(e){"change"===e?(h(p.pull,"change",o),h(p.push,"change",i)):"denied"===e?(h(p.pull,"denied",c),h(p.push,"denied",a)):"active"===e?(h(p.pull,"active",f),h(p.push,"active",l)):"paused"===e&&(h(p.pull,"paused",s),h(p.push,"paused",u))}),this.on("removeListener",function(e){"change"===e?(p.pull.removeListener("change",o),p.push.removeListener("change",i)):"denied"===e?(p.pull.removeListener("denied",c),p.push.removeListener("denied",a)):"active"===e?(p.pull.removeListener("active",f),p.push.removeListener("active",l)):"paused"===e&&(p.pull.removeListener("paused",s),p.push.removeListener("paused",u))}),this.pull.on("removeListener",d("pull")),this.push.on("removeListener",d("push"));var g=PouchPromise$1.all([this.push,this.pull]).then(function(e){var t={push:e[0],pull:e[1]};return p.emit("complete",t),r&&r(null,t),p.removeAllListeners(),t},function(e){if(p.cancel(),r?r(e):p.emit("error",e),p.removeAllListeners(),r)throw e});this.then=function(e,t){return g.then(e,t)},this.catch=function(e){return g.catch(e)}}function replication(e){e.replicate=replicateWrapper,e.sync=sync$1,Object.defineProperty(e.prototype,"replicate",{get:function(){var e=this;return{from:function(t,n,r){return e.constructor.replicate(t,e,n,r)},to:function(t,n,r){return e.constructor.replicate(e,t,n,r)}}}}),e.prototype.sync=function(e,t,n){return this.constructor.sync(this,e,t,n)}}var uuidV4=_interopDefault(require("uuid")),lie=_interopDefault(require("lie")),getArguments=_interopDefault(require("argsarray")),cloneBuffer=_interopDefault(require("clone-buffer")),events=require("events"),events__default=_interopDefault(events),inherits=_interopDefault(require("inherits")),debug=_interopDefault(require("debug")),vm=_interopDefault(require("vm")),levelup=_interopDefault(require("levelup")),ltgt=_interopDefault(require("ltgt")),Codec=_interopDefault(require("level-codec")),ReadableStreamCore=_interopDefault(require("readable-stream")),through2=require("through2"),Deque=_interopDefault(require("double-ended-queue")),bufferFrom=_interopDefault(require("buffer-from")),crypto=_interopDefault(require("crypto")),vuvuzela=_interopDefault(require("vuvuzela")),fs=_interopDefault(require("fs")),path=_interopDefault(require("path")),LevelWriteStream=_interopDefault(require("level-write-stream")),PouchPromise$1="function"==typeof Promise?Promise:lie,funcToString=Function.prototype.toString,objectCtorString=funcToString.call(Object);Map$1.prototype.get=function(e){var t=mangle(e);return this._store[t]},Map$1.prototype.set=function(e,t){var n=mangle(e);return this._store[n]=t,!0},Map$1.prototype.has=function(e){return mangle(e)in this._store},Map$1.prototype.delete=function(e){var t=mangle(e),n=t in this._store;return delete this._store[t],n},Map$1.prototype.forEach=function(e){for(var t=Object.keys(this._store),n=0,r=t.length;n<r;n++){var o=t[n];e(this._store[o],o=unmangle(o))}},Object.defineProperty(Map$1.prototype,"size",{get:function(){return Object.keys(this._store).length}}),Set$1.prototype.add=function(e){return this._store.set(e,!0)},Set$1.prototype.has=function(e){return this._store.has(e)},Set$1.prototype.forEach=function(e){this._store.forEach(function(t,n){e(n)})},Object.defineProperty(Set$1.prototype,"size",{get:function(){return this._store.size}});var ExportedSet,ExportedMap;supportsMapAndSet()?(ExportedSet=Set,ExportedMap=Map):(ExportedSet=Set$1,ExportedMap=Map$1);var MAX_NUM_CONCURRENT_REQUESTS=6;inherits(Changes,events.EventEmitter),Changes.prototype.addListener=function(e,t,n,r){function o(){if(i._listeners[t])if(a)a="waiting";else{a=!0;var e=pick(r,["style","include_docs","attachments","conflicts","filter","doc_ids","view","since","query_params","binary"]);n.changes(e).on("change",function(e){e.seq>r.since&&!r.cancelled&&(r.since=e.seq,r.onChange(e))}).on("complete",function(){"waiting"===a&&nextTick(o),a=!1}).on("error",function(){a=!1})}}if(!this._listeners[t]){var i=this,a=!1;this._listeners[t]=o,this.on(e,o)}},Changes.prototype.removeListener=function(e,t){t in this._listeners&&(events.EventEmitter.prototype.removeListener.call(this,e,this._listeners[t]),delete this._listeners[t])},Changes.prototype.notifyLocalWindows=function(e){isChromeApp()?chrome.storage.local.set({dbName:e}):hasLocalStorage()&&(localStorage[e]="a"===localStorage[e]?"b":"a")},Changes.prototype.notify=function(e){this.emit(e),this.notifyLocalWindows(e)};var assign,res=function(){},$inject_Object_assign=assign="function"==typeof Object.assign?Object.assign:function(e){for(var t=Object(e),n=1;n<arguments.length;n++){var r=arguments[n];if(null!=r)for(var o in r)Object.prototype.hasOwnProperty.call(r,o)&&(t[o]=r[o])}return t};inherits(PouchError,Error),PouchError.prototype.toString=function(){return JSON.stringify({status:this.status,name:this.name,message:this.message,reason:this.reason})};var res$1,UNAUTHORIZED=new PouchError(401,"unauthorized","Name or password is incorrect."),MISSING_BULK_DOCS=new PouchError(400,"bad_request","Missing JSON list of 'docs'"),MISSING_DOC=new PouchError(404,"not_found","missing"),REV_CONFLICT=new PouchError(409,"conflict","Document update conflict"),INVALID_ID=new PouchError(400,"bad_request","_id field must contain a string"),MISSING_ID=new PouchError(412,"missing_id","_id is required for puts"),RESERVED_ID=new PouchError(400,"bad_request","Only reserved document ids may start with underscore."),NOT_OPEN=new PouchError(412,"precondition_failed","Database not open"),UNKNOWN_ERROR=new PouchError(500,"unknown_error","Database encountered an unknown error"),BAD_ARG=new PouchError(500,"badarg","Some query argument is invalid"),INVALID_REQUEST=new PouchError(400,"invalid_request","Request was invalid"),QUERY_PARSE_ERROR=new PouchError(400,"query_parse_error","Some query parameter is invalid"),DOC_VALIDATION=new PouchError(500,"doc_validation","Bad special document member"),BAD_REQUEST=new PouchError(400,"bad_request","Something wrong with the request"),NOT_AN_OBJECT=new PouchError(400,"bad_request","Document must be a JSON object"),DB_MISSING=new PouchError(404,"not_found","Database not found"),IDB_ERROR=new PouchError(500,"indexed_db_went_bad","unknown"),WSQ_ERROR=new PouchError(500,"web_sql_went_bad","unknown"),LDB_ERROR=new PouchError(500,"levelDB_went_went_bad","unknown"),FORBIDDEN=new PouchError(403,"forbidden","Forbidden by design doc validate_doc_update function"),INVALID_REV=new PouchError(400,"bad_request","Invalid rev format"),FILE_EXISTS=new PouchError(412,"file_exists","The database could not be created, the file already exists."),MISSING_STUB=new PouchError(412,"missing_stub","A pre-existing attachment stub wasn't found"),INVALID_URL=new PouchError(413,"invalid_url","Provided URL is invalid"),hasName=f.name,functionName=res$1=hasName?function(e){return e.name}:function(e){return e.toString().match(/^\s*function\s*(\S*)\s*\(/)[1]},keys=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],qName="queryKey",qParser=/(?:^|&)([^&=]*)=?([^&]*)/g,parser=/^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,uuid=uuidV4.v4;inherits(Changes$2,events.EventEmitter),Changes$2.prototype.cancel=function(){this.isCancelled=!0,this.db.taskqueue.isReady&&this.emit("cancel")},Changes$2.prototype.validateChanges=function(e){var t=e.complete,n=this;PouchDB$5._changesFilterPlugin?PouchDB$5._changesFilterPlugin.validate(e,function(r){if(r)return t(r);n.doChanges(e)}):n.doChanges(e)},Changes$2.prototype.doChanges=function(e){var t=this,n=e.complete;if("live"in(e=clone(e))&&!("continuous"in e)&&(e.continuous=e.live),e.processChange=processChange,"latest"===e.since&&(e.since="now"),e.since||(e.since=0),"now"!==e.since){if(PouchDB$5._changesFilterPlugin){if(PouchDB$5._changesFilterPlugin.normalize(e),PouchDB$5._changesFilterPlugin.shouldFilter(this,e))return PouchDB$5._changesFilterPlugin.filter(this,e)}else["doc_ids","filter","selector","view"].forEach(function(t){t in e&&guardedConsole("warn",'The "'+t+'" option was passed in to changes/replicate, but pouchdb-changes-filter plugin is not installed, so it was ignored. Please install the plugin to enable filtering.')});"descending"in e||(e.descending=!1),e.limit=0===e.limit?1:e.limit,e.complete=n;var r=this.db._changes(e);if(r&&"function"==typeof r.cancel){var o=t.cancel;t.cancel=getArguments(function(e){r.cancel(),o.apply(this,e)})}}else this.db.info().then(function(r){t.isCancelled?n(null,{status:"cancelled"}):(e.since=r.update_seq,t.doChanges(e))},n)},inherits(AbstractPouchDB,events.EventEmitter),AbstractPouchDB.prototype.post=adapterFun("post",function(e,t,n){if("function"==typeof t&&(n=t,t={}),"object"!=typeof e||Array.isArray(e))return n(createError(NOT_AN_OBJECT));this.bulkDocs({docs:[e]},t,yankError(n,e._id))}),AbstractPouchDB.prototype.put=adapterFun("put",function(e,t,n){function r(n){"function"==typeof o._put&&!1!==t.new_edits?o._put(e,t,n):o.bulkDocs({docs:[e]},t,yankError(n,e._id))}if("function"==typeof t&&(n=t,t={}),"object"!=typeof e||Array.isArray(e))return n(createError(NOT_AN_OBJECT));if(invalidIdError(e._id),isLocalId(e._id)&&"function"==typeof this._putLocal)return e._deleted?this._removeLocal(e,n):this._putLocal(e,n);var o=this;t.force&&e._rev?(!function(){var n=e._rev.split("-"),r=n[1],o=parseInt(n[0],10)+1,i=rev();e._revisions={start:o,ids:[i,r]},e._rev=o+"-"+i,t.new_edits=!1}(),r(function(t){var r=t?null:{ok:!0,id:e._id,rev:e._rev};n(t,r)})):r(n)}),AbstractPouchDB.prototype.putAttachment=adapterFun("putAttachment",function(e,t,n,r,o){function i(e){var n="_rev"in e?parseInt(e._rev,10):0;return e._attachments=e._attachments||{},e._attachments[t]={content_type:o,data:r,revpos:++n},a.put(e)}var a=this;return"function"==typeof o&&(o=r,r=n,n=null),void 0===o&&(o=r,r=n,n=null),o||guardedConsole("warn","Attachment",t,"on document",e,"is missing content_type"),a.get(e).then(function(e){if(e._rev!==n)throw createError(REV_CONFLICT);return i(e)},function(t){if(t.reason===MISSING_DOC.message)return i({_id:e});throw t})}),AbstractPouchDB.prototype.removeAttachment=adapterFun("removeAttachment",function(e,t,n,r){var o=this;o.get(e,function(e,i){if(e)r(e);else if(i._rev===n){if(!i._attachments)return r();delete i._attachments[t],0===Object.keys(i._attachments).length&&delete i._attachments,o.put(i,r)}else r(createError(REV_CONFLICT))})}),AbstractPouchDB.prototype.remove=adapterFun("remove",function(e,t,n,r){var o;"string"==typeof t?(o={_id:e,_rev:t},"function"==typeof n&&(r=n,n={})):(o=e,"function"==typeof t?(r=t,n={}):(r=n,n=t)),(n=n||{}).was_delete=!0;var i={_id:o._id,_rev:o._rev||n.rev};if(i._deleted=!0,isLocalId(i._id)&&"function"==typeof this._removeLocal)return this._removeLocal(o,r);this.bulkDocs({docs:[i]},n,yankError(r,i._id))}),AbstractPouchDB.prototype.revsDiff=adapterFun("revsDiff",function(e,t,n){function r(e,t){a.has(e)||a.set(e,{missing:[]}),a.get(e).missing.push(t)}"function"==typeof t&&(n=t,t={});var o=Object.keys(e);if(!o.length)return n(null,{});var i=0,a=new ExportedMap;o.map(function(t){this._getRevisionTree(t,function(c,u){if(c&&404===c.status&&"missing"===c.message)a.set(t,{missing:e[t]});else{if(c)return n(c);!function(t,n){var o=e[t].slice(0);traverseRevTree(n,function(e,n,i,a,c){var u=n+"-"+i,s=o.indexOf(u);-1!==s&&(o.splice(s,1),"available"!==c.status&&r(t,u))}),o.forEach(function(e){r(t,e)})}(t,u)}if(++i===o.length){var s={};return a.forEach(function(e,t){s[t]=e}),n(null,s)}})},this)}),AbstractPouchDB.prototype.bulkGet=adapterFun("bulkGet",function(e,t){bulkGet(this,e,t)}),AbstractPouchDB.prototype.compactDocument=adapterFun("compactDocument",function(e,t,n){var r=this;this._getRevisionTree(e,function(o,i){if(o)return n(o);var a=computeHeight(i),c=[],u=[];Object.keys(a).forEach(function(e){a[e]>t&&c.push(e)}),traverseRevTree(i,function(e,t,n,r,o){var i=t+"-"+n;"available"===o.status&&-1!==c.indexOf(i)&&u.push(i)}),r._doCompaction(e,u,n)})}),AbstractPouchDB.prototype.compact=adapterFun("compact",function(e,t){"function"==typeof e&&(t=e,e={});e=e||{},this._compactionQueue=this._compactionQueue||[],this._compactionQueue.push({opts:e,callback:t}),1===this._compactionQueue.length&&doNextCompaction(this)}),AbstractPouchDB.prototype._compact=function(e,t){var n=this,r={return_docs:!1,last_seq:e.last_seq||0},o=[];n.changes(r).on("change",function(e){o.push(n.compactDocument(e.id,0))}).on("complete",function(e){var r=e.last_seq;PouchPromise$1.all(o).then(function(){return upsert(n,"_local/compaction",function(e){return(!e.last_seq||e.last_seq<r)&&(e.last_seq=r,e)})}).then(function(){t(null,{ok:!0})}).catch(t)}).on("error",t)},AbstractPouchDB.prototype.get=adapterFun("get",function(e,t,n){function r(){var r=[],a=o.length;if(!a)return n(null,r);o.forEach(function(o){i.get(e,{rev:o,revs:t.revs,latest:t.latest,attachments:t.attachments},function(e,t){if(e)r.push({missing:o});else{for(var i,c=0,u=r.length;c<u;c++)if(r[c].ok&&r[c].ok._rev===t._rev){i=!0;break}i||r.push({ok:t})}--a||n(null,r)})})}if("function"==typeof t&&(n=t,t={}),"string"!=typeof e)return n(createError(INVALID_ID));if(isLocalId(e)&&"function"==typeof this._getLocal)return this._getLocal(e,n);var o=[],i=this;if(!t.open_revs)return this._get(e,t,function(r,o){if(r)return r.docId=e,n(r);var a=o.doc,c=o.metadata,u=o.ctx;if(t.conflicts){var s=collectConflicts(c);s.length&&(a._conflicts=s)}if(isDeleted(c,a._rev)&&(a._deleted=!0),t.revs||t.revs_info){for(var l=a._rev.split("-"),f=parseInt(l[0],10),d=l[1],h=rootToLeaf(c.rev_tree),p=null,v=0;v<h.length;v++){var _=h[v],m=_.ids.map(function(e){return e.id}).indexOf(d);(m===f-1||!p&&-1!==m)&&(p=_)}var g=p.ids.map(function(e){return e.id}).indexOf(a._rev.split("-")[1])+1,y=p.ids.length-g;if(p.ids.splice(g,y),p.ids.reverse(),t.revs&&(a._revisions={start:p.pos+p.ids.length-1,ids:p.ids.map(function(e){return e.id})}),t.revs_info){var b=p.pos+p.ids.length;a._revs_info=p.ids.map(function(e){return b--,{rev:b+"-"+e.id,status:e.opts.status}})}}if(t.attachments&&a._attachments){var E=a._attachments,w=Object.keys(E).length;if(0===w)return n(null,a);Object.keys(E).forEach(function(e){this._getAttachment(a._id,e,E[e],{rev:a._rev,binary:t.binary,ctx:u},function(t,r){var o=a._attachments[e];o.data=r,delete o.stub,delete o.length,--w||n(null,a)})},i)}else{if(a._attachments)for(var k in a._attachments)a._attachments.hasOwnProperty(k)&&(a._attachments[k].stub=!0);n(null,a)}});if("all"===t.open_revs)this._getRevisionTree(e,function(e,t){if(e)return n(e);o=collectLeaves(t).map(function(e){return e.rev}),r()});else{if(!Array.isArray(t.open_revs))return n(createError(UNKNOWN_ERROR,"function_clause"));o=t.open_revs;for(var a=0;a<o.length;a++){var c=o[a];if("string"!=typeof c||!/^\d+-/.test(c))return n(createError(INVALID_REV))}r()}}),AbstractPouchDB.prototype.getAttachment=adapterFun("getAttachment",function(e,t,n,r){var o=this;n instanceof Function&&(r=n,n={}),this._get(e,n,function(i,a){return i?r(i):a.doc._attachments&&a.doc._attachments[t]?(n.ctx=a.ctx,n.binary=!0,void o._getAttachment(e,t,a.doc._attachments[t],n,r)):r(createError(MISSING_DOC))})}),AbstractPouchDB.prototype.allDocs=adapterFun("allDocs",function(e,t){if("function"==typeof e&&(t=e,e={}),e.skip=void 0!==e.skip?e.skip:0,e.start_key&&(e.startkey=e.start_key),e.end_key&&(e.endkey=e.end_key),"keys"in e){if(!Array.isArray(e.keys))return t(new TypeError("options.keys must be an array"));var n=["startkey","endkey","key"].filter(function(t){return t in e})[0];if(n)return void t(createError(QUERY_PARSE_ERROR,"Query parameter `"+n+"` is not compatible with multi-get"));if(!isRemote(this))return allDocsKeysQuery(this,e,t)}return this._allDocs(e,t)}),AbstractPouchDB.prototype.changes=function(e,t){return"function"==typeof e&&(t=e,e={}),new Changes$2(this,e,t)},AbstractPouchDB.prototype.close=adapterFun("close",function(e){return this._closed=!0,this.emit("closed"),this._close(e)}),AbstractPouchDB.prototype.info=adapterFun("info",function(e){var t=this;this._info(function(n,r){if(n)return e(n);r.db_name=r.db_name||t.name,r.auto_compaction=!(!t.auto_compaction||isRemote(t)),r.adapter=t.adapter,e(null,r)})}),AbstractPouchDB.prototype.id=adapterFun("id",function(e){return this._id(e)}),AbstractPouchDB.prototype.type=function(){return"function"==typeof this._type?this._type():this.adapter},AbstractPouchDB.prototype.bulkDocs=adapterFun("bulkDocs",function(e,t,n){if("function"==typeof t&&(n=t,t={}),t=t||{},Array.isArray(e)&&(e={docs:e}),!e||!e.docs||!Array.isArray(e.docs))return n(createError(MISSING_BULK_DOCS));for(var r=0;r<e.docs.length;++r)if("object"!=typeof e.docs[r]||Array.isArray(e.docs[r]))return n(createError(NOT_AN_OBJECT));var o;if(e.docs.forEach(function(e){e._attachments&&Object.keys(e._attachments).forEach(function(t){o=o||attachmentNameError(t),e._attachments[t].content_type||guardedConsole("warn","Attachment",t,"on document",e._id,"is missing content_type")})}),o)return n(createError(BAD_REQUEST,o));"new_edits"in t||(t.new_edits=!("new_edits"in e)||e.new_edits);var i=this;t.new_edits||isRemote(i)||e.docs.sort(compareByIdThenRev),cleanDocs(e.docs);var a=e.docs.map(function(e){return e._id});return this._bulkDocs(e,t,function(e,r){if(e)return n(e);if(t.new_edits||(r=r.filter(function(e){return e.error})),!isRemote(i))for(var o=0,c=r.length;o<c;o++)r[o].id=r[o].id||a[o];n(null,r)})}),AbstractPouchDB.prototype.registerDependentDatabase=adapterFun("registerDependentDatabase",function(e,t){var n=new this.constructor(e,this.__opts);upsert(this,"_local/_pouch_dependentDbs",function(t){return t.dependentDbs=t.dependentDbs||{},!t.dependentDbs[e]&&(t.dependentDbs[e]=!0,t)}).then(function(){t(null,{db:n})}).catch(t)}),AbstractPouchDB.prototype.destroy=adapterFun("destroy",function(e,t){function n(){r._destroy(e,function(e,n){if(e)return t(e);r._destroyed=!0,r.emit("destroyed"),t(null,n||{ok:!0})})}"function"==typeof e&&(t=e,e={});var r=this,o=!("use_prefix"in r)||r.use_prefix;if(isRemote(r))return n();r.get("_local/_pouch_dependentDbs",function(e,i){if(e)return 404!==e.status?t(e):n();var a=i.dependentDbs,c=r.constructor,u=Object.keys(a).map(function(e){var t=o?e.replace(new RegExp("^"+c.prefix),""):e;return new c(t,r.__opts).destroy()});PouchPromise$1.all(u).then(n,t)})}),TaskQueue$1.prototype.execute=function(){var e;if(this.failed)for(;e=this.queue.shift();)e(this.failed);else for(;e=this.queue.shift();)e()},TaskQueue$1.prototype.fail=function(e){this.failed=e,this.execute()},TaskQueue$1.prototype.ready=function(e){this.isReady=!0,this.db=e,this.execute()},TaskQueue$1.prototype.addTask=function(e){this.queue.push(e),this.failed&&this.execute()},inherits(PouchDB$5,AbstractPouchDB),PouchDB$5.adapters={},PouchDB$5.preferredAdapters=[],PouchDB$5.prefix="_pouch_";var eventEmitter=new events.EventEmitter;setUpEventEmitter(PouchDB$5),PouchDB$5.adapter=function(e,t,n){t.valid()&&(PouchDB$5.adapters[e]=t,n&&PouchDB$5.preferredAdapters.push(e))},PouchDB$5.plugin=function(e){if("function"==typeof e)e(PouchDB$5);else{if("object"!=typeof e||0===Object.keys(e).length)throw new Error('Invalid plugin: got "'+e+'", expected an object or a function');Object.keys(e).forEach(function(t){PouchDB$5.prototype[t]=e[t]})}return this.__defaults&&(PouchDB$5.__defaults=$inject_Object_assign({},this.__defaults)),PouchDB$5},PouchDB$5.defaults=function(e){function t(e,n){if(!(this instanceof t))return new t(e,n);n=n||{},e&&"object"==typeof e&&(e=(n=e).name,delete n.name),n=$inject_Object_assign({},t.__defaults,n),PouchDB$5.call(this,e,n)}return inherits(t,PouchDB$5),t.preferredAdapters=PouchDB$5.preferredAdapters.slice(),Object.keys(PouchDB$5).forEach(function(e){e in t||(t[e]=PouchDB$5[e])}),t.__defaults=$inject_Object_assign({},this.__defaults,e),t};var version="6.3.4",combinationFields=["$or","$nor","$not"],MIN_MAGNITUDE=-324,MAGNITUDE_DIGITS=3,SEP="",matchers={$elemMatch:function(e,t,n,r){return!!Array.isArray(r)&&(0!==r.length&&("object"==typeof r[0]?r.some(function(e){return rowFilter(e,t,Object.keys(t))}):r.some(function(r){return matchSelector(t,e,n,r)})))},$allMatch:function(e,t,n,r){return!!Array.isArray(r)&&(0!==r.length&&("object"==typeof r[0]?r.every(function(e){return rowFilter(e,t,Object.keys(t))}):r.every(function(r){return matchSelector(t,e,n,r)})))},$eq:function(e,t,n,r){return fieldIsNotUndefined(r)&&0===collate(r,t)},$gte:function(e,t,n,r){return fieldIsNotUndefined(r)&&collate(r,t)>=0},$gt:function(e,t,n,r){return fieldIsNotUndefined(r)&&collate(r,t)>0},$lte:function(e,t,n,r){return fieldIsNotUndefined(r)&&collate(r,t)<=0},$lt:function(e,t,n,r){return fieldIsNotUndefined(r)&&collate(r,t)<0},$exists:function(e,t,n,r){return t?fieldIsNotUndefined(r):!fieldIsNotUndefined(r)},$mod:function(e,t,n,r){return fieldExists(r)&&modField(r,t)},$ne:function(e,t,n,r){return t.every(function(e){return 0!==collate(r,e)})},$in:function(e,t,n,r){return fieldExists(r)&&arrayContainsValue(r,t)},$nin:function(e,t,n,r){return fieldExists(r)&&!arrayContainsValue(r,t)},$size:function(e,t,n,r){return fieldExists(r)&&arraySize(r,t)},$all:function(e,t,n,r){return Array.isArray(r)&&arrayContainsAllValues(r,t)},$regex:function(e,t,n,r){return fieldExists(r)&&regexMatch(r,t)},$type:function(e,t,n,r){return typeMatch(r,t)}};PouchDB$5.plugin(debugPouch),PouchDB$5.plugin(applyChangesFilterPlugin),PouchDB$5.version=version,inherits(NotFoundError,Error),NotFoundError.prototype.name="NotFoundError";var EventEmitter$1=events__default.EventEmitter,version$1="6.5.4",NOT_FOUND_ERROR=new NotFoundError,sublevel$1=function(e,t,n,r){function o(e){var t,n={};if(r)for(t in r)void 0!==r[t]&&(n[t]=r[t]);if(e)for(t in e)void 0!==e[t]&&(n[t]=e[t]);return n}var i=new EventEmitter$1;return i.sublevels={},i.options=r,i.version=version$1,i.methods={},t=t||[],i.put=function(n,r,a,c){"function"==typeof a&&(c=a,a={}),e.apply([{key:n,value:r,prefix:t.slice(),type:"put"}],o(a),function(e){if(e)return c(e);i.emit("put",n,r),c(null)})},i.prefix=function(){return t.slice()},i.batch=function(n,r,a){"function"==typeof r&&(a=r,r={}),n=n.map(function(e){return{key:e.key,value:e.value,prefix:e.prefix||t,keyEncoding:e.keyEncoding,valueEncoding:e.valueEncoding,type:e.type}}),e.apply(n,o(r),function(e){if(e)return a(e);i.emit("batch",n),a(null)})},i.get=function(n,r,i){"function"==typeof r&&(i=r,r={}),e.get(n,t,o(r),function(e,t){e?i(NOT_FOUND_ERROR):i(null,t)})},i.sublevel=function(r,a){return i.sublevels[r]=i.sublevels[r]||sublevel$1(e,t.concat(r),n,o(a))},i.readStream=i.createReadStream=function(r){(r=o(r)).prefix=t;var i,a=e.iterator(r);return(i=n(r,e.createDecoder(r))).setIterator(a),i},i.close=function(t){e.close(t)},i.isOpen=e.isOpen,i.isClosed=e.isClosed,i},Readable=ReadableStreamCore.Readable;inherits(ReadStream,Readable),ReadStream.prototype.setIterator=function(e){return this._iterator=e,this._destroyed?e.end(function(){}):this._waiting?(this._waiting=!1,this._read()):this},ReadStream.prototype._read=function(){var e=this;if(!e._destroyed)return e._iterator?void e._iterator.next(function(t,n,r){if(t||void 0===n&&void 0===r)return t||e._destroyed||e.push(null),e._cleanup(t);r=e._makeData(n,r),e._destroyed||e.push(r)}):this._waiting=!0},ReadStream.prototype._cleanup=function(e){if(!this._destroyed){this._destroyed=!0;var t=this;e&&t.emit("error",e),t._iterator?t._iterator.end(function(){t._iterator=null,t.emit("close")}):t.emit("close")}},ReadStream.prototype.destroy=function(){this._cleanup()};var precodec={encode:function(e){return"ÿ"+e[0]+"ÿ"+e[1]},decode:function(e){var t=e.toString(),n=t.indexOf("ÿ",1);return[t.substring(1,n),t.substring(n+1)]},lowerBound:"\0",upperBound:"ÿ"},codec=new Codec,reservedWords=toObject(["_id","_rev","_attachments","_deleted","_revisions","_revs_info","_conflicts","_deleted_conflicts","_local_seq","_rev_tree","_replication_id","_replication_state","_replication_state_time","_replication_state_reason","_replication_stats","_removed"]),dataWords=toObject(["_attachments","_replication_id","_replication_state","_replication_state_time","_replication_state_reason","_replication_stats"]);LevelTransaction.prototype.get=function(e,t,n){var r=getCacheFor(this,e),o=r.get(t);return o?nextTick(function(){n(null,o)}):null===o?nextTick(function(){n({name:"NotFoundError"})}):void e.get(t,function(e,o){if(e)return"NotFoundError"===e.name&&r.set(t,null),n(e);r.set(t,o),n(null,o)})},LevelTransaction.prototype.batch=function(e){for(var t=0,n=e.length;t<n;t++){var r=e[t],o=getCacheFor(this,r.prefix);"put"===r.type?o.set(r.key,r.value):o.set(r.key,null)}this._batch=this._batch.concat(e)},LevelTransaction.prototype.execute=function(e,t){for(var n=new ExportedSet,r=[],o=this._batch.length-1;o>=0;o--){var i=this._batch[o],a=i.prefix.prefix()[0]+"ÿ"+i.key;n.has(a)||(n.add(a),r.push(i))}e.batch(r,t)};var DOC_STORE="document-store",BY_SEQ_STORE="by-sequence",ATTACHMENT_STORE="attach-store",BINARY_STORE="attach-binary-store",LOCAL_STORE="local-store",META_STORE="meta-store",dbStores=new ExportedMap,UPDATE_SEQ_KEY="_local_last_update_seq",DOC_COUNT_KEY="_local_doc_count",UUID_KEY="_local_uuid",MD5_PREFIX="md5-",safeJsonEncoding={encode:safeJsonStringify,decode:safeJsonParse,buffer:!1,type:"cheap-json"},levelChanges=new Changes,requireLeveldown=function(){try{return require("leveldown")}catch(e){return"MODULE_NOT_FOUND"===(e=e||"leveldown import error").code?new Error(["the 'leveldown' package is not available. install it, or,","specify another storage backend using the 'db' option"].join(" ")):e.message&&e.message.match("Module version mismatch")?new Error([e.message,"This generally implies that leveldown was built with a different","version of node than that which is running now.  You may try","fully removing and reinstalling PouchDB or leveldown to resolve."].join(" ")):new Error(e.toString()+": unable to import leveldown")}},stores=["document-store","by-sequence","attach-store","attach-binary-store"],UPDATE_SEQ_KEY$1="_local_last_update_seq",DOC_COUNT_KEY$1="_local_doc_count",UUID_KEY$1="_local_uuid",doMigrationOne=function(e,t,n){var r=require("leveldown"),o=path.resolve(e);fs.unlink(o+".uuid",function(e){if(e)return n();var i=4,a=[];stores.forEach(function(e,c){!function(e,n,r){var i,a=path.join(o,e);i=3===n?{valueEncoding:"binary"}:{valueEncoding:"json"};var c=t.sublevel(e,i),u=levelup(a,i),s=u.createReadStream(),l=new LevelWriteStream(c)();s.on("end",function(){u.close(function(e){r(e,a)})}),s.pipe(l)}(e,c,function(e,t){if(e)return n(e);a.push(t),--i||a.forEach(function(e){r.destroy(e,function(){++i===a.length&&fs.rmdir(o,n)})})})})})},doMigrationTwo=function(e,t,n){var r=[];t.bySeqStore.get(UUID_KEY$1,function(o,i){if(o)return n();r.push({key:UUID_KEY$1,value:i,prefix:t.metaStore,type:"put",valueEncoding:"json"}),r.push({key:UUID_KEY$1,prefix:t.bySeqStore,type:"del"}),t.bySeqStore.get(DOC_COUNT_KEY$1,function(o,i){i&&(r.push({key:DOC_COUNT_KEY$1,value:i,prefix:t.metaStore,type:"put",valueEncoding:"json"}),r.push({key:DOC_COUNT_KEY$1,prefix:t.bySeqStore,type:"del"})),t.bySeqStore.get(UPDATE_SEQ_KEY$1,function(o,i){i&&(r.push({key:UPDATE_SEQ_KEY$1,value:i,prefix:t.metaStore,type:"put",valueEncoding:"json"}),r.push({key:UPDATE_SEQ_KEY$1,prefix:t.bySeqStore,type:"del"}));var a={};t.docStore.createReadStream({startKey:"_",endKey:"_ÿ"}).pipe(through2.obj(function(e,n,o){if(!isLocalId(e.key))return o();r.push({key:e.key,prefix:t.docStore,type:"del"});var i=winningRev(e.value);Object.keys(e.value.rev_map).forEach(function(t){"winner"!==t&&this.push(formatSeq(e.value.rev_map[t]))},this);var a=e.value.rev_map[i];t.bySeqStore.get(formatSeq(a),function(n,i){n||r.push({key:e.key,value:i,prefix:t.localStore,type:"put",valueEncoding:"json"}),o()})})).pipe(through2.obj(function(e,n,o){if(a[e])return o();a[e]=!0,t.bySeqStore.get(e,function(n,i){if(n||!isLocalId(i._id))return o();r.push({key:e,prefix:t.bySeqStore,type:"del"}),o()})},function(){e.batch(r,n)}))})})})},migrate={doMigrationOne:doMigrationOne,doMigrationTwo:doMigrationTwo};LevelDownPouch.valid=function(){return!0},LevelDownPouch.use_prefix=!1;var LevelPouch=function(e){e.adapter("leveldb",LevelDownPouch,!0)},request=require("request"),CHANGES_BATCH_SIZE=25,MAX_SIMULTANEOUS_REVS=50,CHANGES_TIMEOUT_BUFFER=5e3,DEFAULT_HEARTBEAT=1e4,supportsBulkGetMap={};HttpPouch.valid=function(){return!0};var HttpPouch$1=function(e){e.adapter("http",HttpPouch,!1),e.adapter("https",HttpPouch,!1)};inherits(QueryParseError,Error),inherits(NotFoundError$2,Error),inherits(BuiltInError,Error);var evalFunc,log=guardedConsole.bind(null,"log"),evalFunction=evalFunc=evalFunctionInVm;TaskQueue$2.prototype.add=function(e){return this.promise=this.promise.catch(function(){}).then(function(){return e()}),this.promise},TaskQueue$2.prototype.finish=function(){return this.promise};var persistentQueues={},tempViewQueue=new TaskQueue$2,CHANGES_BATCH_SIZE$1=50,builtInReduce={_sum:function(e,t){return sum(t)},_count:function(e,t){return t.length},_stats:function(e,t){return{sum:sum(t),min:Math.min.apply(null,t),max:Math.max.apply(null,t),count:t.length,sumsqr:function(e){for(var t=0,n=0,r=e.length;n<r;n++){var o=e[n];t+=o*o}return t}(t)}}},localDocName="mrviews",abstract=createAbstractMapReduce(localDocName,mapper,reducer,ddocValidator),mapreduce={query:query,viewCleanup:viewCleanup},CHECKPOINT_VERSION=1,REPLICATOR="pouchdb",CHECKPOINT_HISTORY_SIZE=5,LOWEST_SEQ=0;Checkpointer.prototype.writeCheckpoint=function(e,t){var n=this;return this.updateTarget(e,t).then(function(){return n.updateSource(e,t)})},Checkpointer.prototype.updateTarget=function(e,t){return this.opts.writeTargetCheckpoint?updateCheckpoint(this.target,this.id,e,t,this.returnValue):PouchPromise$1.resolve(!0)},Checkpointer.prototype.updateSource=function(e,t){if(this.opts.writeSourceCheckpoint){var n=this;return this.readOnlySource?PouchPromise$1.resolve(!0):updateCheckpoint(this.src,this.id,e,t,this.returnValue).catch(function(e){if(isForbiddenError(e))return n.readOnlySource=!0,!0;throw e})}return PouchPromise$1.resolve(!0)};var comparisons={undefined:function(e,t){return 0===collate(e.last_seq,t.last_seq)?t.last_seq:0},1:function(e,t){return compareReplicationLogs(t,e).last_seq}};Checkpointer.prototype.getCheckpoint=function(){var e=this;return e.target.get(e.id).then(function(t){return e.readOnlySource?PouchPromise$1.resolve(t.last_seq):e.src.get(e.id).then(function(e){if(t.version!==e.version)return LOWEST_SEQ;var n;return(n=t.version?t.version.toString():"undefined")in comparisons?comparisons[n](t,e):LOWEST_SEQ},function(n){if(404===n.status&&t.last_seq)return e.src.put({_id:e.id,last_seq:LOWEST_SEQ}).then(function(){return LOWEST_SEQ},function(n){return isForbiddenError(n)?(e.readOnlySource=!0,t.last_seq):LOWEST_SEQ});throw n})}).catch(function(e){if(404!==e.status)throw e;return LOWEST_SEQ})};var STARTING_BACK_OFF=0;inherits(Replication,events.EventEmitter),Replication.prototype.cancel=function(){this.cancelled=!0,this.state="cancelled",this.emit("cancel")},Replication.prototype.ready=function(e,t){function n(){r.cancel()}var r=this;r._readyCalled||(r._readyCalled=!0,e.once("destroyed",n),t.once("destroyed",n),r.once("complete",function(){e.removeListener("destroyed",n),t.removeListener("destroyed",n)}))},inherits(Sync,events.EventEmitter),Sync.prototype.cancel=function(){this.canceled||(this.canceled=!0,this.push.cancel(),this.pull.cancel())},PouchDB$5.plugin(LevelPouch).plugin(HttpPouch$1).plugin(mapreduce).plugin(replication),module.exports=PouchDB$5;
		

	// Pouch DB 6.3.4 Find
			"use strict";function _interopDefault(e){return e&&"object"==typeof e&&"default"in e?e.default:e}function massageCreateIndexRequest(e){return(e=pouchdbUtils.clone(e)).index||(e.index={}),["type","name","ddoc"].forEach(function(t){e.index[t]&&(e[t]=e.index[t],delete e.index[t])}),e.fields&&(e.index.fields=e.fields,delete e.fields),e.type||(e.type="json"),e}function createIndex(e,t,r){t=massageCreateIndexRequest(t),e.request({method:"POST",url:"_index",body:t},r)}function find(e,t,r){e.request({method:"POST",url:"_find",body:t},r)}function explain(e,t,r){e.request({method:"POST",url:"_explain",body:t},r)}function getIndexes(e,t){e.request({method:"GET",url:"_index"},t)}function deleteIndex(e,t,r){var n=t.ddoc,i=t.type||"json",o=t.name;if(!n)return r(new Error("you must provide an index's ddoc"));if(!o)return r(new Error("you must provide an index's name"));var s="_index/"+[n,i,o].map(encodeURIComponent).join("/");e.request({method:"DELETE",url:s},r)}function getArguments(e){return function(){for(var t=arguments.length,r=new Array(t),n=-1;++n<t;)r[n]=arguments[n];return e.call(this,r)}}function callbackify(e){return getArguments(function(t){var r=t.pop(),n=e.apply(this,t);return promisedCallback(n,r),n})}function promisedCallback(e,t){return e.then(function(e){process.nextTick(function(){t(null,e)})},function(e){process.nextTick(function(){t(e)})}),e}function mergeObjects(e){for(var t={},r=0,n=e.length;r<n;r++)t=pouchdbUtils.assign(t,e[r]);return t}function pick(e,t){for(var r={},n=0,i=t.length;n<i;n++){var o=pouchdbSelectorCore.parseField(t[n]),s=pouchdbSelectorCore.getFieldFromDoc(e,o);void 0!==s&&pouchdbSelectorCore.setFieldInDoc(r,o,s)}return r}function oneArrayIsSubArrayOfOther(e,t){for(var r=0,n=Math.min(e.length,t.length);r<n;r++)if(e[r]!==t[r])return!1;return!0}function oneArrayIsStrictSubArrayOfOther(e,t){return!(e.length>t.length)&&oneArrayIsSubArrayOfOther(e,t)}function oneSetIsSubArrayOfOther(e,t){e=e.slice();for(var r=0,n=t.length;r<n;r++){var i=t[r];if(!e.length)break;var o=e.indexOf(i);if(-1===o)return!1;e.splice(o,1)}return!0}function arrayToObject(e){for(var t={},r=0,n=e.length;r<n;r++)t[e[r]]=!0;return t}function max(e,t){for(var r=null,n=-1,i=0,o=e.length;i<o;i++){var s=e[i],u=t(s);u>n&&(n=u,r=s)}return r}function arrayEquals(e,t){if(e.length!==t.length)return!1;for(var r=0,n=e.length;r<n;r++)if(e[r]!==t[r])return!1;return!0}function uniq(e){for(var t={},r=0;r<e.length;r++)t["$"+e[r]]=!0;return Object.keys(t).map(function(e){return e.substring(1)})}function createDeepMultiMapper(e,t){return function(r){for(var n=[],i=0,o=e.length;i<o;i++){for(var s=pouchdbSelectorCore.parseField(e[i]),u=r,a=0,c=s.length;a<c;a++)if(!(u=u[s[a]]))return;n.push(u)}t(n)}}function createDeepSingleMapper(e,t){var r=pouchdbSelectorCore.parseField(e);return function(e){for(var n=e,i=0,o=r.length;i<o;i++)if(!(n=n[r[i]]))return;t(n)}}function createShallowSingleMapper(e,t){return function(r){t(r[e])}}function createShallowMultiMapper(e,t){return function(r){for(var n=[],i=0,o=e.length;i<o;i++)n.push(r[e[i]]);t(n)}}function checkShallow(e){for(var t=0,r=e.length;t<r;t++)if(-1!==e[t].indexOf("."))return!1;return!0}function createMapper(e,t){var r=checkShallow(e),n=1===e.length;return r?n?createShallowSingleMapper(e[0],t):createShallowMultiMapper(e,t):n?createDeepSingleMapper(e[0],t):createDeepMultiMapper(e,t)}function mapper(e,t){return createMapper(Object.keys(e.fields),t)}function reducer(){throw new Error("reduce not supported")}function ddocValidator(e,t){var r=e.views[t];if(!r.map||!r.map.fields)throw new Error("ddoc "+e._id+" with view "+t+" doesn't have map.fields defined. maybe it wasn't created by this plugin?")}function massageSort(e){if(!Array.isArray(e))throw new Error("invalid sort json - should be an array");return e.map(function(e){if("string"==typeof e){var t={};return t[e]="asc",t}return e})}function massageUseIndex(e){var t=[];return"string"==typeof e?t.push(e):t=e,t.map(function(e){return e.replace("_design/","")})}function massageIndexDef(e){return e.fields=e.fields.map(function(e){if("string"==typeof e){var t={};return t[e]="asc",t}return e}),e}function getKeyFromDoc(e,t){for(var r=[],n=0;n<t.def.fields.length;n++){var i=pouchdbSelectorCore.getKey(t.def.fields[n]);r.push(e[i])}return r}function filterInclusiveStart(e,t,r){for(var n=r.def.fields,i=0,o=e.length;i<o;i++){var s=getKeyFromDoc(e[i].doc,r);if(1===n.length)s=s[0];else for(;s.length>t.length;)s.pop();if(Math.abs(pouchdbCollate.collate(s,t))>0)break}return i>0?e.slice(i):e}function reverseOptions(e){var t=pouchdbUtils.clone(e);return delete t.startkey,delete t.endkey,delete t.inclusive_start,delete t.inclusive_end,"endkey"in e&&(t.startkey=e.endkey),"startkey"in e&&(t.endkey=e.startkey),"inclusive_start"in e&&(t.inclusive_end=e.inclusive_start),"inclusive_end"in e&&(t.inclusive_start=e.inclusive_end),t}function validateIndex(e){var t=e.fields.filter(function(e){return"asc"===pouchdbSelectorCore.getValue(e)});if(0!==t.length&&t.length!==e.fields.length)throw new Error("unsupported mixed sorting")}function validateSort(e,t){if(t.defaultUsed&&e.sort){var r=e.sort.filter(function(e){return"_id"!==Object.keys(e)[0]}).map(function(e){return Object.keys(e)[0]});if(r.length>0)throw new Error('Cannot sort on field(s) "'+r.join(",")+'" when using the default index')}t.defaultUsed}function validateFindRequest(e){if("object"!=typeof e.selector)throw new Error("you must provide a selector when you find()")}function getUserFields(e,t){var r,n=Object.keys(e),i=t?t.map(pouchdbSelectorCore.getKey):[];return r=n.length>=i.length?n:i,0===i.length?{fields:r}:(r=r.sort(function(e,t){var r=i.indexOf(e);-1===r&&(r=Number.MAX_VALUE);var n=i.indexOf(t);return-1===n&&(n=Number.MAX_VALUE),r<n?-1:r>n?1:0}),{fields:r,sortOrder:t.map(pouchdbSelectorCore.getKey)})}function createIndex$1(e,t){function r(){return i||(i=pouchdbMd5.stringMd5(JSON.stringify(t)))}t=massageCreateIndexRequest(t);var n=pouchdbUtils.clone(t.index);t.index=massageIndexDef(t.index),validateIndex(t.index);var i,o=t.name||"idx-"+r(),s=t.ddoc||"idx-"+r(),u="_design/"+s,a=!1,c=!1;return e.constructor.emit("debug",["find","creating index",u]),pouchdbUtils.upsert(e,u,function(e){return e._rev&&"query"!==e.language&&(a=!0),e.language="query",e.views=e.views||{},!(c=!!e.views[o])&&(e.views[o]={map:{fields:mergeObjects(t.index.fields)},reduce:"_count",options:{def:n}},e)}).then(function(){if(a)throw new Error('invalid language for ddoc with id "'+u+'" (should be "query")')}).then(function(){var t=s+"/"+o;return abstractMapper.query.call(e,t,{limit:0,reduce:!1}).then(function(){return{id:u,name:o,result:c?"exists":"created"}})})}function getIndexes$1(e){return e.allDocs({startkey:"_design/",endkey:"_design/￿",include_docs:!0}).then(function(e){var t={indexes:[{ddoc:null,name:"_all_docs",type:"special",def:{fields:[{_id:"asc"}]}}]};return t.indexes=flatten(t.indexes,e.rows.filter(function(e){return"query"===e.doc.language}).map(function(e){return(void 0!==e.doc.views?Object.keys(e.doc.views):[]).map(function(t){var r=e.doc.views[t];return{ddoc:e.id,name:t,type:"json",def:massageIndexDef(r.options.def)}})})),t.indexes.sort(function(e,t){return pouchdbSelectorCore.compare(e.name,t.name)}),t.total_rows=t.indexes.length,t})}function checkFieldInIndex(e,t){for(var r=e.def.fields.map(pouchdbSelectorCore.getKey),n=0,i=r.length;n<i;n++)if(t===r[n])return!0;return!1}function userOperatorLosesPrecision(e,t){var r=e[t];return"$eq"!==pouchdbSelectorCore.getKey(r)}function sortFieldsByIndex(e,t){var r=t.def.fields.map(pouchdbSelectorCore.getKey);return e.slice().sort(function(e,t){var n=r.indexOf(e),i=r.indexOf(t);return-1===n&&(n=Number.MAX_VALUE),-1===i&&(i=Number.MAX_VALUE),pouchdbSelectorCore.compare(n,i)})}function getBasicInMemoryFields(e,t,r){for(var n=!1,i=0,o=(r=sortFieldsByIndex(r,e)).length;i<o;i++){var s=r[i];if(n||!checkFieldInIndex(e,s))return r.slice(i);i<o-1&&userOperatorLosesPrecision(t,s)&&(n=!0)}return[]}function getInMemoryFieldsFromNe(e){var t=[];return Object.keys(e).forEach(function(r){var n=e[r];Object.keys(n).forEach(function(e){"$ne"===e&&t.push(r)})}),t}function getInMemoryFields(e,t,r,n){return sortFieldsByIndex(uniq(flatten(e,getBasicInMemoryFields(t,r,n),getInMemoryFieldsFromNe(r))),t)}function checkIndexFieldsMatch(e,t,r){if(t){var n=oneArrayIsStrictSubArrayOfOther(t,e),i=oneArrayIsSubArrayOfOther(r,e);return n&&i}return oneSetIsSubArrayOfOther(r,e)}function isNonLogicalMatcher(e){return-1===logicalMatchers.indexOf(e)}function checkFieldsLogicallySound(e,t){var r=t[e[0]];return void 0===r||!!Object.keys(r).some(function(e){return!isNonLogicalMatcher(e)})&&!(1===Object.keys(r).length&&"$ne"===pouchdbSelectorCore.getKey(r))}function checkIndexMatches(e,t,r,n){var i=e.def.fields.map(pouchdbSelectorCore.getKey);return!!checkIndexFieldsMatch(i,t,r)&&checkFieldsLogicallySound(i,n)}function findMatchingIndexes(e,t,r,n){return n.reduce(function(n,i){return checkIndexMatches(i,r,t,e)&&n.push(i),n},[])}function findBestMatchingIndex(e,t,r,n,i){var o=findMatchingIndexes(e,t,r,n);if(0===o.length){if(i)throw{error:"no_usable_index",message:"There is no index available for this selector."};var s=n[0];return s.defaultUsed=!0,s}if(1===o.length&&!i)return o[0];var u=arrayToObject(t);if(i){var a="_design/"+i[0],c=2===i.length&&i[1],l=o.find(function(e){return!(!c||e.ddoc!==a||c!==e.name)||e.ddoc===a});if(!l)throw{error:"unknown_error",message:"Could not find that index or could not use that index for the query"};return l}return max(o,function(e){for(var t=e.def.fields.map(pouchdbSelectorCore.getKey),r=0,n=0,i=t.length;n<i;n++){var o=t[n];u[o]&&r++}return r})}function getSingleFieldQueryOptsFor(e,t){switch(e){case"$eq":return{key:t};case"$lte":return{endkey:t};case"$gte":return{startkey:t};case"$lt":return{endkey:t,inclusive_end:!1};case"$gt":return{startkey:t,inclusive_start:!1}}}function getSingleFieldCoreQueryPlan(e,t){var r,n=pouchdbSelectorCore.getKey(t.def.fields[0]),i=e[n]||{},o=[];return Object.keys(i).forEach(function(e){if(isNonLogicalMatcher(e))o.push(n);else{var t=getSingleFieldQueryOptsFor(e,i[e]);r=r?mergeObjects([r,t]):t}}),{queryOpts:r,inMemoryFields:o}}function getMultiFieldCoreQueryPlan(e,t){switch(e){case"$eq":return{startkey:t,endkey:t};case"$lte":return{endkey:t};case"$gte":return{startkey:t};case"$lt":return{endkey:t,inclusive_end:!1};case"$gt":return{startkey:t,inclusive_start:!1}}}function getMultiFieldQueryOpts(e,t){function r(e){!1!==n&&u.push(COLLATE_LO),!1!==i&&a.push(COLLATE_HI),s=o.slice(e)}for(var n,i,o=t.def.fields.map(pouchdbSelectorCore.getKey),s=[],u=[],a=[],c=0,l=o.length;c<l;c++){var d=e[o[c]];if(!d||!Object.keys(d).length){r(c);break}if(c>0){if(Object.keys(d).some(isNonLogicalMatcher)){r(c);break}var f="$gt"in d||"$gte"in d||"$lt"in d||"$lte"in d,p=Object.keys(e[o[c-1]]),h=arrayEquals(p,["$eq"]),y=arrayEquals(p,Object.keys(d));if(f&&!h&&!y){r(c);break}}for(var g=Object.keys(d),m=null,v=0;v<g.length;v++){var b=g[v],x=getMultiFieldCoreQueryPlan(b,d[b]);m=m?mergeObjects([m,x]):x}u.push("startkey"in m?m.startkey:COLLATE_LO),a.push("endkey"in m?m.endkey:COLLATE_HI),"inclusive_start"in m&&(n=m.inclusive_start),"inclusive_end"in m&&(i=m.inclusive_end)}var k={startkey:u,endkey:a};return void 0!==n&&(k.inclusive_start=n),void 0!==i&&(k.inclusive_end=i),{queryOpts:k,inMemoryFields:s}}function getDefaultQueryPlan(e){return{queryOpts:{startkey:null},inMemoryFields:[Object.keys(e)]}}function getCoreQueryPlan(e,t){return t.defaultUsed?getDefaultQueryPlan(e,t):1===t.def.fields.length?getSingleFieldCoreQueryPlan(e,t):getMultiFieldQueryOpts(e,t)}function planQuery(e,t){var r=e.selector,n=getUserFields(r,e.sort),i=n.fields,o=findBestMatchingIndex(r,i,n.sortOrder,t,e.use_index),s=getCoreQueryPlan(r,o);return{queryOpts:s.queryOpts,index:o,inMemoryFields:getInMemoryFields(s.inMemoryFields,o,r,i)}}function indexToSignature(e){return e.ddoc.substring(8)+"/"+e.name}function doAllDocs(e,t){var r=pouchdbUtils.clone(t);return r.descending?("endkey"in r&&"string"!=typeof r.endkey&&(r.endkey=""),"startkey"in r&&"string"!=typeof r.startkey&&(r.limit=0)):("startkey"in r&&"string"!=typeof r.startkey&&(r.startkey=""),"endkey"in r&&"string"!=typeof r.endkey&&(r.limit=0)),"key"in r&&"string"!=typeof r.key&&(r.limit=0),e.allDocs(r).then(function(e){return e.rows=e.rows.filter(function(e){return!/^_design\//.test(e.id)}),e})}function find$1(e,t,r){return t.selector&&(t.selector=pouchdbSelectorCore.massageSelector(t.selector)),t.sort&&(t.sort=massageSort(t.sort)),t.use_index&&(t.use_index=massageUseIndex(t.use_index)),validateFindRequest(t),getIndexes$1(e).then(function(n){e.constructor.emit("debug",["find","planning query",t]);var i=planQuery(t,n.indexes);e.constructor.emit("debug",["find","query plan",i]);var o=i.index;validateSort(t,o);var s=pouchdbUtils.assign({include_docs:!0,reduce:!1},i.queryOpts);return"startkey"in s&&"endkey"in s&&pouchdbCollate.collate(s.startkey,s.endkey)>0?{docs:[]}:(t.sort&&"string"!=typeof t.sort[0]&&"desc"===pouchdbSelectorCore.getValue(t.sort[0])&&(s.descending=!0,s=reverseOptions(s)),i.inMemoryFields.length||("limit"in t&&(s.limit=t.limit),"skip"in t&&(s.skip=t.skip)),r?Promise.resolve(i,s):Promise.resolve().then(function(){if("_all_docs"===o.name)return doAllDocs(e,s);var t=indexToSignature(o);return abstractMapper.query.call(e,t,s)}).then(function(e){!1===s.inclusive_start&&(e.rows=filterInclusiveStart(e.rows,s.startkey,o)),i.inMemoryFields.length&&(e.rows=pouchdbSelectorCore.filterInMemoryFields(e.rows,t,i.inMemoryFields));var r={docs:e.rows.map(function(e){var r=e.doc;return t.fields?pick(r,t.fields):r})};return o.defaultUsed&&(r.warning="no matching index found, create an index to optimize query time"),r}))})}function explain$1(e,t){return find$1(e,t,!0).then(function(r){return{dbname:e.name,index:r.index,selector:t.selector,range:{start_key:r.queryOpts.startkey,end_key:r.queryOpts.endkey},opts:{use_index:t.use_index||[],bookmark:"nil",limit:t.limit,skip:t.skip,sort:t.sort||{},fields:t.fields,conflicts:!1,r:[49]},limit:t.limit,skip:t.skip||0,fields:t.fields}})}function deleteIndex$1(e,t){if(!t.ddoc)throw new Error("you must supply an index.ddoc when deleting");if(!t.name)throw new Error("you must supply an index.name when deleting");var r=t.ddoc,n=t.name;return pouchdbUtils.upsert(e,r,function(e){return 1===Object.keys(e.views).length&&e.views[n]?{_id:r,_deleted:!0}:(delete e.views[n],e)}).then(function(){return abstractMapper.viewCleanup.apply(e)}).then(function(){return{ok:!0}})}var pouchdbUtils=require("pouchdb-utils"),Promise=_interopDefault(require("pouchdb-promise")),pouchdbSelectorCore=require("pouchdb-selector-core"),abstractMapReduce=_interopDefault(require("pouchdb-abstract-mapreduce")),pouchdbCollate=require("pouchdb-collate"),pouchdbMd5=require("pouchdb-md5"),flatten=getArguments(function(e){for(var t=[],r=0,n=e.length;r<n;r++){var i=e[r];Array.isArray(i)?t=t.concat(flatten.apply(null,i)):t.push(i)}return t}),abstractMapper=abstractMapReduce("indexes",mapper,reducer,ddocValidator),COLLATE_LO=null,COLLATE_HI={"￿":{}},logicalMatchers=["$eq","$gt","$gte","$lt","$lte"],createIndexAsCallback=callbackify(createIndex$1),findAsCallback=callbackify(find$1),explainAsCallback=callbackify(explain$1),getIndexesAsCallback=callbackify(getIndexes$1),deleteIndexAsCallback=callbackify(deleteIndex$1),plugin={};plugin.createIndex=pouchdbUtils.toPromise(function(e,t){if("object"!=typeof e)return t(new Error("you must provide an index to create"));(pouchdbUtils.isRemote(this)?createIndex:createIndexAsCallback)(this,e,t)}),plugin.find=pouchdbUtils.toPromise(function(e,t){if(void 0===t&&(t=e,e=void 0),"object"!=typeof e)return t(new Error("you must provide search parameters to find()"));(pouchdbUtils.isRemote(this)?find:findAsCallback)(this,e,t)}),plugin.explain=pouchdbUtils.toPromise(function(e,t){if(void 0===t&&(t=e,e=void 0),"object"!=typeof e)return t(new Error("you must provide search parameters to explain()"));(pouchdbUtils.isRemote(this)?explain:explainAsCallback)(this,e,t)}),plugin.getIndexes=pouchdbUtils.toPromise(function(e){(pouchdbUtils.isRemote(this)?getIndexes:getIndexesAsCallback)(this,e)}),plugin.deleteIndex=pouchdbUtils.toPromise(function(e,t){if("object"!=typeof e)return t(new Error("you must provide an index to delete"));(pouchdbUtils.isRemote(this)?deleteIndex:deleteIndexAsCallback)(this,e,t)}),module.exports=plugin;

		
	// Pouch DB Authentication
			!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var t;t="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,t.PouchAuthentication=e()}}(function(){var e;return function e(t,n,r){function o(s,a){if(!n[s]){if(!t[s]){var u="function"==typeof require&&require;if(!a&&u)return u(s,!0);if(i)return i(s,!0);var c=new Error("Cannot find module '"+s+"'");throw c.code="MODULE_NOT_FOUND",c}var f=n[s]={exports:{}};t[s][0].call(f.exports,function(e){var n=t[s][1][e];return o(n?n:e)},f,f.exports,e,t,n,r)}return n[s].exports}for(var i="function"==typeof require&&require,s=0;s<r.length;s++)o(r[s]);return o}({1:[function(e,t,n){(function(t){"use strict";function r(e){return"function"==typeof e.getUrl?e.getUrl().replace(/\/[^\/]+\/?$/,""):e.name.replace(/\/[^\/]+\/?$/,"")}var o=e(13),i=e(16);n.getUsersUrl=function(e){return i(r(e),"/_users")},n.getSessionUrl=function(e){return i(r(e),"/_session")},n.once=function(e){var t=!1;return n.getArguments(function(n){if(t)throw console.trace(),new Error("once called  more than once");t=!0,e.apply(this,n)})},n.getArguments=function(e){return function(){for(var t=arguments.length,n=new Array(t),r=-1;++r<t;)n[r]=arguments[r];return e.call(this,n)}},n.toPromise=function(e){return n.getArguments(function(r){var i,s=this,a="function"==typeof r[r.length-1]&&r.pop();a&&(i=function(e,n){t.nextTick(function(){a(e,n)})});var u=new o(function(t,o){try{var i=n.once(function(e,n){e?o(e):t(n)});r.push(i),e.apply(s,r)}catch(e){o(e)}});return i&&u.then(function(e){i(null,e)},i),u.cancel=function(){return this},u})},n.inherits=e(7),n.extend=e(12),n.ajax=e(11),n.clone=function(e){return n.extend(!0,{},e)},n.uuid=e(14).uuid,n.Promise=o}).call(this,e(15))},{11:11,12:12,13:13,14:14,15:15,16:16,7:7}],2:[function(e,t,n){"use strict";function r(e){return function(){var t=arguments.length;if(t){for(var n=[],r=-1;++r<t;)n[r]=arguments[r];return e.call(this,n)}return e.call(this,[])}}t.exports=r},{}],3:[function(e,t,n){function r(){return"WebkitAppearance"in document.documentElement.style||window.console&&(console.firebug||console.exception&&console.table)||navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)&&parseInt(RegExp.$1,10)>=31}function o(){var e=arguments,t=this.useColors;if(e[0]=(t?"%c":"")+this.namespace+(t?" %c":" ")+e[0]+(t?"%c ":" ")+"+"+n.humanize(this.diff),!t)return e;var r="color: "+this.color;e=[e[0],r,"color: inherit"].concat(Array.prototype.slice.call(e,1));var o=0,i=0;return e[0].replace(/%[a-z%]/g,function(e){"%%"!==e&&(o++,"%c"===e&&(i=o))}),e.splice(i,0,r),e}function i(){return"object"==typeof console&&console.log&&Function.prototype.apply.call(console.log,console,arguments)}function s(e){try{null==e?n.storage.removeItem("debug"):n.storage.debug=e}catch(e){}}function a(){var e;try{e=n.storage.debug}catch(e){}return e}function u(){try{return window.localStorage}catch(e){}}n=t.exports=e(4),n.log=i,n.formatArgs=o,n.save=s,n.load=a,n.useColors=r,n.storage="undefined"!=typeof chrome&&"undefined"!=typeof chrome.storage?chrome.storage.local:u(),n.colors=["lightseagreen","forestgreen","goldenrod","dodgerblue","darkorchid","crimson"],n.formatters.j=function(e){return JSON.stringify(e)},n.enable(a())},{4:4}],4:[function(e,t,n){function r(){return n.colors[f++%n.colors.length]}function o(e){function t(){}function o(){var e=o,t=+new Date,i=t-(c||t);e.diff=i,e.prev=c,e.curr=t,c=t,null==e.useColors&&(e.useColors=n.useColors()),null==e.color&&e.useColors&&(e.color=r());var s=Array.prototype.slice.call(arguments);s[0]=n.coerce(s[0]),"string"!=typeof s[0]&&(s=["%o"].concat(s));var a=0;s[0]=s[0].replace(/%([a-z%])/g,function(t,r){if("%%"===t)return t;a++;var o=n.formatters[r];if("function"==typeof o){var i=s[a];t=o.call(e,i),s.splice(a,1),a--}return t}),"function"==typeof n.formatArgs&&(s=n.formatArgs.apply(e,s));var u=o.log||n.log||console.log.bind(console);u.apply(e,s)}t.enabled=!1,o.enabled=!0;var i=n.enabled(e)?o:t;return i.namespace=e,i}function i(e){n.save(e);for(var t=(e||"").split(/[\s,]+/),r=t.length,o=0;o<r;o++)t[o]&&(e=t[o].replace(/\*/g,".*?"),"-"===e[0]?n.skips.push(new RegExp("^"+e.substr(1)+"$")):n.names.push(new RegExp("^"+e+"$")))}function s(){n.enable("")}function a(e){var t,r;for(t=0,r=n.skips.length;t<r;t++)if(n.skips[t].test(e))return!1;for(t=0,r=n.names.length;t<r;t++)if(n.names[t].test(e))return!0;return!1}function u(e){return e instanceof Error?e.stack||e.message:e}n=t.exports=o,n.coerce=u,n.disable=s,n.enable=i,n.enabled=a,n.humanize=e(10),n.names=[],n.skips=[],n.formatters={};var c,f=0},{10:10}],5:[function(e,t,n){function r(){this._events=this._events||{},this._maxListeners=this._maxListeners||void 0}function o(e){return"function"==typeof e}function i(e){return"number"==typeof e}function s(e){return"object"==typeof e&&null!==e}function a(e){return void 0===e}t.exports=r,r.EventEmitter=r,r.prototype._events=void 0,r.prototype._maxListeners=void 0,r.defaultMaxListeners=10,r.prototype.setMaxListeners=function(e){if(!i(e)||e<0||isNaN(e))throw TypeError("n must be a positive number");return this._maxListeners=e,this},r.prototype.emit=function(e){var t,n,r,i,u,c;if(this._events||(this._events={}),"error"===e&&(!this._events.error||s(this._events.error)&&!this._events.error.length)){if(t=arguments[1],t instanceof Error)throw t;var f=new Error('Uncaught, unspecified "error" event. ('+t+")");throw f.context=t,f}if(n=this._events[e],a(n))return!1;if(o(n))switch(arguments.length){case 1:n.call(this);break;case 2:n.call(this,arguments[1]);break;case 3:n.call(this,arguments[1],arguments[2]);break;default:i=Array.prototype.slice.call(arguments,1),n.apply(this,i)}else if(s(n))for(i=Array.prototype.slice.call(arguments,1),c=n.slice(),r=c.length,u=0;u<r;u++)c[u].apply(this,i);return!0},r.prototype.addListener=function(e,t){var n;if(!o(t))throw TypeError("listener must be a function");return this._events||(this._events={}),this._events.newListener&&this.emit("newListener",e,o(t.listener)?t.listener:t),this._events[e]?s(this._events[e])?this._events[e].push(t):this._events[e]=[this._events[e],t]:this._events[e]=t,s(this._events[e])&&!this._events[e].warned&&(n=a(this._maxListeners)?r.defaultMaxListeners:this._maxListeners,n&&n>0&&this._events[e].length>n&&(this._events[e].warned=!0,console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.",this._events[e].length),"function"==typeof console.trace&&console.trace())),this},r.prototype.on=r.prototype.addListener,r.prototype.once=function(e,t){function n(){this.removeListener(e,n),r||(r=!0,t.apply(this,arguments))}if(!o(t))throw TypeError("listener must be a function");var r=!1;return n.listener=t,this.on(e,n),this},r.prototype.removeListener=function(e,t){var n,r,i,a;if(!o(t))throw TypeError("listener must be a function");if(!this._events||!this._events[e])return this;if(n=this._events[e],i=n.length,r=-1,n===t||o(n.listener)&&n.listener===t)delete this._events[e],this._events.removeListener&&this.emit("removeListener",e,t);else if(s(n)){for(a=i;a-- >0;)if(n[a]===t||n[a].listener&&n[a].listener===t){r=a;break}if(r<0)return this;1===n.length?(n.length=0,delete this._events[e]):n.splice(r,1),this._events.removeListener&&this.emit("removeListener",e,t)}return this},r.prototype.removeAllListeners=function(e){var t,n;if(!this._events)return this;if(!this._events.removeListener)return 0===arguments.length?this._events={}:this._events[e]&&delete this._events[e],this;if(0===arguments.length){for(t in this._events)"removeListener"!==t&&this.removeAllListeners(t);return this.removeAllListeners("removeListener"),this._events={},this}if(n=this._events[e],o(n))this.removeListener(e,n);else if(n)for(;n.length;)this.removeListener(e,n[n.length-1]);return delete this._events[e],this},r.prototype.listeners=function(e){var t;return t=this._events&&this._events[e]?o(this._events[e])?[this._events[e]]:this._events[e].slice():[]},r.prototype.listenerCount=function(e){if(this._events){var t=this._events[e];if(o(t))return 1;if(t)return t.length}return 0},r.listenerCount=function(e,t){return e.listenerCount(t)}},{}],6:[function(e,t,n){(function(e){"use strict";function n(){f=!0;for(var e,t,n=l.length;n;){for(t=l,l=[],e=-1;++e<n;)t[e]();n=l.length}f=!1}function r(e){1!==l.push(e)||f||o()}var o,i=e.MutationObserver||e.WebKitMutationObserver;if(i){var s=0,a=new i(n),u=e.document.createTextNode("");a.observe(u,{characterData:!0}),o=function(){u.data=s=++s%2}}else if(e.setImmediate||"undefined"==typeof e.MessageChannel)o="document"in e&&"onreadystatechange"in e.document.createElement("script")?function(){var t=e.document.createElement("script");t.onreadystatechange=function(){n(),t.onreadystatechange=null,t.parentNode.removeChild(t),t=null},e.document.documentElement.appendChild(t)}:function(){setTimeout(n,0)};else{var c=new e.MessageChannel;c.port1.onmessage=n,o=function(){c.port2.postMessage(0)}}var f,l=[];t.exports=r}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],7:[function(e,t,n){"function"==typeof Object.create?t.exports=function(e,t){e.super_=t,e.prototype=Object.create(t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}})}:t.exports=function(e,t){e.super_=t;var n=function(){};n.prototype=t.prototype,e.prototype=new n,e.prototype.constructor=e}},{}],8:[function(e,t,n){(function(e){e("object"==typeof n?n:this)}).call(this,function(e){var t=Array.prototype.slice,n=Array.prototype.forEach,r=function(e){if("object"!=typeof e)throw e+" is not an object";var o=t.call(arguments,1);return n.call(o,function(t){if(t)for(var n in t)"object"==typeof t[n]&&e[n]?r.call(e,e[n],t[n]):e[n]=t[n]}),e};e.extend=r})},{}],9:[function(e,t,n){"use strict";function r(){}function o(e){if("function"!=typeof e)throw new TypeError("resolver must be a function");this.state=g,this.queue=[],this.outcome=void 0,e!==r&&u(this,e)}function i(e,t,n){this.promise=e,"function"==typeof t&&(this.onFulfilled=t,this.callFulfilled=this.otherCallFulfilled),"function"==typeof n&&(this.onRejected=n,this.callRejected=this.otherCallRejected)}function s(e,t,n){p(function(){var r;try{r=t(n)}catch(t){return y.reject(e,t)}r===e?y.reject(e,new TypeError("Cannot resolve promise with itself")):y.resolve(e,r)})}function a(e){var t=e&&e.then;if(e&&"object"==typeof e&&"function"==typeof t)return function(){t.apply(e,arguments)}}function u(e,t){function n(t){i||(i=!0,y.reject(e,t))}function r(t){i||(i=!0,y.resolve(e,t))}function o(){t(r,n)}var i=!1,s=c(o);"error"===s.status&&n(s.value)}function c(e,t){var n={};try{n.value=e(t),n.status="success"}catch(e){n.status="error",n.value=e}return n}function f(e){return e instanceof this?e:y.resolve(new this(r),e)}function l(e){var t=new this(r);return y.reject(t,e)}function d(e){function t(e,t){function r(e){s[t]=e,++a!==o||i||(i=!0,y.resolve(c,s))}n.resolve(e).then(r,function(e){i||(i=!0,y.reject(c,e))})}var n=this;if("[object Array]"!==Object.prototype.toString.call(e))return this.reject(new TypeError("must be an array"));var o=e.length,i=!1;if(!o)return this.resolve([]);for(var s=new Array(o),a=0,u=-1,c=new this(r);++u<o;)t(e[u],u);return c}function h(e){function t(e){n.resolve(e).then(function(e){i||(i=!0,y.resolve(a,e))},function(e){i||(i=!0,y.reject(a,e))})}var n=this;if("[object Array]"!==Object.prototype.toString.call(e))return this.reject(new TypeError("must be an array"));var o=e.length,i=!1;if(!o)return this.resolve([]);for(var s=-1,a=new this(r);++s<o;)t(e[s]);return a}var p=e(6),y={},v=["REJECTED"],m=["FULFILLED"],g=["PENDING"];t.exports=o,o.prototype.catch=function(e){return this.then(null,e)},o.prototype.then=function(e,t){if("function"!=typeof e&&this.state===m||"function"!=typeof t&&this.state===v)return this;var n=new this.constructor(r);if(this.state!==g){var o=this.state===m?e:t;s(n,o,this.outcome)}else this.queue.push(new i(n,e,t));return n},i.prototype.callFulfilled=function(e){y.resolve(this.promise,e)},i.prototype.otherCallFulfilled=function(e){s(this.promise,this.onFulfilled,e)},i.prototype.callRejected=function(e){y.reject(this.promise,e)},i.prototype.otherCallRejected=function(e){s(this.promise,this.onRejected,e)},y.resolve=function(e,t){var n=c(a,t);if("error"===n.status)return y.reject(e,n.value);var r=n.value;if(r)u(e,r);else{e.state=m,e.outcome=t;for(var o=-1,i=e.queue.length;++o<i;)e.queue[o].callFulfilled(t)}return e},y.reject=function(e,t){e.state=v,e.outcome=t;for(var n=-1,r=e.queue.length;++n<r;)e.queue[n].callRejected(t);return e},o.resolve=f,o.reject=l,o.all=d,o.race=h},{6:6}],10:[function(e,t,n){function r(e){if(e=""+e,!(e.length>1e4)){var t=/^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(e);if(t){var n=parseFloat(t[1]),r=(t[2]||"ms").toLowerCase();switch(r){case"years":case"year":case"yrs":case"yr":case"y":return n*l;case"days":case"day":case"d":return n*f;case"hours":case"hour":case"hrs":case"hr":case"h":return n*c;case"minutes":case"minute":case"mins":case"min":case"m":return n*u;case"seconds":case"second":case"secs":case"sec":case"s":return n*a;case"milliseconds":case"millisecond":case"msecs":case"msec":case"ms":return n}}}}function o(e){return e>=f?Math.round(e/f)+"d":e>=c?Math.round(e/c)+"h":e>=u?Math.round(e/u)+"m":e>=a?Math.round(e/a)+"s":e+"ms"}function i(e){return s(e,f,"day")||s(e,c,"hour")||s(e,u,"minute")||s(e,a,"second")||e+" ms"}function s(e,t,n){if(!(e<t))return e<1.5*t?Math.floor(e/t)+" "+n:Math.ceil(e/t)+" "+n+"s"}var a=1e3,u=60*a,c=60*u,f=24*c,l=365.25*f;t.exports=function(e,t){return t=t||{},"string"==typeof e?r(e):t.long?i(e):o(e)}},{}],11:[function(e,t,n){"use strict";function r(e){return e&&"object"==typeof e&&"default"in e?e.default:e}function o(e,t){e=e||[],t=t||{};try{return new Blob(e,t)}catch(i){if("TypeError"!==i.name)throw i;for(var n="undefined"!=typeof BlobBuilder?BlobBuilder:"undefined"!=typeof MSBlobBuilder?MSBlobBuilder:"undefined"!=typeof MozBlobBuilder?MozBlobBuilder:WebKitBlobBuilder,r=new n,o=0;o<e.length;o+=1)r.append(e[o]);return r.getBlob(t.type)}}function i(e,t){if("undefined"==typeof FileReader)return t((new FileReaderSync).readAsArrayBuffer(e));var n=new FileReader;n.onloadend=function(e){var n=e.target.result||new ArrayBuffer(0);t(n)},n.readAsArrayBuffer(e)}function s(){for(var e={},t=new A(function(t,n){e.resolve=t,e.reject=n}),n=new Array(arguments.length),r=0;r<n.length;r++)n[r]=arguments[r];return e.promise=t,A.resolve().then(function(){return fetch.apply(null,n)}).then(function(t){e.resolve(t)}).catch(function(t){e.reject(t)}),e}function a(e,t){var n,r,o,a=new Headers,u={method:e.method,credentials:"include",headers:a};return e.json&&(a.set("Accept","application/json"),a.set("Content-Type",e.headers["Content-Type"]||"application/json")),e.body&&e.body instanceof Blob?i(e.body,function(e){u.body=e}):e.body&&e.processData&&"string"!=typeof e.body?u.body=JSON.stringify(e.body):"body"in e?u.body=e.body:u.body=null,Object.keys(e.headers).forEach(function(t){e.headers.hasOwnProperty(t)&&a.set(t,e.headers[t])}),n=s(e.url,u),e.timeout>0&&(r=setTimeout(function(){n.reject(new Error("Load timeout for resource: "+e.url))},e.timeout)),n.promise.then(function(t){return o={statusCode:t.status},e.timeout>0&&clearTimeout(r),o.statusCode>=200&&o.statusCode<300?e.binary?t.blob():t.text():t.json()}).then(function(e){o.statusCode>=200&&o.statusCode<300?t(null,o,e):t(e,o)}).catch(function(e){t(e,o)}),{abort:n.reject}}function u(e,t){var n,r,s=!1,a=function(){n.abort(),f()},u=function(){s=!0,n.abort(),f()},c={abort:a},f=function(){clearTimeout(r),c.abort=function(){},n&&(n.onprogress=void 0,n.upload&&(n.upload.onprogress=void 0),n.onreadystatechange=void 0,n=void 0)};n=e.xhr?new e.xhr:new XMLHttpRequest;try{n.open(e.method,e.url)}catch(e){return t(new Error(e.name||"Url is invalid"))}n.withCredentials=!("withCredentials"in e)||e.withCredentials,"GET"===e.method?delete e.headers["Content-Type"]:e.json&&(e.headers.Accept="application/json",e.headers["Content-Type"]=e.headers["Content-Type"]||"application/json",e.body&&e.processData&&"string"!=typeof e.body&&(e.body=JSON.stringify(e.body))),e.binary&&(n.responseType="arraybuffer"),"body"in e||(e.body=null);for(var l in e.headers)e.headers.hasOwnProperty(l)&&n.setRequestHeader(l,e.headers[l]);return e.timeout>0&&(r=setTimeout(u,e.timeout),n.onprogress=function(){clearTimeout(r),4!==n.readyState&&(r=setTimeout(u,e.timeout))},"undefined"!=typeof n.upload&&(n.upload.onprogress=n.onprogress)),n.onreadystatechange=function(){if(4===n.readyState){var r={statusCode:n.status};if(n.status>=200&&n.status<300){var i;i=e.binary?o([n.response||""],{type:n.getResponseHeader("Content-Type")}):n.responseText,t(null,r,i)}else{var a={};if(s)a=new Error("ETIMEDOUT"),a.code="ETIMEDOUT";else if("string"==typeof n.response)try{a=JSON.parse(n.response)}catch(e){}a.status=n.status,t(a)}f()}},e.body&&e.body instanceof Blob?i(e.body,function(e){n.send(e)}):n.send(e.body),c}function c(){try{return new XMLHttpRequest,!0}catch(e){return!1}}function f(e,t){return q||e.xhr?u(e,t):a(e,t)}function l(e){Error.call(this,e.reason),this.status=e.status,this.name=e.error,this.message=e.reason,this.error=!0}function d(e){if("object"!=typeof e){var t=e;e=P,e.data=t}return"error"in e&&"conflict"===e.error&&(e.name="conflict",e.status=409),"name"in e||(e.name=e.error||"unknown"),"status"in e||(e.status=500),"message"in e||(e.message=e.message||e.reason),e}function h(e){return"undefined"!=typeof ArrayBuffer&&e instanceof ArrayBuffer||"undefined"!=typeof Blob&&e instanceof Blob}function p(e){if("function"==typeof e.slice)return e.slice(0);var t=new ArrayBuffer(e.byteLength),n=new Uint8Array(t),r=new Uint8Array(e);return n.set(r),t}function y(e){if(e instanceof ArrayBuffer)return p(e);var t=e.size,n=e.type;return"function"==typeof e.slice?e.slice(0,t,n):e.webkitSlice(0,t,n)}function v(e){var t=Object.getPrototypeOf(e);if(null===t)return!0;var n=t.constructor;return"function"==typeof n&&n instanceof n&&B.call(n)==D}function m(e){var t,n,r;if(!e||"object"!=typeof e)return e;if(Array.isArray(e)){for(t=[],n=0,r=e.length;n<r;n++)t[n]=m(e[n]);return t}if(e instanceof Date)return e.toISOString();if(h(e))return y(e);if(!v(e))return e;t={};for(n in e)if(Object.prototype.hasOwnProperty.call(e,n)){var o=m(e[n]);"undefined"!=typeof o&&(t[n]=o)}return t}function g(e,t){for(var n={},r=0,o=t.length;r<o;r++){var i=t[r];i in e&&(n[i]=e[i])}return n}function w(){return"undefined"!=typeof chrome&&"undefined"!=typeof chrome.storage&&"undefined"!=typeof chrome.storage.local}function b(){return U}function _(e){w()?chrome.storage.onChanged.addListener(function(t){null!=t.db_name&&e.emit(t.dbName.newValue)}):b()&&("undefined"!=typeof addEventListener?addEventListener("storage",function(t){e.emit(t.key)}):window.attachEvent("storage",function(t){e.emit(t.key)}))}function j(){C.EventEmitter.call(this),this._listeners={},_(this)}function x(){return""}function E(e,t){function n(t,n,r){if(!e.binary&&e.json&&"string"==typeof t)try{t=JSON.parse(t)}catch(e){return r(e)}Array.isArray(t)&&(t=t.map(function(e){return e.error||e.missing?d(e):e})),e.binary&&N(t,n),r(null,t,n)}e=m(e);var r={method:"GET",headers:{},json:!0,processData:!0,timeout:1e4,cache:!1};return e=S.extend(r,e),e.json&&(e.binary||(e.headers.Accept="application/json"),e.headers["Content-Type"]=e.headers["Content-Type"]||"application/json"),e.binary&&(e.encoding=null,e.json=!1),e.processData||(e.json=!1),f(e,function(r,o,i){if(r)return t(d(r));var s,a=o.headers&&o.headers["content-type"],u=i||x();if(!e.binary&&(e.json||!e.processData)&&"object"!=typeof u&&(/json/.test(a)||/^[\s]*\{/.test(u)&&/\}[\s]*$/.test(u)))try{u=JSON.parse(u.toString())}catch(e){}o.statusCode>=200&&o.statusCode<300?n(u,o,t):(s=d(u),s.status=o.statusCode,t(s))})}function T(e,t){var n=navigator&&navigator.userAgent?navigator.userAgent.toLowerCase():"",r=n.indexOf("safari")!==-1&&n.indexOf("chrome")===-1,o=n.indexOf("msie")!==-1,i=n.indexOf("edge")!==-1,s=r||(o||i)&&"GET"===e.method,a=!("cache"in e)||e.cache,u=/^blob:/.test(e.url);if(!u&&(s||!a)){var c=e.url.indexOf("?")!==-1;e.url+=(c?"&":"?")+"_nonce="+Date.now()}return E(e,t)}var O=r(e(9)),S=e(8),L=r(e(7)),k=(r(e(2)),r(e(3))),C=e(5),A="function"==typeof Promise?Promise:O,q=c();L(l,Error),l.prototype.toString=function(){return JSON.stringify({status:this.status,name:this.name,message:this.message,reason:this.reason})};var U,P=(new l({status:401,error:"unauthorized",reason:"Name or password is incorrect."}),new l({status:400,error:"bad_request",reason:"Missing JSON list of 'docs'"}),new l({status:404,error:"not_found",reason:"missing"}),new l({status:409,error:"conflict",reason:"Document update conflict"}),new l({status:400,error:"bad_request",reason:"_id field must contain a string"}),new l({status:412,error:"missing_id",reason:"_id is required for puts"}),new l({status:400,error:"bad_request",reason:"Only reserved document ids may start with underscore."}),new l({status:412,error:"precondition_failed",reason:"Database not open"}),new l({status:500,error:"unknown_error",reason:"Database encountered an unknown error"})),B=(new l({status:500,error:"badarg",reason:"Some query argument is invalid"}),new l({status:400,error:"invalid_request",reason:"Request was invalid"}),new l({status:400,error:"query_parse_error",reason:"Some query parameter is invalid"}),new l({status:500,error:"doc_validation",reason:"Bad special document member"}),new l({status:400,error:"bad_request",reason:"Something wrong with the request"}),new l({status:400,error:"bad_request",reason:"Document must be a JSON object"}),new l({status:404,error:"not_found",reason:"Database not found"}),new l({status:500,error:"indexed_db_went_bad",reason:"unknown"}),new l({status:500,error:"web_sql_went_bad",reason:"unknown"}),new l({status:500,error:"levelDB_went_went_bad",reason:"unknown"}),new l({status:403,error:"forbidden",reason:"Forbidden by design doc validate_doc_update function"}),new l({status:400,error:"bad_request",reason:"Invalid rev format"}),new l({status:412,error:"file_exists",reason:"The database could not be created, the file already exists."}),new l({status:412,error:"missing_stub"}),new l({status:413,error:"invalid_url",reason:"Provided URL is invalid"}),Function.prototype.toString),D=B.call(Object);k("pouchdb:api");if(w())U=!1;else try{localStorage.setItem("_pouch_check_localstorage",1),U=!!localStorage.getItem("_pouch_check_localstorage")}catch(e){U=!1}L(j,C.EventEmitter),j.prototype.addListener=function(e,t,n,r){function o(){function e(){s=!1}if(i._listeners[t]){if(s)return void(s="waiting");s=!0;var a=g(r,["style","include_docs","attachments","conflicts","filter","doc_ids","view","since","query_params","binary"]);n.changes(a).on("change",function(e){e.seq>r.since&&!r.cancelled&&(r.since=e.seq,r.onChange(e))}).on("complete",function(){"waiting"===s&&setTimeout(function(){o()},0),s=!1}).on("error",e)}}if(!this._listeners[t]){var i=this,s=!1;this._listeners[t]=o,this.on(e,o)}},j.prototype.removeListener=function(e,t){t in this._listeners&&(C.EventEmitter.prototype.removeListener.call(this,e,this._listeners[t]),delete this._listeners[t])},j.prototype.notifyLocalWindows=function(e){w()?chrome.storage.local.set({dbName:e}):b()&&(localStorage[e]="a"===localStorage[e]?"b":"a")},j.prototype.notify=function(e){this.emit(e),this.notifyLocalWindows(e)};var N=("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(""),function(){});t.exports=T},{2:2,3:3,5:5,7:7,8:8,9:9}],12:[function(e,t,n){"use strict";function r(e){return null===e?String(e):"object"==typeof e||"function"==typeof e?c[h.call(e)]||"object":typeof e}function o(e){return null!==e&&e===e.window}function i(e){if(!e||"object"!==r(e)||e.nodeType||o(e))return!1;try{if(e.constructor&&!p.call(e,"constructor")&&!p.call(e.constructor.prototype,"isPrototypeOf"))return!1}catch(e){return!1}var t;for(t in e);return void 0===t||p.call(e,t)}function s(e){return"function"===r(e)}function a(){for(var e=[],t=-1,n=arguments.length,r=new Array(n);++t<n;)r[t]=arguments[t];var o={};e.push({args:r,result:{container:o,key:"key"}});for(var i;i=e.pop();)u(e,i.args,i.result);return o.key}function u(e,t,n){var r,o,a,u,c,f,l,d=t[0]||{},h=1,p=t.length,v=!1,m=/\d+/;for("boolean"==typeof d&&(v=d,d=t[1]||{},h=2),"object"==typeof d||s(d)||(d={}),p===h&&(d=this,--h);h<p;h++)if(null!=(r=t[h])){l=y(r);for(o in r)if(!(o in Object.prototype)){if(l&&!m.test(o))continue;if(a=d[o],u=r[o],d===u)continue;v&&u&&(i(u)||(c=y(u)))?(c?(c=!1,f=a&&y(a)?a:[]):f=a&&i(a)?a:{},e.push({args:[v,f,u],result:{container:d,key:o}})):void 0!==u&&(y(r)&&s(u)||(d[o]=u))}}n.container[n.key]=d}for(var c={},f=["Boolean","Number","String","Function","Array","Date","RegExp","Object","Error"],l=0;l<f.length;l++){var d=f[l];c["[object "+d+"]"]=d.toLowerCase()}var h=c.toString,p=c.hasOwnProperty,y=Array.isArray||function(e){return"array"===r(e)};t.exports=a},{}],13:[function(e,t,n){"use strict";function r(e){return e&&"object"==typeof e&&"default"in e?e.default:e}var o=r(e(9)),i="function"==typeof Promise?Promise:o;t.exports=i},{9:9}],14:[function(e,t,n){(function(t){"use strict";function r(e){return e&&"object"==typeof e&&"default"in e?e.default:e}function o(e){return"undefined"!=typeof ArrayBuffer&&e instanceof ArrayBuffer||"undefined"!=typeof Blob&&e instanceof Blob}function i(e){if("function"==typeof e.slice)return e.slice(0);var t=new ArrayBuffer(e.byteLength),n=new Uint8Array(t),r=new Uint8Array(e);return n.set(r),t}function s(e){if(e instanceof ArrayBuffer)return i(e);var t=e.size,n=e.type;return"function"==typeof e.slice?e.slice(0,t,n):e.webkitSlice(0,t,n)}function a(e){var t=Object.getPrototypeOf(e);if(null===t)return!0;var n=t.constructor;return"function"==typeof n&&n instanceof n&&K.call(n)==V}function u(e){var t,n,r;if(!e||"object"!=typeof e)return e;if(Array.isArray(e)){for(t=[],n=0,r=e.length;n<r;n++)t[n]=u(e[n]);return t}if(e instanceof Date)return e.toISOString();if(o(e))return s(e);if(!a(e))return e;t={};for(n in e)if(Object.prototype.hasOwnProperty.call(e,n)){var i=u(e[n]);"undefined"!=typeof i&&(t[n]=i)}return t}function c(e){var t=!1;return $(function(n){if(t)throw new Error("once called more than once");t=!0,e.apply(this,n)})}function f(e){return $(function(n){n=u(n);var r,o=this,i="function"==typeof n[n.length-1]&&n.pop();i&&(r=function(e,n){t.nextTick(function(){i(e,n)})});var s=new H(function(t,r){var i;try{var s=c(function(e,n){e?r(e):t(n)});n.push(s),i=e.apply(o,n),i&&"function"==typeof i.then&&t(i)}catch(e){r(e)}});return r&&s.then(function(e){r(null,e)},r),s})}function l(e,t){function n(e,t,n){if(X.enabled){for(var r=[e.name,t],o=0;o<n.length-1;o++)r.push(n[o]);X.apply(null,r);var i=n[n.length-1];n[n.length-1]=function(n,r){var o=[e.name,t];o=o.concat(n?["error",n]:["success",r]),X.apply(null,o),i(n,r)}}}return f($(function(r){if(this._closed)return H.reject(new Error("database is closed"));if(this._destroyed)return H.reject(new Error("database is destroyed"));var o=this;return n(o,e,r),this.taskqueue.isReady?t.apply(this,r):new H(function(t,n){o.taskqueue.addTask(function(i){i?n(i):t(o[e].apply(o,r))})})}))}function d(e,t){for(var n={},r=0,o=t.length;r<o;r++){var i=t[r];i in e&&(n[i]=e[i])}return n}function h(e){return e}function p(e){return[{ok:e}]}function y(e,t,n){function r(){var e=[];y.forEach(function(t){t.docs.forEach(function(n){e.push({id:t.id,docs:[n]})})}),n(null,{results:e})}function o(){++l===f&&r()}function i(e,t,n){y[e]={id:t,docs:n},o()}function s(){if(!(m>=v.length)){var e=Math.min(m+Q,v.length),t=v.slice(m,e);a(t,m),m+=t.length}}function a(n,r){n.forEach(function(n,o){var a=r+o,u=c[n],f=d(u[0],["atts_since","attachments"]);f.open_revs=u.map(function(e){return e.rev}),f.open_revs=f.open_revs.filter(h);var l=h;0===f.open_revs.length&&(delete f.open_revs,l=p),["revs","attachments","binary","ajax"].forEach(function(e){e in t&&(f[e]=t[e])}),e.get(n,f,function(e,t){var r;r=e?[{error:e}]:l(t),i(a,n,r),s()})})}var u=t.docs,c={};u.forEach(function(e){e.id in c?c[e.id].push(e):c[e.id]=[e]});var f=Object.keys(c).length,l=0,y=new Array(f),v=Object.keys(c),m=0;s()}function v(){return"undefined"!=typeof chrome&&"undefined"!=typeof chrome.storage&&"undefined"!=typeof chrome.storage.local}function m(){return J}function g(e){v()?chrome.storage.onChanged.addListener(function(t){null!=t.db_name&&e.emit(t.dbName.newValue)}):m()&&("undefined"!=typeof addEventListener?addEventListener("storage",function(t){e.emit(t.key)}):window.attachEvent("storage",function(t){e.emit(t.key)}))}function w(){W.EventEmitter.call(this),this._listeners={},g(this)}function b(e){if("undefined"!==console&&e in console){var t=Array.prototype.slice.call(arguments,1);console[e].apply(console,t)}}function _(e,t){var n=6e5;e=parseInt(e,10)||0,t=parseInt(t,10),t!==t||t<=e?t=(e||1)<<1:t+=1,t>n&&(e=n>>1,t=n);var r=Math.random(),o=t-e;return~~(o*r+e)}function j(e){var t=0;return e||(t=2e3),_(e,t)}function x(e,t){b("info","The above "+e+" is totally normal. "+t)}function E(e,t){for(var n in t)if(t.hasOwnProperty(n)){var r=u(t[n]);"undefined"!=typeof r&&(e[n]=r)}}function T(e,t,n){return E(e,t),n&&E(e,n),e}function O(e){Error.call(this,e.reason),this.status=e.status,this.name=e.error,this.message=e.reason,this.error=!0}function S(e,t){function n(t){for(var n in e)"function"!=typeof e[n]&&(this[n]=e[n]);void 0!==t&&(this.reason=t)}return n.prototype=O.prototype,new n(t)}function L(e,t,n){try{return!e(t,n)}catch(e){var r="Filter function threw: "+e.toString();return S(re,r)}}function k(e){var t={},n=e.filter&&"function"==typeof e.filter;return t.query=e.query_params,function(r){r.doc||(r.doc={});var o=n&&L(e.filter,r.doc,t);if("object"==typeof o)return o;if(o)return!1;if(e.include_docs){if(!e.attachments)for(var i in r.doc._attachments)r.doc._attachments.hasOwnProperty(i)&&(r.doc._attachments[i].stub=!0)}else delete r.doc;return!0}}function C(e){for(var t=[],n=0,r=e.length;n<r;n++)t=t.concat(e[n]);return t}function A(){}function q(e){var t;if(e?"string"!=typeof e?t=S(ee):/^_/.test(e)&&!/^_(design|local)/.test(e)&&(t=S(ne)):t=S(te),t)throw t}function U(){return"undefined"!=typeof cordova||"undefined"!=typeof PhoneGap||"undefined"!=typeof phonegap}function P(e,t){return"listenerCount"in e?e.listenerCount(t):W.EventEmitter.listenerCount(e,t)}function B(e){if(!e)return null;var t=e.split("/");return 2===t.length?t:1===t.length?[e,e]:null}function D(e){var t=B(e);return t?t.join("/"):null}function N(e){for(var t=ce.exec(e),n={},r=14;r--;){var o=se[r],i=t[r]||"",s=["user","password"].indexOf(o)!==-1;n[o]=s?decodeURIComponent(i):i}return n[ae]={},n[se[12]].replace(ue,function(e,t,r){t&&(n[ae][t]=r)}),n}function M(e,t,n){return new H(function(r,o){e.get(t,function(i,s){if(i){if(404!==i.status)return o(i);s={}}var a=s._rev,u=n(s);return u?(u._id=t,u._rev=a,void r(R(e,u,n))):r({updated:!1,rev:a})})})}function R(e,t,n){return e.put(t).then(function(e){return{updated:!0,rev:e.rev}},function(r){if(409!==r.status)throw r;return M(e,t._id,n)})}function I(e){return 0|Math.random()*e}function F(e,t){t=t||fe.length;var n="",r=-1;if(e){for(;++r<e;)n+=fe[I(t)];return n}for(;++r<36;)switch(r){case 8:case 13:case 18:case 23:n+="-";break;case 19:n+=fe[3&I(16)|8];break;default:n+=fe[I(16)]}return n}Object.defineProperty(n,"__esModule",{value:!0});var J,z=r(e(9)),$=r(e(2)),G=r(e(3)),W=e(5),Y=r(e(7)),H="function"==typeof Promise?Promise:z,K=Function.prototype.toString,V=K.call(Object),X=G("pouchdb:api"),Q=6;if(v())J=!1;else try{localStorage.setItem("_pouch_check_localstorage",1),J=!!localStorage.getItem("_pouch_check_localstorage")}catch(e){J=!1}Y(w,W.EventEmitter),w.prototype.addListener=function(e,t,n,r){function o(){function e(){s=!1}if(i._listeners[t]){if(s)return void(s="waiting");s=!0;var a=d(r,["style","include_docs","attachments","conflicts","filter","doc_ids","view","since","query_params","binary"]); n.changes(a).on("change",function(e){e.seq>r.since&&!r.cancelled&&(r.since=e.seq,r.onChange(e))}).on("complete",function(){"waiting"===s&&setTimeout(function(){o()},0),s=!1}).on("error",e)}}if(!this._listeners[t]){var i=this,s=!1;this._listeners[t]=o,this.on(e,o)}},w.prototype.removeListener=function(e,t){t in this._listeners&&(W.EventEmitter.prototype.removeListener.call(this,e,this._listeners[t]),delete this._listeners[t])},w.prototype.notifyLocalWindows=function(e){v()?chrome.storage.local.set({dbName:e}):m()&&(localStorage[e]="a"===localStorage[e]?"b":"a")},w.prototype.notify=function(e){this.emit(e),this.notifyLocalWindows(e)},Y(O,Error),O.prototype.toString=function(){return JSON.stringify({status:this.status,name:this.name,message:this.message,reason:this.reason})};var Z,ee=(new O({status:401,error:"unauthorized",reason:"Name or password is incorrect."}),new O({status:400,error:"bad_request",reason:"Missing JSON list of 'docs'"}),new O({status:404,error:"not_found",reason:"missing"}),new O({status:409,error:"conflict",reason:"Document update conflict"}),new O({status:400,error:"bad_request",reason:"_id field must contain a string"})),te=new O({status:412,error:"missing_id",reason:"_id is required for puts"}),ne=new O({status:400,error:"bad_request",reason:"Only reserved document ids may start with underscore."}),re=(new O({status:412,error:"precondition_failed",reason:"Database not open"}),new O({status:500,error:"unknown_error",reason:"Database encountered an unknown error"}),new O({status:500,error:"badarg",reason:"Some query argument is invalid"}),new O({status:400,error:"invalid_request",reason:"Request was invalid"}),new O({status:400,error:"query_parse_error",reason:"Some query parameter is invalid"}),new O({status:500,error:"doc_validation",reason:"Bad special document member"}),new O({status:400,error:"bad_request",reason:"Something wrong with the request"})),oe=(new O({status:400,error:"bad_request",reason:"Document must be a JSON object"}),new O({status:404,error:"not_found",reason:"Database not found"}),new O({status:500,error:"indexed_db_went_bad",reason:"unknown"}),new O({status:500,error:"web_sql_went_bad",reason:"unknown"}),new O({status:500,error:"levelDB_went_went_bad",reason:"unknown"}),new O({status:403,error:"forbidden",reason:"Forbidden by design doc validate_doc_update function"}),new O({status:400,error:"bad_request",reason:"Invalid rev format"}),new O({status:412,error:"file_exists",reason:"The database could not be created, the file already exists."}),new O({status:412,error:"missing_stub"}),new O({status:413,error:"invalid_url",reason:"Provided URL is invalid"}),A.name);Z=oe?function(e){return e.name}:function(e){return e.toString().match(/^\s*function\s*(\S*)\s*\(/)[1]};var ie=Z,se=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],ae="queryKey",ue=/(?:^|&)([^&=]*)=?([^&]*)/g,ce=/^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,fe="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");n.adapterFun=l,n.bulkGetShim=y,n.changesHandler=w,n.clone=u,n.defaultBackOff=j,n.explainError=x,n.extend=T,n.filterChange=k,n.flatten=C,n.functionName=ie,n.guardedConsole=b,n.hasLocalStorage=m,n.invalidIdError=q,n.isChromeApp=v,n.isCordova=U,n.listenerCount=P,n.normalizeDdocFunctionName=D,n.once=c,n.parseDdocFunctionName=B,n.parseUri=N,n.pick=d,n.toPromise=f,n.upsert=M,n.uuid=F}).call(this,e(15))},{15:15,2:2,3:3,5:5,7:7,9:9}],15:[function(e,t,n){function r(){throw new Error("setTimeout has not been defined")}function o(){throw new Error("clearTimeout has not been defined")}function i(e){if(l===setTimeout)return setTimeout(e,0);if((l===r||!l)&&setTimeout)return l=setTimeout,setTimeout(e,0);try{return l(e,0)}catch(t){try{return l.call(null,e,0)}catch(t){return l.call(this,e,0)}}}function s(e){if(d===clearTimeout)return clearTimeout(e);if((d===o||!d)&&clearTimeout)return d=clearTimeout,clearTimeout(e);try{return d(e)}catch(t){try{return d.call(null,e)}catch(t){return d.call(this,e)}}}function a(){v&&p&&(v=!1,p.length?y=p.concat(y):m=-1,y.length&&u())}function u(){if(!v){var e=i(a);v=!0;for(var t=y.length;t;){for(p=y,y=[];++m<t;)p&&p[m].run();m=-1,t=y.length}p=null,v=!1,s(e)}}function c(e,t){this.fun=e,this.array=t}function f(){}var l,d,h=t.exports={};!function(){try{l="function"==typeof setTimeout?setTimeout:r}catch(e){l=r}try{d="function"==typeof clearTimeout?clearTimeout:o}catch(e){d=o}}();var p,y=[],v=!1,m=-1;h.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)t[n-1]=arguments[n];y.push(new c(e,t)),1!==y.length||v||i(u)},c.prototype.run=function(){this.fun.apply(null,this.array)},h.title="browser",h.browser=!0,h.env={},h.argv=[],h.version="",h.versions={},h.on=f,h.addListener=f,h.once=f,h.off=f,h.removeListener=f,h.removeAllListeners=f,h.emit=f,h.binding=function(e){throw new Error("process.binding is not supported")},h.cwd=function(){return"/"},h.chdir=function(e){throw new Error("process.chdir is not supported")},h.umask=function(){return 0}},{}],16:[function(t,n,r){!function(t,r,o){"undefined"!=typeof n&&n.exports?n.exports=o():"function"==typeof e&&e.amd?e(o):r[t]=o()}("urljoin",this,function(){function e(e,t){return e=e.replace(/:\//g,"://"),e=e.replace(/([^:\s])\/+/g,"$1/"),e=e.replace(/\/(\?|&|#[^!])/g,"$1"),e=e.replace(/(\?.+)\?/g,"$1&")}return function(){var t=arguments,n={};"object"==typeof arguments[0]&&(t=arguments[0],n=arguments[1]||{});var r=[].slice.call(t,0).join("/");return e(r,n)}})},{}],17:[function(e,t,n){"use strict";function r(e){return function(t,n){return t&&"unknown_error"===t.name&&(t.message=(t.message||"")+" Unknown error!  Did you remember to enable CORS?"),e(t,n)}}function o(e,t,n,o){var a=["name","password","roles","type","salt","metadata"];if(n.metadata){for(var u in n.metadata)if(n.hasOwnProperty(u)&&(a.indexOf(u)!==-1||u.startsWith("_")))return o(new i('cannot use reserved word in metadata: "'+u+'"'));t=s.extend(!0,t,n.metadata)}var c=s.getUsersUrl(e)+"/"+encodeURIComponent(t._id),f=s.extend(!0,{method:"PUT",url:c,body:t},n.ajax||{});s.ajax(f,r(o))}function i(e){this.status=400,this.name="authentication_error",this.message=e,this.error=!0;try{Error.captureStackTrace(this,i)}catch(e){}}var s=e(1);n.signup=s.toPromise(function(e,t,n,r){var s=this;if("undefined"==typeof r&&(r="undefined"==typeof n?"undefined"==typeof t?e:t:n,n={}),["http","https"].indexOf(s.type())===-1)return r(new i('This plugin only works for the http/https adapter. So you should use new PouchDB("http://mysite.com:5984/mydb") instead.'));if(!e)return r(new i("You must provide a username"));if(!t)return r(new i("You must provide a password"));var a="org.couchdb.user:"+e,u={name:e,password:t,roles:n.roles||[],type:"user",_id:a};o(s,u,n,r)}),n.signUp=n.signup,n.login=s.toPromise(function(e,t,n,o){var a=this;if("undefined"==typeof o&&(o=n,n={}),["http","https"].indexOf(a.type())===-1)return o(new i("this plugin only works for the http/https adapter"));if(!e)return o(new i("you must provide a username"));if(!t)return o(new i("you must provide a password"));var u=s.extend(!0,{method:"POST",url:s.getSessionUrl(a),headers:{"Content-Type":"application/json"},body:JSON.stringify({name:e,password:t})},n.ajax||{});s.ajax(u,r(o))}),n.logIn=n.login,n.logout=s.toPromise(function(e,t){var n=this;"undefined"==typeof t&&(t=e,e={});var o=s.extend(!0,{method:"DELETE",url:s.getSessionUrl(n)},e.ajax||{});s.ajax(o,r(t))}),n.logOut=n.logout,n.getSession=s.toPromise(function(e,t){var n=this;"undefined"==typeof t&&(t=e,e={});var o=s.getSessionUrl(n),i=s.extend(!0,{method:"GET",url:o},e.ajax||{});s.ajax(i,r(t))}),n.getUser=s.toPromise(function(e,t,n){var o=this;if("undefined"==typeof n&&(n="undefined"==typeof t?e:t,t={}),!e)return n(new i("you must provide a username"));var a=s.getUsersUrl(o),u=s.extend(!0,{method:"GET",url:a+"/"+encodeURIComponent("org.couchdb.user:"+e)},t.ajax||{});s.ajax(u,r(n))}),n.putUser=s.toPromise(function(e,t,n){var r=this;return"undefined"==typeof n&&(n="undefined"==typeof t?e:t,t={}),["http","https"].indexOf(r.type())===-1?n(new i('This plugin only works for the http/https adapter. So you should use new PouchDB("http://mysite.com:5984/mydb") instead.')):e?r.getUser(e,t,function(e,i){return e?n(e):void o(r,i,t,n)}):n(new i("You must provide a username"))}),n.changePassword=s.toPromise(function(e,t,n,o){var a=this;return"undefined"==typeof o&&(o="undefined"==typeof n?"undefined"==typeof t?e:t:n,n={}),["http","https"].indexOf(a.type())===-1?o(new i('This plugin only works for the http/https adapter. So you should use new PouchDB("http://mysite.com:5984/mydb") instead.')):e?t?a.getUser(e,n,function(e,i){if(e)return o(e);i.password=t;var u=s.getUsersUrl(a)+"/"+encodeURIComponent(i._id),c=s.extend(!0,{method:"PUT",url:u,body:i},n.ajax||{});s.ajax(c,r(o))}):o(new i("You must provide a password")):o(new i("You must provide a username"))}),n.changeUsername=s.toPromise(function(e,t,n,o){var a=this,u="org.couchdb.user:",c=function(e){return new s.Promise(function(t,n){s.ajax(e,r(function(e,r){return e?n(e):void t(r)}))})},f=function(e,t){var n=s.getUsersUrl(a)+"/"+encodeURIComponent(e._id),r=s.extend(!0,{method:"PUT",url:n,body:e},t.ajax);return c(r)};return"undefined"==typeof o&&(o=n,n={}),n.ajax=n.ajax||{},["http","https"].indexOf(a.type())===-1?o(new i('This plugin only works for the http/https adapter. So you should use new PouchDB("http://mysite.com:5984/mydb") instead.')):t?e?a.getUser(t,n).then(function(){var e=new i("user already exists");throw e.taken=!0,e},function(){return a.getUser(e,n)}).then(function(e){var r=s.clone(e);return delete r._rev,r._id=u+t,r.name=t,r.roles=n.roles||e.roles||{},f(r,n).then(function(){return e._deleted=!0,f(e,n)})}).then(function(e){o(null,e)}).catch(o):o(new i("You must provide a username to rename")):o(new i("You must provide a new username"))}),s.inherits(i,Error),"undefined"!=typeof window&&window.PouchDB&&window.PouchDB.plugin(n)},{1:1}]},{},[17])(17)});		


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
        
    if (dDataProto.hasOwnProperty("value") ){
        setupRootDData(dDataProto);
        return 0; /* this element has already been registered */ 
    }
    
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
        setupTemplates(dDataProto);
        setupChildTemplates(dDataProto);

        // Setup any extensions that may be available in dData.extensions
        evaluateElementForExtensions(dDataProto, dDataProto);
        setupExtensions(dDataProto, dDataProto); 

        // if this is a root d-data element, setup scope and initial data
        setupRootDData(dDataProto);

        // Dispatch Event for builtins to respond to
        var dDataInitEvent = new CustomEvent("dDataInitialized", {bubbles:true});
        dDataProto.dispatchEvent(dDataInitEvent);

    }

    function setupTemplates(dDataProto){
        if (dDataProto.isConnected){
            var templateParent = dDataProto.parentElement;
            if ( findRootDData(dDataProto) == dDataProto ){ templateParent = dDataProto; }
            if (!templateParent.childTemplates){ templateParent.childTemplates = {}; }
            if ( !templateParent.childTemplates[dDataProto.getAttribute("name")] ){
                templateParent.childTemplates[dDataProto.getAttribute("name")] = dDataCloneNode(dDataProto);    
                templateParent.setAttribute("has-d-data-children", true);
            } 
        }  
    }

    function setupChildTemplates(dDataProto){
        var childDDataElements = dDataProto.querySelectorAll("[d-data]");
        var childLen = childDDataElements.length;
        for (var i=0; i<childLen; i++){
            setupTemplates(childDDataElements[i]);
            registerDData(childDDataElements[i]);
        }
    }

    function setupRootDData(dDataProto){
        if ( findRootDData(dDataProto) == dDataProto ){ 
            dDataProto.add = addSibling;
            var scope = dData;      // Setup Scope.
            if ( dDataProto.hasAttribute("scope") ){
                var scope = setupScope(dDataProto);
                var initialData = lookForInitialData(scope, dDataProto);
            }

            if (scope[dDataProto.name] == undefined){
                Object.defineProperty(scope, dDataProto.name, { get: valueGetter, set: dataRender, enumerable: true, configurable: true } );    
            }else if (dDataProto.isConnected){
                Object.defineProperty(scope, dDataProto.name, { get: valueGetter, set: dataRender, enumerable: true, configurable: true } );    
            }
            
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
        if (Object.keys(v).length == 0){
            resetValues();
        }
        deleteExtraElements(dDataProto);
        renderValues(v, dDataProto);
        renderChildren(v, dDataProto);

        // dispatch dDataRendered Event for Builtins to respond to
        emitDataRendered(dDataProto);
    };

    function resetValues(){
        var dataSet = dDataProto.value;
        var keys = Object.keys(dataSet);
        var keysLen = keys.length;
        for (var i=0; i<keysLen; i++){
            var key = keys[i];
            dataSet[key] = undefined;
        } 
    }

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
            var element = parent.childTemplates[name];
            var clone = dDataCloneNode(element);
        }

        parent.appendChild(clone);
        setupTemplates(clone);
        setupChildTemplates(clone);

        var inpVals = clone.querySelectorAll("[name]"); //clear all values that may have leaked into the template;
        for (var i=0; i<inpVals.length;i++){
            if (inpVals[i].hasAttribute("d-data")){continue;}
            renderValOrHTML(inpVals[i], ""); 
        }
        
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
            while (element = element.parentElement){
                if (element.hasAttribute("has-d-data-children") && element.childTemplates[name] ) {return element; break;}
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


/////////////////////////////////////////////////////////////////////////////////////
// EXTENSIONS //////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////



/////////////////////////////////
// ADD AND REMOVE EXTENSIONS   //
/////////////////////////////////

( function dDataChildAdderExtension(){
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

( function dDataChildRemoverExtension(){
    dData.extensions.push({attribute: "remove", setup: setupRemover });

    function setupRemover(element, dDataElement, attrVal){
        element.addEventListener("click", function(event){
            dDataElement.remove();
        })
    }
})();

/////////////////////////////////
// COMPUTED PROPERTY EXTENSION //
/////////////////////////////////

( function dDataComputers(){
    
    dData.extensions.push({attribute: "computer", setup: setupComputer});

    document.addEventListener("dDataInitialized", function(event){
        event.target.addEventListener("change", function(event){
            runComputers(event.target);
        });
    });
    
    function setupComputer(element, dDataElement){
        
        var computer = eval(element.getAttribute("computer"));
        var dParent = dData.findNearestDDataParent(element);
        var root = dData.findRootDData(element);
        if (!dParent.computedProps){ dParent.computedProps = []; }

        var fun = function(dDataElement, root){
            if (!typeof(computer) == 'function' ){ return 0; }/* Make sure computer function is defined */ 
            if (element.value){
                element.value = computer( dDataElement, root ) ;
            } else {
                element.innerHTML = computer( dDataElement, root ) ;
            }

        }
        dParent.computedProps.push(fun);

        dParent.addEventListener("dDataRendered", function(event){ 
            runComputers(element) 
        });
        runComputers(element);
    }


    function runComputers(element){
        var root = dData.findRootDData(element);
        var dDataElement = dData.findNearestDDataParent(element)
        var computers = dDataElement.computedProps
        if (computers){
            for (var i=0; i<computers.length; i++){
                computers[i](dDataElement, root);
            }
        }
    }
})();


///////////////////////
// FILTER  EXTENSION //
///////////////////////

( function dDataFilterExtension(){

    dData.extensions.push({attribute: "filter", setup: setupFilter});

    function setupFilter(filter, dDataElement, attrVal){
        
        filter.addEventListener("input", filterItems);
        dDataElement.addEventListener("dDataRendered", filterItems);

        function filterItems(event){
            var attrSplit = attrVal.split(":");
            var dataToFilter = attrSplit[0];
            var keyToFilterOn = attrSplit[1];

            var searchKeys = filter.value.split(" ");
            var parent = dData.findNearestDDataParent(filter);
            var children = parent.querySelectorAll("[name='"+dataToFilter+"']");
            for (var i=0; i<children.length; i++){
                var f = filterArr_AND(children[i].value, keyToFilterOn, searchKeys);
                if (f || filter.value == "") {
                    children[i].hidden = false ;   
                }else{
                    children[i].hidden = true;
                }

            }
        };      
    }

    function filterArr(obj, keyToFilterOn, searchVal){ 
        // this function will filter a nested array to elements containing searchVal  
        if ( Array.isArray(obj) ){
            var results = []
            for (var i=0; i<obj.length; i++){
                 var r = filterArr( obj[i], keyToFilterOn, searchVal ) 
                 if (r) { results.push(r) }
            }
            if (results.length == 0 ){ return false } else { return results }
        } else if (typeof(obj)=="object" ) {
            var results = {};
            for (var key in obj) {
                if (keyToFilterOn != undefined && key != keyToFilterOn){ continue; }
                var r = filterArr( obj[key], keyToFilterOn, searchVal )
                if (r != undefined && r != false) { results[key] = r } 
            }
            if (Object.keys(results).length == 0) { return false } else { return obj }
        } else {
            if (obj != undefined && obj.toString().toLowerCase().indexOf(searchVal.toLowerCase()) > -1 ) { return obj; } else { return undefined; }
        }
    }

    function filterArr_AND(obj, keyToFilterOn, searchKeys){
        // this function will filter a nested array to elements including all search keys
        var results = obj;
        for (var i=0; i<searchKeys.length;i++ ){
            var test = filterArr(results, keyToFilterOn, searchKeys[i]);
            if (test.length == 0 || test == false) {break;}
        }
        return test;
    }

})();


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
        var elements = dDataElement.querySelectorAll("[name='"+name+"']");
        for (var i=0; i<elements.length; i++){
            elements[i].addEventListener("change", dClass);
            elements[i].addEventListener("dDataRendered", dClass);    
        }
        

        function dClass(event){
            if (dDataElement.value[name] == undefined){return 0;}
            if (dDataElement.value[name].toString() == expression ){
                element.classList.add(className);
            }else{
                element.classList.remove(className);
            }
        }
        dClass();

    }

})();


//////////
// HIDE //
//////////

(function(){  /* Usage: hide="nameOfFunction" <--- the function needs to return true of false
                 Example: hide="test"         <---  element.hidden == test()    
                 function test(){  return expr ? true : false; }               
*/  
    dData.extensions.push({attribute: "hide", setup: setupShow});

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
        showHide();
    }

})();

////////////////////////////////////////////////////////////////////////
////////////////// DEFAULT ELEMENT HANDLER EXTENSION ///////////////////
////////////////////////////////////////////////////////////////////////


( function(){
    var evHandler = dData.elementValueHandler;
    var ERHandler = dData.elementRenderHandler;

    ERHandler.INPUT = function(element, value){
        var elmAttr = "";
        if (element.type == "checkbox"){elmAttr = "checked";}
        else if (element.type == "radio"){ setRadio(element, value); return;}
        else { elmAttr = "value";}

        element[elmAttr] = value || "";
    }
    function setRadio(element,value){
        var name = element.getAttribute("name");
        if (value == undefined){
            var elem = document.querySelector("input[name='"+name+"']:checked");
            elem.checked = false;
            elem.dispatchEvent(new Event("dDataRendered"));
            return 0;
        }
        var dParent = dData.findNearestDDataParent(element);
        var elem = dParent.querySelector("input[value='"+value+"']")
        elem.checked = true;
        elem.dispatchEvent(new Event("dDataRendered"));
    }

    evHandler.INPUT = function(data, element, elementName, emitDataRendered){
        var elmAttr = "";
        
        if (element.type == "checkbox"){elmAttr = "checked";}
        else if (element.type == "radio"){ handleRadios(data, element, elementName, emitDataRendered); return; }
        else { elmAttr = "value";} 

        Object.defineProperty(data, elementName, {
            get: function(){ return element[elmAttr]; }, 
            set: function(newVal){ element[elmAttr] = newVal || ""; emitDataRendered(element);},
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
            emitDataRendered(element);
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

////////////////////////////////////////////////////////////////////////
////////////////// DDATA LOAD INITIAL VALUE EXTENSION ///////////////////
////////////////////////////////////////////////////////////////////////


( function dDataSetValue(){
    dData.extensions.push({attribute: "load", setup: setValue });

    function setValue(element, dDataElement, attrVal){

            var name = element.getAttribute("name");
            if (!dDataElement.isConnected){return 0;}
            if (element.hasAttribute('d-data')){
                dDataElement.value = eval(attrVal);
            }else{
                dDataElement.value[name] = eval(attrVal);    
            } 
    }


})();

////////////////////////////////////////////////////////////////////////
////////////////// DDATA PUSH TO ARRAY ON CLICK EXTENSION ///////////////////
////////////////////////////////////////////////////////////////////////

( function dDataPush(){
    dData.extensions.push({attribute: "push", setup: pushValue });

    function pushValue(element, dDataElement, attrVal){
        element.addEventListener("click", function(){
            var arr = eval(attrVal);
            arr.push(dDataElement.value); 
        });
    }


})();

////////////////////////////////////////////////////////////////////////
////////////////// DDATA OBJ ASSIGN ON CLICK EXTENSION ///////////////////
////////////////////////////////////////////////////////////////////////

( function dDataSave(){
    dData.extensions.push({attribute: "assign", setup: saveValue });

    function saveValue(element, dDataElement, attrVal){
        element.addEventListener("click", function(){
            var obj = eval(attrVal);  // GET OBJECT TO SAVE TO
            var keys = Object.keys(obj);
            var keyLen = keys.length;
            for (var i=0; i<keyLen; i++){
                var key = keys[i];
                obj[key] = dDataElement.value[key];
            }
        });
    }


})();

////////////////////////////////////////////////////////////////////////
////////////////// DDATA EVAL ON CLICK EXTENSION ///////////////////
////////////////////////////////////////////////////////////////////////

( function dDataEval(){
    dData.extensions.push({attribute: "eval", setup: deleteValue });

    function deleteValue(element, dDataElement, attrVal){
        element.addEventListener("click", function(){
            eval(attrVal);
        })
    }


})();

////////////////////////////////////////////////////////////////////////
////////////////// dDATA ROUTER EXTENSION ///////////////////
////////////////////////////////////////////////////////////////////////

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
        if (viewPort == null){return 0;} // There is no view port
        var template = getTemplate();
        if (template == null){
            console.log("dData Router Template Not Defined: " + hash)
        }
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



////////////////////////////////////////////////////////////////////////
////////////////// POUCHDB EXTENSION ///////////////////
////////////////////////////////////////////////////////////////////////

var dDataDBName = dDataDBName || "dDataPouchDB";
var db = new PouchDB(dDataDBName);
var dbChangeHandlers = {};

db.createIndex({
  index: {fields: ['type']}
});

function removeDoc(id){
    db.get(id).then(function(doc){db.remove(doc)});
}

function removeAllDocs(){
    db.allDocs({include_docs:true}).then(function(allDocs){
        var docs = allDocs.rows;
        var len = docs.length;
        for (var i=0; i<len; i++){
            db.remove(docs[i].doc);
        }
    }); 
}

function generateUUID() {
	var d = new Date().getTime();
	var uuid = 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxx-xxxxxx'.replace(/[xy]/g, function(c) {
		var r = (d + Math.random()*16)%16 | 0;
		d = Math.floor(d/16);
		return (c=='x' ? r : (r&0x3|0x8)).toString(16);
	});
	return uuid;
};

( function dDataPouchDBExtension(){
	dData.extensions.push({attribute: "pouch-list", setup: setupList });
	dData.extensions.push({attribute: "pouch-load", setup: setupLoad });
	dData.extensions.push({attribute: "new", setup: setupNew });
	dData.extensions.push({attribute: "save", setup: setupSave });
	dData.extensions.push({attribute: "delete", setup: setupDelete });
	dData.extensions.push({attribute: "form", setup: setupForm });
	var selfSaved = false;

	function setupNew(element, dDataElement, attrVal){
		var dRoot = dData.findRootDData(element);
		attrVal = attrVal || dDataElement.getAttribute("name");
		element.addEventListener("click", function(event){
			dRoot.value = {};
			dRoot.value.type = attrVal;
		});
	};

	function setupLoad(element, dDataElement, attrVal){

		function refresh(){
			var dParent = dData.findRootDData(dDataElement);
			var childName = dDataElement.getAttribute("name");
			var val = eval(attrVal);
			if (dDataElement.isConnected){
				db.get(val).then(function(doc){
					dDataElement.value = doc;
				}).catch(function(err){
					console.log(err);
					alert("There was an error loading this document!")
				});
		   }
		}

		refresh();
	}

	function setupDelete(element, dDataElement, attrVal){
	   
			element.addEventListener("click", function(event){
				event.stopPropagation();
				var id = dDataElement.value._id;
				if (confirm("Are you sure you want to delete?")){
					db.get(id).then(function(doc){
						db.remove(doc);
					});
				};
			});
	   
	}

	function setupForm(element, dDataElement, attrVal){
		var dDataObj = attrVal.split(".");
		var scope = window[dDataObj[0]];
		var obj = dDataObj[1];
		
		 dDataElement.addEventListener("click", function(event){
			if (event.target.hasAttribute("d-data")){
				var dElem = event.target;
			}else{
				var dElem = dData.findNearestDDataParent(event.target);
			}
			
			scope[obj] = dElem.value;
		});

		
	};

	function setupSave(element, dDataElement, attrVal){
		if (attrVal == ""){
			console.log(element);
			throw "dData PouchDB Extension: save attribute requires an argument!";
		}
		if (dbChangeHandlers[attrVal] == undefined){dbChangeHandlers[attrVal] = {};}
		var dRoot = dData.findRootDData(element);

		dbChangeHandlers[attrVal].form = function(change){
            var dRoot = dData.findRootDData(element)
            var id = dDataElement.value._id;
            if (id == undefined){return 0;} // This is a new record
            if (change.doc._id == id && !selfSaved){
                if (change.deleted){
                    dRoot.value._id = "";
                    dRoot.value._rev = "";
                    alert("The Original document was deleted by someone else... make sure you save your work if you want to keep this document alive.");
                    return 0;
                }
                if (confirm("A newer version of this document is available.  \n Would you like to refresh?")) { 
                    db.get(id).then(function(doc){
                        dRoot.value = doc;
                    }).catch(function(err){
                        console.log(err);
                    });
                }
            }else if (change.doc._id == id){
                selfSaved = false;
                db.get(id).then(function(doc){
                    dRoot.value = doc;
                }).catch(function(err){
                    console.log(err);
                });;
            }else{selfSaved = false;}
        }
		
		 element.addEventListener("click", function(event){
			var obj = dRoot.value;
			obj._id = obj._id || generateUUID();
			obj.type = obj.type || attrVal;
			selfSaved = true;
			db.put(obj).then(function(doc){
				dRoot.value = {_id: doc.id, _rev: doc.rev};
			}).catch(function(err){
				if (err.name == "conflict"){
					if (confirm("Couldn't Save... a newer version of this document is available.  \n Would you like to refresh?")) { 
						db.get(err.docId).then(function(doc){
							dRoot.value = doc;
						});
					}
				}
			});
		});
	};

	function setupList(element, dDataElement, attrVal){
		var dParent = dData.findRootDData(dDataElement);
		var childName = dDataElement.getAttribute("name");
		attrVal = attrVal || childName;

		if (dbChangeHandlers[attrVal] == undefined){dbChangeHandlers[attrVal] = {};};
		   
		if (dParent){
			dbChangeHandlers[attrVal].list = function(change){
				refresh();
			};
		}

		
		function refresh(){
			attrVal = attrVal || childName;
			if (dParent && dParent.isConnected){
				
				db.find({
				  selector: {
					type: attrVal
				  }
				}).then(function(data){

					var docs = {};
					docs[childName] = data.docs;
					dParent.value = docs;

				});		 
		   }
		}
	   
	   refresh();
	   
	};
	
	var dbChanges = db.changes({
		  since: 'now',
		  live: true,
		  include_docs: true
	}).on('change', function(change) {

		var type = change.doc.type;
		if (change.deleted){
			type = getDeletedType(change);
		}else{
			runChangeHandlers(type,change);
		}

	}).on('error', function (err) {
		console.log(err);
	});

	function runChangeHandlers(type, change){
		var keys = [];
		if (dbChangeHandlers[type]){
			keys = Object.keys(dbChangeHandlers[type])
		}
		var keyLen = keys.length;
		for (var i=0; i<keyLen; i++){
			var key = keys[i];
			dbChangeHandlers[type][key](change);
		}
	}

	function getDeletedType(change){
		return db.get(change.id, {revs:true,  open_revs: 'all'}).then(function(revs){
			var id = revs[0].ok._id;
			var prevRev = revs[0].ok._revisions.ids[1];
			var revNo = revs[0].ok._revisions.start - 1;
			var revStr = revNo + "-" + prevRev;
			return db.get(id, {rev:revStr}).then(function(doc){
				runChangeHandlers(doc.type, change);
			});
		});
	}
})();





////////////////////////////////////////////////////////////////////////
////////////////// UTILITY EXTENSIONS ///////////////////
////////////////////////////////////////////////////////////////////////

Array.prototype.get = function(obj){

    // this function searches an array of objects
    // and returns the first object that matches 
    // the keys/values inside the search Object
    // Syntax: arr.get({id: "123"});

    var len = this.length;
    var keys = Object.keys(obj);
    var keyLen = keys.length;

    for (var i=0; i<len; i++){
        if( match_keys(this[i], obj) ){return this[i];}
    }

    return {};

    function match_keys(arr, obj){
        for (var x=0; x<keyLen; x++){
            var key = keys[x];
            if (arr[key] == obj[key]){ 
                continue; 
            }else{
                return false;
            }
        }
        return true;
    }
}

Array.prototype.delete = function(obj){

    // this function finds an object in an array of objects
    // that matches the keys/values in the search object 
    // and performs an Array slice operation on that index
    // Syntax: arr.delete({id: "123"});

    var len = this.length;
    var keys = Object.keys(obj);
    var keyLen = keys.length;

    for (var i=0; i<len; i++){
        if( match_keys(this[i], obj) ){return this.splice(i,1);}
    }

    return {};

    function match_keys(arr, obj){
        for (var x=0; x<keyLen; x++){
            var key = keys[x];
            if (arr[key] == obj[key]){ 
                continue; 
            }else{
                return false;
            }
        }
        return true;
    }
}
