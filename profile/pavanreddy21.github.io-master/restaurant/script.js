var tables = JSON.parse(tables);
var items = JSON.parse(items);
var testing;
var latest_table,currentTarget;

displayItems();
displayTables();



function displayTables(){

  for(var i =0;i<tables.length;i++){
    var tableRef = document.getElementById('tables-display');
    var new_div = document.createElement("div");
    new_div.className = "card";
    var new_inner_div = document.createElement("div");
    new_inner_div.className='card-body';
    new_inner_div.innerHTML = tables[i].name + " | Rs. "+tables[i].total_amount +" | Total items: "+tables[i].total_items;
    new_inner_div.addEventListener("dragover",allowDrop,false);
    new_inner_div.addEventListener("drop",drop,false);
    new_div.addEventListener("click",displayBill,false);

    new_inner_div.id = tables[i].id;
    new_inner_div.name = tables[i].name;
    new_inner_div.total_items = tables[i].total_items;
    new_inner_div.total_amount = tables[i].total_amount;
    new_inner_div.items = tables[i].items;
    new_div.appendChild(new_inner_div);
    tableRef.appendChild(new_div);
  }

 }


function displayItems() {


  for(var i =0;i<items.length;i++){
		var menuRef = document.getElementById('items-display');
		var new_div = document.createElement("div");
    new_div.className='card';
    var new_div_body=document.createElement("div");
    new_div_body.className='card-body';

    var title = document.createElement("h4");                       // Create a <h4> node
    var t = document.createTextNode(items[i].name);
    title.appendChild(t);
    title.className='card-body';

    new_div_body.appendChild(title);

    var price = document.createElement("P");                       // Create a <p> node
    var p = document.createTextNode(items[i].cost);
    price.appendChild(p);
    title.className='card-text';

    new_div_body.appendChild(price);

    new_div.appendChild(new_div_body);
		new_div.draggable = "true";
		new_div.addEventListener("dragstart",drag,false);


		new_div.id = items[i].id;
		new_div.name = items[i].name;
		new_div.type = items[i].type;
		new_div.cost = items[i].cost;

		menuRef.appendChild(new_div);
	}
}



function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.dropEffect = "copy";
  ev.dataTransfer.setData("text", ev.target.id);
  ev.currentTarget.style.border = "dashed";
}

function drop(ev) {
  ev.preventDefault();
    var item_id = ev.dataTransfer.getData("text");
    var item = document.getElementById(item_id);

    var table_id = ev.target.id;
    var table = document.getElementById(table_id);
    var found = false;

    for(var i=0;i<table.items.length;i++){
      if(table.items[i].item_id == item_id){
        table.items[i].item_count++;
        //table.total_items++;
        table.total_amount+=item.cost;
        found = true;
      }
    }

    if(found == false){
      var new_item = {"item_id" :item.id,"item_count": 1, "item_name":item.name, "item_cost":item.cost};
      table.items.push(new_item);
      table.total_items++;
      table.variety_count++;
      table.total_amount+=item.cost;
    }

    table.innerHTML = table.name + " | Rs. "+table.total_amount +" | Total items: "+table.total_items;
     ev.currentTarget.style.background = "lightblue";
}


function filterTables() {
  var input = document.getElementById('input_table');
  var filter = input.value.toLowerCase();
  var table = document.getElementById("tables-display");
  var div = table.children;
  for (var i = 0; i < div.length; i++) {
    if(div[i].children[0].name.toLowerCase().indexOf(filter) > -1){
      div[i].style.display = "";
    }
    else{
      div[i].style.display = "none";
    }
}
}


function filterItems() {
  var input = document.getElementById('input_items');
  var filter = input.value.toLowerCase();
  var items = document.getElementById("items-display");
  var div = items.children;
  for (var i = 0; i < div.length; i++) {
    if((div[i].name.toLowerCase().indexOf(filter) > -1)||(div[i].type.toLowerCase()==filter)){
      div[i].style.display = "";
    }
    else{
      div[i].style.display = "none";
    }
}
}

function displayBill(ev) {
  currentTarget = ev;
  var head = document.getElementById("modal-title");
  var table = document.getElementById(ev.target.id);
  head.innerHTML = table.name ;
  var tableRef = document.getElementById('billTable');
  tableRef.innerHTML ="<thead><tr><th>Item</th><th>Price</th><th>Item-Count</th><th>Delete</th></tr></thead>";
   table.total_amount=0;
   table.total_items=0;
   var tableRef = document.getElementById('billTable');
  for(var i=0;i<table.items.length;i++){
    var item = document.getElementById(table.items[i].item_id);

    table.total_amount=table.total_amount+table.items[i]["item_cost"]*table.items[i]["item_count"];
    table.total_items+=1;
    tableRef.innerHTML +="<tbody><tr><td>"+table.items[i]["item_name"]+"</td><td>"+table.items[i]["item_cost"]+"</td><td><input type='number' id ='"+50+i+"' value="+table.items[i]["item_count"]+" onchange='editBill(this.value,"+i+")'></input></td><td><button onclick='deleteItem("+i+")'>Delete</button></td></tr></tbody>";
  }
  tableRef.innerHTML +="<thead><tr><td>Total:</td><td>"+table.total_amount+"</td></tr></thead>";

    var footer = document.getElementById("modal-footer");
    footer.innerHTML="<button type='button' class='btn btn-primary' onclick='closeSession()' data-dismiss='modal' >Close Session(GenerateBill)</button>";
$('#tableBill').modal('show');

}
function closeSession() {
  var table = document.getElementById(currentTarget.target.id);
  table.items.splice(0,table.items.length);
  table.total_amount=0;
  table.total_items=0;
  table.innerHTML = table.name + " | Rs. "+table.total_amount +" | Total items: "+table.total_items;
  table.style.background = "white";
}


function deleteItem(item) {
  	var table = document.getElementById(currentTarget.target.id);
    table.items.splice(item,1);
    displayBill(currentTarget);
    table.innerHTML = table.name + " | Rs. "+table.total_amount +" | Total items: "+table.total_items;

}

function editBill(val,currentItem){
  if(val<=0){
    alert("items should be possitive")
  }
  else{
	var table = document.getElementById(currentTarget.target.id);
  table.items[currentItem]["item_count"]=val;
  displayBill(currentTarget);
table.innerHTML = table.name + " | Rs. "+table.total_amount +" | Total items: "+table.total_items;
}
}
