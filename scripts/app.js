const myForm = document.getElementById('myForm');
const table = document.getElementById('table-class');

let startIndex = 0;


myForm.addEventListener("submit", (e) =>
{
    e.preventDefault(); //stops the browser redirect
    console.log("Form has been submited.");
    let array = document.querySelectorAll('#myForm input, select')
    console.log(array);
});

function loadFile(filePath) {
    var result = null;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", filePath, false);
    xmlhttp.send();
    if (xmlhttp.status==200) {
      result = xmlhttp.responseText;
    }
    return result;
}

function appendHTML(array)
{
    let newRow = table.insertRow();
    newRow.insertCell().innerHTML=startIndex;
    startIndex+=1;

    newRow.insertCell().innerHTML=array.firstName;
    newRow.insertCell().innerHTML=array.lastName;
    newRow.insertCell().innerHTML=array.mail;
    newRow.insertCell().innerHTML=array.sex;

    if(array.date)
        newRow.insertCell().innerHTML=array.date;
    else
        newRow.insertCell().innerHTML='No date';

    if(array.image)
        newRow.insertCell().innerHTML="<img src= \"" + array.image + "\"  width=50 height=50 >";
    else
        newRow.insertCell().innerHTML='No Image';
}


var data = loadFile("data/db.json");
data = JSON.parse(data)

for(i=0;i<data.length;++i)
{
    appendHTML(data[i]);
}