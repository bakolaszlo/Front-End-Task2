const myForm = document.getElementById('myForm');
const table = document.getElementById('table-class');
let buttons = document.getElementsByClassName('btn');
let storage = window.localStorage;


let startIndex = 0;



myForm.addEventListener("submit", (e) =>
{
    e.preventDefault(); //stops the browser redirect
    console.log("Form has been submited.");
    let arr = formToArray();
    let obj = objectify(arr);
    let jsonToFile = JSON.stringify(obj);
    appendStorage(jsonToFile);
    appendHTML(obj);
    setListenerForButtons();
    //console.log(files[0]);
    
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

function objectify(array)
{
    return Object.fromEntries(array);
}

function formToArray()
{
    let form = Array.from(document.querySelectorAll('#myForm input, select'))
    let array = []
    for(i = 0; i<form.length-1;++i)
    {
        if(form[i].value)
            array.push([form[i].name,form[i].value]);
    }
    return array;
}

function appendHTML(array)
{
    let newRow = table.insertRow();
    newRow.id=startIndex;

    newRow.insertCell().innerHTML=startIndex;

    newRow.insertCell().innerHTML=array.firstName;
    newRow.insertCell().innerHTML=array.lastName;
    newRow.insertCell().innerHTML=array.mail;
    newRow.insertCell().innerHTML=array.sex;
    newRow.insertCell().innerHTML=array.date;

    if(array.image)
        newRow.insertCell().innerHTML="<img src= \"" + array.image + "\"  width=50 height=50 >";
    else
        newRow.insertCell().innerHTML='No Image';
    
    newRow.insertCell().innerHTML="<input class=\"btn\" type=button value=X id=btn"+ startIndex+">";

    startIndex+=1;
}

function setListenerForButtons()
{
    buttons = document.getElementsByClassName('btn');
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', deleteIndex, false);
    }
}

function appendStorage(array)
{
    storage.setItem(startIndex,array);
}


function getFromStorage(index)
{
    return JSON.parse(storage.getItem(index));
}

function deleteRow(rowid)  
{   
    console.log(rowid)
    var row = document.getElementById(rowid);
    row.parentNode.removeChild(row);
}

function deleteIndex(event) {
    
    deleteRow(event.target.id.toString().replace('btn',''));
};

function firstLoad()
{
    var data = loadFile("data/db.json");
    data = JSON.parse(data)

    for(i=0;i<data.length;++i)
    {
        appendHTML(data[i]);
    }

    for(i=0;i<data.length;++i)
    {
        appendStorage(data[i]);
    }
}

firstLoad()
setListenerForButtons()