let leftInstallMenuBtn = "";
let rightInstallMenuBtn = "";
let rightMenuBtn = "";
let asideBarRight = "";
let fieldContainer = "";
let installcontainer = "";

$(document).ready(function () {
    leftInstallMenuBtn = document.getElementById("LeftPannelIcon1");
    rightInstallMenuBtn = document.getElementById("RightPannelInstallIcon1");
    rightMenuBtn = document.getElementById("PannelMenuBtn");
    asideBarRight = document.getElementById("AsideBarRight");
    fieldContainer = document.getElementById("field-container");
    installcontainer = document.getElementById("install-container");

    // $(".LeftPannelIcon1").click(function () {
    //     toggleInstallMenu();
    // });

    // $(".PannelIcon2").click(function () {
    //     toggleRightInstallMenu();
    // });
  
    
});

function PannelIcon2(event)  {
    $(".AsideBarInstallRight").toggleClass("RightPanel2Active");
    $(".RightPanel2").toggleClass("Active");
    event.currentTarget.classList.toggle("Active")
};

function toggleRightInstallMenu() {
    $(this).toggleClass("Active", { duration: 3000 });
    $(".PannelIcon").removeClass("Active", { duration: 3000 });
    $(".AsideBarInstallRight").toggleClass("RightPanel2Active");
    $(".AsideBarRight").removeClass("RightPanel1Active");
    $(".RightPanel1").removeClass("Active");
    $(".RightPanel2").toggleClass("Active");

    if ($(".AsideBarRight").hasClass("Active")) {
        toggelProjectSelectDiv();
        removeClasses([rightMenuBtn], "display-block");
        addClasses([rightMenuBtn], "display-none");
    }
    if (!$(".AsideBarInstallRight").hasClass("RightPanel2Active")) {
        addClasses([rightMenuBtn], "display-block");
        removeClasses([rightMenuBtn], "display-none");
    }
    else {
        removeClasses([rightMenuBtn], "display-block");
        addClasses([rightMenuBtn], "display-none");
    }
}

function toggleInstallMenu() {
    $(".LeftPannelIcon1").toggleClass("Active", { duration: 3000 });
    removeClasses([leftInstallMenuBtn], "display-none");
    addClasses([leftInstallMenuBtn], "display-block");
    removeClasses([rightInstallMenuBtn], "display-none");
    addClasses([rightInstallMenuBtn], "display-block");
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
        removeClasses([fieldContainer], "display-none");
        addClasses([fieldContainer], "d-flex");
        removeClasses([installcontainer], "d-flex");
        addClasses([installcontainer], "display-none");
        $(".AsideBarRight").addClass("Active");
        $(".PannelIco").addClass("Active");
    }

    if (filterType === 'install') {
        addClasses([installLi], "active");
        removeClasses([filedLi], "active");
        removeClasses([htvLi], "active");
        templateName.textContent='Install';
        removeClasses([fieldContainer], "d-flex");
        addClasses([fieldContainer], "display-none");
        removeClasses([installcontainer], "display-none");
        addClasses([installcontainer], "d-flex");
    }

   
    toggelFilterMenu();
    
    // if install menu is already not opened
    if (!$(".AsideBarLeft").hasClass("AsideBarLeftActive")) {
        toggleInstallMenu();
    }
}