function showHideControls(id) {
  const leftMenuSidebar = document.getElementById(id);
  const currentClass = leftMenuSidebar.getAttribute("class");
  if (currentClass === "display-none") {
    removeClasses([leftMenuSidebar], "display-none");
    addClasses([leftMenuSidebar], "display-block");
  } else {
    removeClasses([leftMenuSidebar], "display-block");
    addClasses([leftMenuSidebar], "display-none");
  }
}

function openLeftMainSideBar() {
  showHideControls("left-menu-sidebar");
}

function removeClasses(elements, className) {
  elements.forEach((element) => {
    element.classList.remove(className);
  });
}

function addClasses(elements, className) {
  elements.forEach((element) => {
    element.classList.add(className);
  });
}

function onFilterClick(type) {debugger
  const fieldTemplate = document.getElementById("field-template");
  const htvTemplate = document.getElementById("htv-template");
  const installTemplate = document.getElementById("install-template");

  if (type === "field") {
    removeClasses([fieldTemplate], "display-none");
    addClasses([htvTemplate, installTemplate], "display-none");
    addClasses([fieldTemplate], "display-block");
  }

  if (type === "htv") {
    removeClasses([htvTemplate], "display-none");
    addClasses([fieldTemplate, installTemplate], "display-none");
    addClasses([htvTemplate], "display-block");
  }

  if (type === "install") {
    const installRightPanel=document.getElementById('install-right-panel');

    removeClasses([installRightPanel], "acitve");
    addClasses([fieldTemplate, htvTemplate], "display-none");
    addClasses([installTemplate], "display-block");
  }
}

function toggelFilterMenu(){
  let filterMenuElement=document.getElementById('filter-menu');
  let currentClass=filterMenuElement.getAttribute('class');

  filterMenuElement.classList.add('MainMenu');

  if(currentClass.includes('is-visible')){
      filterMenuElement.classList.remove('is-visible');      
  }else{
      filterMenuElement.classList.add('is-visible');
  }
}

window.addEventListener("load", () =>
  setTimeout(() => {
    bindAllProjectSelectionFilterControlOnRefresh();
    loadCanvas();
  }, 100)
);