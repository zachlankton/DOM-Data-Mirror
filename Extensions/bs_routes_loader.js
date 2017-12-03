(function(){

	var importLen = imports.length;
	for (var i=0; i<importLen; i++){
		var link = document.createElement('link');
		link.rel = 'import';
		link.href = imports[i].path;

		link.onload = function(e) {
			console.log('Loaded import: ' + e.target.href);
			var content = e.target.import;
			var el = content.querySelector('[route]');
			var route = el.getAttribute("route");
			var template = document.createElement("template");
			template.setAttribute("route", route);
			el.removeAttribute("route");
			template.content.appendChild(el);
			document.body.appendChild(template);

		};

		link.onerror = function(e) {
			console.log('Error loading import: ' + e.target.href);
		};

		document.head.appendChild(link);
	}
})();
