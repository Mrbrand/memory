var itemList = {
	itemArray: [], //lagrar projektdata
	
	
	
	/* Hämtar projektdata från angiven källa och lagrar i objektet ************/
	init : function(key) {     
		var array_from_storage = JSON.parse(window.localStorage.getItem(key));
		
		//exempeldata vid nystart
		if(array_from_storage==null) {
			this.add_item({id:0, parent_id:-1, title:"Root", prio:1, size:0});
			this.add_item({id:1, parent_id:0, title:"Familj", prio:1, type:8, size:0});
			this.add_item({id:2, parent_id:0, title:"Jobbet", prio:1, type:8, size:0});
			this.add_item({id:3, parent_id:0, title:"Nöje", prio:1, type:8, size:0});
			this.add_item({id:4, parent_id:3, title:"Leka med Neonic", prio:1, type:6, size:0});
		}
		else this.itemArray = array_from_storage;
		//console.log(this.itemArray);
		//console.log("localstorage: "+window.localStorage.getItem(key));
	},
	
	
	/* Rensar .list objektet och återskapar alla element via json-array *******/
	refresh : function(item_id) {   
		
		//rensa lista
		$("#list").empty();
		
		//filtrera itemArray
		var filterArray = this.get_subitems(item_id);
		
		//skapa lista från filterArray
		filterArray.forEach(function(item) {
			item.subitems = itemList.get_subitems(item.id,1);
			//subitems.sort(function(a, b){return a.type-b.type});
			var template = $('#item_template').html();
			var html = Mustache.to_html(template, item);
			$("#list").append(html);
		});
		 
		//sortera listan   
		if (filterArray.length != 0) tinysort("#list>.subitem",'span.prio');
		
	},
	
	/* returnerar projekt med givet item_id */
	get_item : function(item_id){
		return this.itemArray.filter(function (item){
			return item.id == item_id;
		})[0];
	},
	
	get_last_id : function(){
		last_id = Math.max.apply(Math,this.itemArray.map(function(item){return item.id;}));
		if (last_id=="-Infinity") last_id=0; //om inget objekt är skapat ännu
		return last_id;
	},
	
	add_item : function(item){
		this.itemArray.push(item);
	
		window.localStorage.setItem("key", JSON.stringify(this.itemArray));
	},
	
	add_from_form : function(form_id){
		//skapa objekt av formdata
		var temp = $( form_id ).serializeArray();
		var item = {};
		for(var i = 0; i <temp.length;i++){
			temp2 = temp[i];
			item[temp2["name"]] = temp2["value"];
		}
		
		//lägga till startdate till objektet
		item["start_date"] = new Date().toLocaleString();
		
		//lägga till id till objektet
		item["id"] = itemList.get_last_id()+1;
		
		//lägga till objekt i listan
		this.add_item(item);
	},
	
	
	edit_from_form : function(form_id){
		//skapa objekt av formdata
		var temp = $( form_id ).serializeArray();
		var item = {};
		for(var i = 0; i <temp.length;i++){
			temp2 = temp[i];
			item[temp2["name"]] = temp2["value"];
		}
		
		//byta ut objekt i listan
		this.remove_item(item.id);
		this.add_item(item);
	},
	
	
	remove_item : function(id){
		for(var i in this.itemArray){
			if(this.itemArray[i].id==id){
				this.itemArray.splice(i,1);
				break;
				}
		}
		window.localStorage.setItem("key", JSON.stringify(this.itemArray));
	},
	
	
	get_subitems : function(id, prio){
		return this.itemArray.filter(function (item){
			//console.log(prio);
			if (prio === undefined){ 
				return item.parent_id == id;
			}
			else {
				return item.parent_id == id & item.prio == prio;
			}
		});
	}
}
