document.querySelector('.hamburger-icon').addEventListener('click', () => toggleSidebar());

function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar')
  const sidebarItems = document.querySelector('.sidebar-items')
  const sidebarItem = document.querySelector('.sidebar-item')

  const isSideBarOpen = sidebar.getAttribute('isOpen');
  if (isSideBarOpen.toString() == 'false') {
    sidebarItems.style.visibility = 'visible'
    
      sidebarItem.style.visibility = 'visible'

    sidebar.style.width = '60vw';
    sidebar.style.minWidth = '230px';
    sidebar.setAttribute('isOpen', 'true');
  } else {
    sidebarItems.style.visibility = 'hidden'
    
    sidebarItem.style.visibility = 'hidden'
    

    sidebar.style.width = '0';
    sidebar.style.minWidth = 'unset';
    sidebar.setAttribute('isOpen', 'false');
  }
}

const sidebar = document.querySelector('.sidebar').addEventListener('click', () => { 
  toggleSidebar();
})

const main = document.querySelector(".container").addEventListener('click', () => closeSidebar())
// const header = document.querySelector(".header").addEventListener('click', () => closeSidebar())

function closeSidebar() {
  const sidebar = document.querySelector('.sidebar')
  const sidebarItems = document.querySelector('.sidebar-items')
  const sidebarItem = document.querySelector('.sidebar-item')

  sidebar.style.width = '0';
  sidebar.style.minWidth = 'unset';

  sidebarItems.style.visibility = 'hidden'
  sidebarItem.style.visibility = 'hidden'
    
    

    sidebar.style.width = '0';
    sidebar.style.minWidth = 'unset';
  sidebar.setAttribute('isOpen', 'false');
}



//socials appearence
let isActivable = true;
window.onscroll = () => { 
  if (isActivable) { 
    isActivable = false;
    const socialsSide = document.querySelector('.socials-side')
    socialsSide.style.position = 'fixed';
    socialsSide.style.right = '0'
    socialsSide.style.visibility = 'visible'
    setTimeout(() => {
      socialsSide.style.right = '-50px'
      isActivable = true;
    }, 8000);
  }
  
}