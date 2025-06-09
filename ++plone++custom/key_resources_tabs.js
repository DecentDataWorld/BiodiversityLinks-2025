function openTab(tabName,elmnt,color) {
  var i, tabcontent, tablinks;
  tabcontent = elmnt.closest('section').querySelectorAll(".tabcontent");
  for (let element of tabcontent) { 
    element.style.display = "none";
  }
  
  tablinks = elmnt.closest('section').querySelectorAll(".tablink");
  for (let element of tablinks) { 
    element.style.backgroundColor = "";
  }

  document.getElementById(tabName).style.display = "block";
  elmnt.style.backgroundColor = color;

}

// Get the element with class "defaultOpen" and click on it
defaultButtons = document.querySelectorAll(".default-open");
for (let element of defaultButtons) { 
    element.click();
}