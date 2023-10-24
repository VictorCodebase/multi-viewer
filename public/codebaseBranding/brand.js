
const header = document.getElementById('header');
const footer = document.getElementById('footer');

const headerLogo = document.createElement('img');


const headerTitle = document.createElement('h1');
//get the title from the document title
headerTitle.textContent = document.title;


function constructHeader(){
    //if screensize is small, show small logo
    if (window.innerWidth < 600){
        headerLogo.src = '/api/logo_small';
    }
    else{
        headerLogo.src = '/api/logo';
    }
    headerLogo.classList.add('header-logo');
    headerTitle.classList.add('header-title');
    header.appendChild(headerLogo);
    header.appendChild(headerTitle);
}