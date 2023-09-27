let leftInstallMenuBtn = "";
let rightInstallMenuBtn = "";
let defaultMenuBtn = "";
let rightPanel2 = "";
let fieldContainer = "";
let installcontainer = "";
let RightPanel1="";
let asideBarRight="";


$(document).ready(function () {
    leftInstallMenuBtn = document.getElementById("LeftPannelIcon1");
    rightPanel1 = document.getElementById("RightPanel1");
    defaultMenuBtn = document.getElementById("PannelMenuBtn");

    rightPanel2 = document.getElementById("RightPanel2");
    rightInstallMenuBtn = document.getElementById("RightPannelInstallIcon1");

    fieldContainer = document.getElementById("field-container");
    installcontainer = document.getElementById("install-container");
    
    asideBarRight=document.getElementById("AsideBarRight");
    hideRightPanel(true,false);
    $(".LeftPannelIcon1").click(function () {
        toggleInstallMenu();
    });

    $(".PannelIcon2").click(function () {
        toggleRightInstallMenu();
    });
});
function hideRightPanel(hideRightInstallPanel,hideRightDefaultPanel){
    if(hideRightInstallPanel){
        removeClasses([rightPanel1], "display-block");      
        addClasses([rightPanel2], "display-none");      
    }
   
}
function toggleRightInstallMenu() {
    $(this).toggleClass("Active", { duration: 3000 });
    $(".PannelIcon").removeClass("Active", { duration: 3000 });
    removeClasses([asideBarRight],"RightPanel1Active");
    addClasses([asideBarRight],"RightPanel2Active");

    removeClasses([rightPanel1],"Active");
    // removeClasses([rightPanel1],"display-block");
    // addClasses([rightPanel1],"display-none");
    removeClasses([rightInstallMenuBtn],"display-none");
    removeClasses([rightPanel2],"display-none");
    addClasses([rightPanel2],"display-block");
    addClasses([rightPanel2],"Active");

   

    // if ($(".AsideBarRight").hasClass("Active")) {
    //     toggelProjectSelectDiv();
      
    // }
   
}

function toggleInstallMenu() {
    $(".LeftPannelIcon1").toggleClass("Active", { duration: 3000 });
    removeClasses([leftInstallMenuBtn], "display-none");
    addClasses([leftInstallMenuBtn], "display-block");
    // removeClasses([rightInstallMenuBtn], "display-none");
    // addClasses([rightInstallMenuBtn], "display-block");
    $(".AsideBarLeft").toggleClass("AsideBarLeftActive");

    // $(".ContentWrapper").removeClass("ChangeFlex");
}

function handleInstallMenuItemClick(filterType) {
    const filedLi = document.getElementById('field');
    const htvLi = document.getElementById('htv');
    const installLi = document.getElementById('install');
    const templateName=document.getElementById('template-name');

    if (filterType === 'field') {
        addClasses([filedLi], "active");
        removeClasses([htvLi], "active");
        removeClasses([installLi], "active");
        templateName.textContent='Field';
    }

    if (filterType === 'install') {
        addClasses([installLi], "active");
        removeClasses([filedLi], "active");
        removeClasses([htvLi], "active");
        templateName.textContent='Install';

    }

    removeClasses([fieldContainer], "display-block");
    addClasses([fieldContainer], "display-none");
    removeClasses([installcontainer], "display-none");
    addClasses([installcontainer], "display-block");
    toggelFilterMenu();
    toggleRightInstallMenu();
    // if install menu is already not opened
    if (!$(".AsideBarLeft").hasClass("AsideBarLeftActive")) {
        toggleInstallMenu();
    }
}