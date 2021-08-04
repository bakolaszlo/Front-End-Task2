const myForm = document.getElementById('myForm');
const table = document.getElementById('table-class');

let startIndex = 0;


myForm.addEventListener("submit", (e) =>
{
    e.preventDefault(); //stops the browser redirect
    console.log("Form has been submited.");
    let array = document.querySelectorAll('#myForm input, select')
    appendHTML(array);
});


function appendHTML(array)
{
    let newRow = table.insertRow();
    newRow.insertCell().innerHTML=startIndex;
    startIndex+=1;

    array.forEach(element => {
        if(element.value!='Register')
        {

            newRow.insertCell().innerHTML=element.value;
            console.log(element.value);
            element.value='';
        }
    });
}