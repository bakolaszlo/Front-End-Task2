const myForm = document.getElementById('myForm');
const table = document.getElementById('table-class');
let buttons = document.getElementsByClassName('btn');
let storage = window.localStorage;
let error= "";
const errorHolder = document.getElementById('error');


let startIndex = 0;



myForm.addEventListener("submit", (e) =>
{
    e.preventDefault(); //stops the browser redirect
    console.log("Form has been submited.");
    if(!checkForm())
    {
        console.log(error);
        errorHolder.innerHTML=error;
        return
    }
    let arr = formToArray();
    let obj = objectify(arr);
    let jsonToFile = JSON.stringify(obj);
    appendStorage(jsonToFile);
    appendHTML(obj);
    setListenerForButtons();
    clearForm();
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
        if(form[i].name=="image" && form[i].value)
        {
            console.log(form[i].files[0]);
            array.push([form[i].name,URL.createObjectURL(form[i].files[0])]);
            continue;
        }
        if(form[i].value)
            array.push([form[i].name,form[i].value]);
    }
    return array;
}

function appendHTML(array)
{
    let newRow = table.insertRow();
    newRow.id=startIndex;

    let v = newRow.insertCell();
    v.innerHTML=startIndex;
    v.className="column";

    v = newRow.insertCell();
    v.innerHTML=array.firstName;
    v.className="column";

    v = newRow.insertCell();
    v.innerHTML=array.lastName;
    v.className="column";

    v = newRow.insertCell();
    v.innerHTML=array.mail;
    v.className="column";

    v = newRow.insertCell();
    v.innerHTML=array.sex;
    v.className="column";

    v = newRow.insertCell();
    v.innerHTML=formatDate(array.date);
    v.className="column";


    if(array.image)
    {
        v = newRow.insertCell();
        v.innerHTML="<img src= \"" + array.image + "\"  width=50 height=50 >";
        v.className="column";
    }
    else{
        v = newRow.insertCell();
        v.innerHTML='No Image';
        v.className="column";
    }
    v = newRow.insertCell();
    v.innerHTML="<input class=\"btn\" type=button value=X id=btn"+ startIndex+">";
    v.className="column";

    startIndex+=1;
}

function formatDate(date)
{
    var d = new Date(date);
    const month = d.toLocaleString('Ro', {month:'long'});
    const day = d.getDay();
    const year = d.getFullYear();

    return day+1+' '+month.charAt(0).toUpperCase() + month.slice(1)+' '+year;
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

function clearForm()
{
    let form = Array.from(document.querySelectorAll('#myForm input, select'));
    for(i = 0; i<form.length-1;++i)
    {
        form[i].value="";
    }
    errorHolder.innerHTML="";
}

function checkForm()
{
    let form = Array.from(document.querySelectorAll('#myForm input, select'));


    //0 First Name
    //1 Last Name
    //2 Mail
    //3 Sex
    //4 Data
    //5 Image

    if(!form[0].value || !form[1].value || !form[2].value || !form[3].value || !form[4].value)
    {
        error="Every starred (*) field needs to be compeleted.";
        return false;
    }

    if(!validateEmail(form[2].value))
    {
        error = "Mail is not correct.";
        return false;
    }

    return true;
}

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function sortBy(element)
{
    console.log(element);
}

firstLoad()
setListenerForButtons()