

let maxIndex = 0;

document.addEventListener("DOMContentLoaded", event =>
{
    const app = firebase.app();
    const db = firebase.firestore();

    const workRef = db.collection('workers');

    workRef.get()
        .then(doc => {
                doc.forEach(doc =>{
                    data = doc.data()
                    appendHTML(data,doc.id)
                    if(maxIndex<doc.id)
                    {
                        maxIndex=parseInt(doc.id);
                    }
                    
                })
                
                setListenerForButtons()
            });
    console.log("data loaded");

    
});


const myForm = document.getElementById('myForm');
const table = document.getElementById('table-class');
let buttons = document.getElementsByClassName('btn');
let storage = window.localStorage;
let error= "";
const errorHolder = document.getElementById('error');





myForm.addEventListener("submit", (e) =>
{
    e.preventDefault(); //stops the browser redirect
    console.log("Form has been submited.");

    // if(!checkForm())
    // {
    //     console.log(error);
    //     errorHolder.innerHTML=error;
    //     return
    // }
    
    let arr = formToArray();
    let obj = objectify(arr);
    //let jsonToFile = JSON.stringify(obj);
    //appendStorage(jsonToFile);
    maxIndex+=1;
    appendHTML(obj,maxIndex);
    appendFireBase(obj);
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
    for(i = 0; i<6;++i)
    {
        console.log(form[i].value);

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

function appendHTML(array,startIndex)
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
    v.innerHTML = "<input class=\"edit\" type=button value=Edit id=edit"+ startIndex+" onclick=editMember(this.id)>";
    v.className="column";

    v = newRow.insertCell();
    v.innerHTML="<input class=\"btn\" type=button value=X id=btn"+ startIndex+">";
    v.className="column";


}


function editMember(id)
{
    console.log(id)
    id=id.toString().replace('edit','')
    
    var row = document.getElementById(id);
    for(i=1;i<4;++i)
    {
        row.cells[i].innerHTML = "<td class=\"column\"><input type=\"text\" value=" + row.cells[i].innerText +"></td>"
    }

    male = false;
    female=false;
    other=false;

    value = row.cells[4].innerText.toLowerCase()
    row.cells[4].innerHTML ="<td class=\"column\"><select name=\"sex\" id=\"sex\"> <option value=\"female\">Female</option><option value=\"male\"> Male </option><option value=\"wtf\">Other</option></select></td>";
    row.cells[4].firstElementChild.value=value;

    value = row.cells[5].innerText;
    d = new Date(value);
    
    
    day = d.getDate();
    try
    {
        day = day.zeroPad()
    }
    catch
    {
        ;
    }
    
    month = d.getMonth();
    try
    {
        month = month.zeroPad();
    }
    catch
    {
        ;
    }
    year = d.getFullYear();

    row.cells[5].innerHTML = "<td class=\"column\"><input type=\"date\" name=\"date\" id=\"date\" value="+year+"-"+month+"-"+day+"></td>";
    row.cells[7].firstElementChild.value="Apply";
    row.cells[7].firstElementChild.onclick= function () {console.log('hi')};
    
   
}

Number.prototype.zeroPad = function() {
    return ('0'+this).slice(-2);
 };

function formatDate(date)
{
    var d = new Date(date);
    const month = d.toLocaleString('En', {month:'long'});
    const day = d.getDate();
    const year = d.getFullYear();

    return day+' '+month.charAt(0).toUpperCase() + month.slice(1)+' '+year;
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

function appendFireBase(array)
{
    const db = firebase.firestore();

    console.log(array);
    db.collection('workers').doc((maxIndex).toString()).set(array);
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
    const db = firebase.firestore();

    db.collection('workers').doc(rowid.toString()).delete().then(() =>
    {
        console.log(`${rowid} deleted`);
    })
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
    for (var i = 0; i < storage.length; i++){
        if(storage.getItem(storage.key(i)))
        {
            console.log(storage.getItem(storage.key(i)));
            try {
                appendHTML(JSON.parse(storage.getItem(storage.key(i))));
            } catch (error) {
                continue;
            }
        }
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
    var columnIndex=-1;
    var comparison = '(ASC)';
    var myTable, rows, switching, i, x, y, shouldSwitch;
    myTable = document.getElementById("myTable");
    switching = true;

    for(let i=0;i<myTable.rows[0].cells.length;++i)
    {
        if(myTable.rows[0].cells[i].innerHTML === element)
        {
            if(myTable.rows[0].cells[i].innerHTML.includes(comparison))
            {
                comparison='(DESC)';
            }
            columnIndex=i;
            break;
        }
    }

    if(columnIndex==-1)
    {
        console.log("Something went wrong. Abort mission " + columnIndex);
        return;
    }
    
    /*Make a loop that will continue until
    no switching has been done:*/

    console.log(columnIndex)
    
    
    while (switching) {
      //start by saying: no switching is done:
      switching = false;
      rows = myTable.rows;
      /*Loop through all table rows (except the
      first, which contains table headers):*/
      for (i = 1; i < (rows.length - 1); i++) {
        //start by saying there should be no switching:
        shouldSwitch = false;
        /*Get the two elements you want to compare,
        one from current row and one from the next:*/
        x = rows[i].getElementsByTagName("TD")[columnIndex];
        y = rows[i + 1].getElementsByTagName("TD")[columnIndex];
        
        //check if the two rows should switch place:
        if(comparison=='(DESC)')
        {
            if(columnIndex==0)
            {
                if (parseInt(x.innerHTML) < parseInt(y.innerHTML)) {
                    //if so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                  }
            }
            else if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                //if so, mark as a switch and break the loop:
                shouldSwitch = true;
                break;
              }
        }
        else
        {
            if(columnIndex==0)
            {
                if (parseInt(x.innerHTML) > parseInt(y.innerHTML)) {
                    //if so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                  }
            }
            else if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                //if so, mark as a switch and break the loop:
                shouldSwitch = true;
                break;
              }
        }
        
      }
      if (shouldSwitch) {
        /*If a switch has been marked, make the switch
        and mark that a switch has been done:*/
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
      }
    }

    updateInnerHTML(element,comparison);
}

function updateInnerHTML(element, comparison)
{
    let negateComparison = '(DESC)';
    if(comparison==='(DESC)')
    {
        negateComparison='(ASC)';
    }
    console.log("C "+comparison + " N " + negateComparison);

    myTable = document.getElementById("myTable");
    let index = -1;

    //this ads the table name
    for(let i=0;i<myTable.rows[0].cells.length;++i)
    {
        if(myTable.rows[0].cells[i].innerHTML === element)
        {
            if(!myTable.rows[0].cells[i].innerHTML.includes(comparison))
            {
                console.log("added "+comparison);
                myTable.rows[0].cells[i].innerHTML = myTable.rows[0].cells[i].innerHTML + comparison;
                index = i;
            }

            if(myTable.rows[0].cells[i].innerHTML.includes(negateComparison))
            {
                console.log("Removed " + negateComparison)
                myTable.rows[0].cells[i].innerHTML = myTable.rows[0].cells[i].innerHTML.replace(negateComparison,"");
                index = i;
            }
            console.log(myTable.rows[0].cells[i].innerHTML);

            break;
        }
    }

    //this deletes any unnecesarry strings
    for(let i=0;i<myTable.rows[0].cells.length;++i)
    {
        if(myTable.rows[0].cells[i].innerHTML.includes(comparison) && index != i)
        {
            myTable.rows[0].cells[i].innerHTML = myTable.rows[0].cells[i].innerHTML.replace(comparison,"");
        }
        if(myTable.rows[0].cells[i].innerHTML.includes(negateComparison) && index != i)
        {
            myTable.rows[0].cells[i].innerHTML = myTable.rows[0].cells[i].innerHTML.replace(negateComparison,"");
        }
    }


}


function filterBySex()
{
    var input = document.getElementById('filterSex');

    switch (input.value)
    {
        case 'female':
            console.log("Its female");
            break;
        case 'male':
            console.log('Its male');
            break;
        case 'wtf':
            console.log('Why on earth...');
            break;
        default:
            console.log(input.value);
            break;
    }

    var filter, table, tr, td, i, txtValue;
    filter = input.value.toUpperCase();
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");
    for (i = 1; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[4];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }       
    }
    
}

function filterByImg()
{
    var input = document.getElementById('filterImg');

    switch (input.value)
    {
        case 'female':
            console.log("Its female");
            break;
        case 'male':
            console.log('Its male');
            break;
        case 'wtf':
            console.log('Why on earth...');
            break;
        default:
            console.log(input.value);
            break;
    }

    var filter, table, tr, td, i, txtValue;
    filter = input.value.toUpperCase();
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");
    for (i = 1; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[6];
      if (td) {
        txtValue = td.innerHTML;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }       
    }
    
}

function filterByDate(startDate, endDate) {
    if(startDate)
    {
        startDate=formatDate(startDate);
        startDate = new Date(startDate);
    }

    if(endDate)
    {
        startDate=formatDate(endDate);
        endDate = new Date(endDate);
    }

    var filter, table, tr, td, i;
    filter = startDate||endDate;
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");
    for (i = 1; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[5];
        if (td) {
          cellDate = new Date(td.innerHTML);
          if(startDate)
          {
              console.log("C: " + cellDate);
              console.log("S: "+ startDate);
                console.log(cellDate >= startDate);
              if (cellDate >= startDate) {
                  tr[i].style.display = "";
                } else {
                  tr[i].style.display = "none";
                }
          }
          else
          {
            if (cellDate <= startDate) {
                tr[i].style.display = "";
              } else {
                tr[i].style.display = "none";
              }
          }
          
        }       
      }
}

function filterByKw(value)
{
    myTable = document.getElementById("myTable");
    rowsLength = myTable.rows.length;
    var arrToShow = Array(rowsLength).fill(false);

    var filter, table, tr, td, i, txtValue;
    filter = value.toUpperCase();
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");
    for (i = 1; i < tr.length; i++) { //row
        for (cell = 0; cell < tr[i].cells.length ; ++cell)
        {
            td = tr[i].getElementsByTagName("td")[cell];
            if (td) {
                txtValue = td.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    arrToShow[i]=true;
                    break;
                }
            }            
        }
    }

    for(i=1;i<tr.length;++i)
    {
        if(!arrToShow[i])
        {
            tr[i].style.display="none";
        }
        else
        {
            tr[i].style.display="";
        }
    }

}
