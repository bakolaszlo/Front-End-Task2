const myForm = document.getElementById('myForm');

myForm.addEventListener("submit", (e) =>
{
    e.preventDefault(); //stops the browser redirect
    console.log("Form has been submited.");
});

let startIndex = 1;
