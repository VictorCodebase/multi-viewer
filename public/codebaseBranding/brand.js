
const header = document.querySelector('header');
const footer = document.querySelector('footer');

const headerLogo = document.createElement('img');


const headerTitle = document.createElement('h1');
//get the title from the document title
headerTitle.textContent = document.title;


function constructHeader(){
    //if screensize is small, show small logo
    isLargeScreen = window.innerWidth > 800;

    const logoDiv = document.createElement('div');
    logoDiv.id = 'logoContainer';
    if (isLargeScreen){
      logoPath = '/codebaseBranding/logo/PrimaryLogo.png';
  }
  else{
      logoPath = '/codebaseBranding/logo/secondaryLogo2.png';
  }

    const logoImgDiv = document.createElement('div');
    if (isLargeScreen){
        logoImgDiv.classList.add('logoImg');
    }else{
        logoImgDiv.classList.add('logoImgMobile');
    }
    //logoImgDiv.classList.add('logoImg');

    const logoImg = document.createElement('img');
    const logoUrl = document.createElement('a');
    logoImg.src = logoPath;
    logoUrl.href = 'https://github.com/VictorCodebase';
    logoUrl.target = '_blank';
    logoImg.alt = 'Logo';

    const titleDiv = document.createElement('div');
    titleDiv.id = 'title';

    const appTitleDiv = document.createElement('div');
    appTitleDiv.classList.add('appTitle');
    //fetch file name from html document
    appTitleDiv.textContent = document.title.toUpperCase();

    

    //! Hamburger menu section auto generated
    const menuDiv = document.createElement('div');
    menuDiv.id = 'menu';
    const hamburgerMenuContainer = document.createElement('div');
    hamburgerMenuContainer.id = 'hamburgerMenuContainer';
    for (let i = 0; i < 3; i++) {
      const hamburgerMenuEl = document.createElement('div');
      hamburgerMenuEl.id = `hamburgerMenuEl${i}`;
      hamburgerMenuEl.classList.add('hamburgerMenuEl');
      hamburgerMenuContainer.appendChild(hamburgerMenuEl);
    }
    
    menuDiv.appendChild(hamburgerMenuContainer);
    hamburgerMenuContainer.addEventListener('click', function(){
      alert('hamburger menu clicked');
    });

    //logoImgMobileDiv.appendChild(logoImgMobile);
    logoImgDiv.appendChild(logoUrl);
    logoUrl.appendChild(logoImg);
    //logoDiv.appendChild(logoImgMobileDiv);
    logoDiv.appendChild(logoImgDiv);
    titleDiv.appendChild(appTitleDiv);

    header.appendChild(logoDiv);
    header.appendChild(titleDiv);
    header.appendChild(menuDiv);

}
constructHeader();

function constructFooter(){
    // Create a container div for the footer sections
    const footerContainer = document.createElement('div');
    footerContainer.classList.add('rows');

    // Create the first footer section
    const footerSection1 = createFooterSection('Contribution', [
      {tag: 'p', html: 'We &#U+2764; You'},
      { src: '/codebaseBranding/logo/contributeGithub.png',html: 'view on github', id: 'githubLink'},
      { src: '/codebaseBranding/logo/starProject.png',html: 'star project on github', id: 'starProject' },
      { src: '/codebaseBranding/logo/buyCoffee.png',html: 'get on microsoft store', id: 'buyCoffee' },
    ]);

    // Create the second footer section
    const footerSection2 = createFooterSection('Contacts', [
      { tag: 'p', html: 'mobile: +254790405421' },
      { tag: 'p', html: 'email 1: (collaboration): victorkithinji@outlook.com' },
      { tag: 'p', html: 'email 2: (feedback): markkithinji469@gmail.com' },
    ]);

    // Create the third footer section
    const footerSection3 = createFooterSection('Other Products', [
      { tag: 'p', html: 'More from CodeBase Studio' },
      {
        tag: 'p',
        html: 'visit: <a href="https://markkithinji469.wixsite.com/victorcodebase">VictorCodebase studio</a>',
      },
      {
        tag: 'p',
        html: 'productivity tools: <a href="https://markkithinji469.wixsite.com/victorcodebase">VictorCodebase - windows</a>',
      },
      {
        tag: 'p',
        html: 'mobile games: <a href="https://markkithinji469.wixsite.com/victorcodebase">VictorCodebase - games</a>',
      },
    ]);

    // Create the footer base section
    const footerBase = document.createElement('div');
    footerBase.classList.add('footerbase');

    const center = document.createElement('center');
    const p = document.createElement('p');
    p.innerHTML = '&copy; 2023 VictorCodebase Studio';

    center.appendChild(p);
    footerBase.appendChild(center);

    // Append the sections and the footer base to the document
    footerContainer.appendChild(footerSection1);
    footerContainer.appendChild(footerSection2);
    footerContainer.appendChild(footerSection3);
    footer.appendChild(footerContainer);
    footer.appendChild(footerBase);

    // Function to create a footer section with content
    function createFooterSection(title, content) {
      const footerSection = document.createElement('div');
      footerSection.classList.add('footer-section');

      // Create a title for the section
      const titleElement = document.createElement('div');
      titleElement.classList.add('footer-section-title');
      titleElement.textContent = title;
      footerSection.appendChild(titleElement);

      //! Create content elements
      for (const item of content) {
        const element = document.createElement(item.tag || 'img');
        if (item.src) {
          element.src = item.src;
          element.alt = item.alt;
          element.id = item.id;
        } else {
          element.innerHTML = item.html;
        }
        footerSection.appendChild(element);
      }

      return footerSection;
    }

}

document.addEventListener('DOMContentLoaded', function(){
  const githubLink = document.getElementById('githubLink');
  const starProject = document.getElementById('starProject');
  const buyCoffee = document.getElementById('buyCoffee');

  githubLink.addEventListener('click', function(){
    alert('github link clicked');
    window.open('https://github.com/VictorCodebase/multi-viewer', '_blank');
  })
  starProject.addEventListener('click', function(){
    window.open('https://github.com/VictorCodebase?tab=repositories', '_blank');
  })
  buyCoffee.addEventListener('click', function(){
    window.open('https://www.paypal.com/donate/?hosted_button_id=UEWAR4XZW79ML', '_blank');
  });

});
constructFooter();

