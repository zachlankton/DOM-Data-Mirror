(function (window) {
	'use strict';

	//object with helper methods
	var todo = window.todo = {};
	todo.enterKey = function(event){
		if (event.key == "Enter" || event.type == "blur"){
			event.preventDefault();
			var dDataElement = dData.findNearestDDataParent(event.target);
			dDataElement.className = "";
			updateView();
		}
	}

	todo.add = function(event){
		if (event.key == "Enter"){
			var value = event.target.value;
			if (value != ""){
				dData.TodoList.add("TodoItem", {todo: value});
				event.target.value = "";
				updateView();		
			}
		}
	}

	todo.edit = function(event){
		var dDataElement = dData.findNearestDDataParent(event.target);
		dDataElement.className = "editing";
	}

	todo.update = updateView;

	// router functionality
	function router () {
        // Current route url (getting rid of '#' in hash as well):
        var url = location.hash.slice(1) || '/';
        var filter = document.getElementById("filter");
        if (url == "/completed"){filter.value = "true";}
        if (url == "/active"){filter.value = "false";}
        if (url == "/") {filter.value = "";}
        filter.dispatchEvent(new Event("keyup"));
		document.querySelector(".selected").className = "";
		document.querySelector("[href='#"+url+"']").className = "selected";
    }
    
    // Listen on hash change and page load:
    window.addEventListener('hashchange', router);
    window.addEventListener('dDataRendered', router);

	// persistence
	function storeTodos(){
		var items = dData.TodoList.TodoItem;
		if (items != undefined && items.length > 0){
			localStorage["todos-dom-data-mirror"] = JSON.stringify(dData.TodoList);	
		}else{
			localStorage.removeItem("todos-dom-data-mirror");
		}
		
	}

	function loadTodos(){
		var data = localStorage["todos-dom-data-mirror"]
		if (data != undefined && data != ""){
			dData.TodoList = JSON.parse( localStorage["todos-dom-data-mirror"] );	
		}else{
			dData.TodoList = {}; // Init an empty list;
		}
		updateView();
	}

	window.addEventListener('load', loadTodos);

	function updateView(){
		var items = dData.TodoList.TodoItem;
		if (items != undefined && items.length != 0){
			show(".main");
			show(".footer");
		} else {
			hide(".main");
			hide(".footer");
		}
		updateClearCompleted();
		updateItemsLeft();
		updateCompleted();
		storeTodos()
	}

	function updateClearCompleted(){
		var completedItems = 0;
		var items = dData.TodoList.TodoItem;
		if (items == undefined){return 0;}
		for (var i=0; i<items.length; i++){
			if (items[i].completed == true){ completedItems++; }
		}
		if (completedItems>0){
			show(".clear-completed");
		}else{
			hide(".clear-completed");
		}
		updateToggleAll(completedItems, items.length);
	}

	function updateItemsLeft(){
		var itemsLeft = 0;
		var items = dData.TodoList.TodoItem;
		if (items == undefined){return 0;}
		for (var i=0; i<items.length; i++){
			if (items[i].completed == false){itemsLeft++;}
		}
		var word = pluralize(itemsLeft, " item");
		dData.TodoList.itemsLeft = itemsLeft + word + " left";
	}

	function updateToggleAll(completed, totalItems){
		var tglAll = document.getElementById("toggle-all");
		tglAll.checked = completed == totalItems ? true : false;
	}

	function updateCompleted(){
		var items = document.querySelectorAll("[name='TodoItem']");
		for (var i=0; i<items.length; i++){
			if (items[i].value.completed){
				items[i].className = "completed";
			}else{
				items[i].className = "";
			}
		}
	}

	todo.toggleAll = function(){
		var tglAll = document.getElementById("toggle-all");
		var items = dData.TodoList.TodoItem;
		for (var i=0; i<items.length; i++){
			items[i].completed = tglAll.checked;
		}
		updateView();
	}

	todo.clearComplete = function(){
		var items = dData.TodoList.TodoItem;
		for (var i=items.length-1; i>-1; i--){
			if (items[i].completed){
				items.remove(i);
			}
		}
		updateView();
	}

	function pluralize(count, word){
		return count === 1 ? word : word + 's';
	}

	function show(element){ document.querySelector(element).hidden = false; }

	function hide(element){ document.querySelector(element).hidden = true; }

})(window);
