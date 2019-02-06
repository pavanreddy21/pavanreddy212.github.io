var selectedImage=null;

var imagesObject;
loadJsonFile();


function loadJsonFile(){
  if(localStorage.getItem('imagesObject')===null){ 
    imagesObject = JSON.parse(data);
    localStorage.setItem('imagesObject', JSON.stringify(imagesObject));
  }
  else {
    imagesObject = JSON.parse(localStorage.getItem('imagesObject'));
  }
  reloadImages();
}



function reloadImages() {
$("#imagesDiv").empty();
images = imagesObject.images;
for(var i=0;i<images.length;i++){
var tmp=images[i]["url"];
$("#imagesDiv").append("<div><img class='open' onclick='ImageClickHandler("+i+"); unhide(); ' src="+tmp+"></div>");
}
}



function ImageClickHandler(imageNo) {
  selectedImage=imageNo;
  setFields();
}




function setFields() {
  images = imagesObject.images;
  $("#url").val(images[selectedImage]["url"]);
  $("#name").val(images[selectedImage]["name"]);
  $("#description").val(images[selectedImage]["info"]);
  $("#date").val(images[selectedImage]["uploadedDate"]);
}



function unhide() {
var x = document.getElementById("settingsDiv");
if (x.style.display === "none") {
 x.style.display = "block";
}
}



function toggle() {
  var x = document.getElementById("settingsDiv");
 if (x.style.display === "none") {
   x.style.display = "block";
 } else {
   x.style.display = "none";
 }
}



function addImage(){
   if(!validate())
   return false;

   var newimageObject = {name: $('#name').val(),url:$('#url').val(),info:$('#description').val() ,uploadedDate:$('#date').val()};
   imagesObject.images.push(newimageObject);
   localStorage.setItem('imagesObject', JSON.stringify(imagesObject));
   reloadImages();
}



function editImage() {
  if(!validate())
  return false;

if(selectedImage==null)
{
  alert("Please Select the image You want to edit");
  return false;
}


  imagesObject.images[selectedImage]["url"]=$('#url').val();
  imagesObject.images[selectedImage]["name"]=$('#name').val();
  imagesObject.images[selectedImage]["info"]=$('#description').val();
  imagesObject.images[selectedImage]["uploadedDate"]=$('#date').val();
  localStorage.setItem('imagesObject', JSON.stringify(imagesObject));
  reloadImages();
}


function deleteImage(){

if(selectedImage==null)
{
  alert("Please click on image you want to delete first!");
  return false;
}

if(window.confirm("Are you sure want to delete the  image "+imagesObject.images[selectedImage]["name"])){
imagesObject.images.splice(selectedImage,1);
localStorage.setItem('imagesObject', JSON.stringify(imagesObject));
selectedImage=null;
reloadImages();
}
}


function validate() {

  return ((validateUrl()) &&  (validateName()) && (validateDescription()) && (validateDate()))

}


function validateUrl() {

  var url=$('#url').val();
  var regex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
  if(!regex .test(url)) {
    alert("Please enter valid URL.");
    return false;
  }
 return true;
}

function validateName() {
  
  var name = $('#name').val();
   if (name == "" ) {
    alert("Image Name  Should not be Empty");
    return false;
   }
 return true;
}

function validateDescription() {
  
   var description=$('#description').val();
    if (description == "" ) {
      alert("Image Description Should not be Empty");
      return false;
    }
 return true;
}

function validateDate() {
  if(!isValidDate($('#date').val())){
    alert("date not valid");
    return false;
  }

  return true;
}


function isValidDate(dateString) {

  var regEx = /^\d{4}-\d{2}-\d{2}$/;

  if(dateString.match(regEx) === false)
    return false;
    
  var enteredDate = new Date(dateString);
    if(!enteredDate.getTime())
      return false;
    
  var enteredDateTime = enteredDate.getTime();
  var currentDateTime = new Date().getTime();

    if(enteredDateTime > currentDateTime)
      return false;

  return enteredDate.toISOString().slice(0,10) === dateString;

}






