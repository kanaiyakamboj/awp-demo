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
   if (document.getElementById("pannelone")) {
        document.getElementById("pannelone").classList.toggle("Active");
        document.getElementById("AsideBarRight").classList.toggle("RightPanel1Active");
        document.getElementById("RightPanelone").classList.toggle("Active");

    }
});

function toggelProjectSelectDiv(event, page) {

    if (event != "") {
        if (event.currentTarget.classList.contains("PannelIcon")) {
            if (document.getElementById("installationSteps").classList.contains("Active")) {
                document.getElementById("panneltwo").classList.remove("Active");
                event.currentTarget.parentElement.classList.remove("RightPanel2Active");
                document.getElementById("installationSteps").classList.remove("Active");
            }
            event.currentTarget.classList.toggle("Active");
            event.currentTarget.parentElement.classList.toggle("RightPanel1Active");
            document.getElementById("RightPanelone").classList.toggle("Active");

        }
        if (event.currentTarget.classList.contains("PannelIcon2")) {
            if (document.getElementById("RightPanelone").classList.contains("Active")) {
                document.getElementById("pannelone").classList.remove("Active");
                event.currentTarget.parentElement.classList.remove("RightPanel1Active");
                document.getElementById("RightPanelone").classList.remove("Active");
            }
            event.currentTarget.classList.toggle("Active");
            event.currentTarget.parentElement.classList.toggle("RightPanel2Active");
            document.getElementById("installationSteps").classList.toggle("Active");

        }
        if (event.currentTarget.classList.contains("LeftPannelIcon1")) {
            event.currentTarget.classList.toggle("Active");
            event.currentTarget.parentElement.classList.toggle("AsideBarLeftActive");
        }
    }
    if (page == "install") {
        document.getElementById("pannelthree").classList.add("Active");
        document.getElementById("AsideBarleft").classList.add("AsideBarLeftActive");
        document.getElementById("panneltwo").classList.add("Active");
        document.getElementById("AsideBarRight").classList.add("RightPanel2Active");
        document.getElementById("installationSteps").classList.add("Active");
        document.getElementById("RightPanelone").classList.remove("Active");
        document.getElementById("AsideBarRight").classList.remove("RightPanel1Active");
        document.getElementById("pannelone").classList.remove("Active");

    }
    if (page == "field") {
        document.getElementById("pannelthree").classList.remove("Active");
        document.getElementById("AsideBarleft").classList.remove("AsideBarLeftActive");
        document.getElementById("panneltwo").classList.remove("Active");
        document.getElementById("AsideBarRight").classList.remove("RightPanel2Active");
        document.getElementById("installationSteps").classList.remove("Active");
        document.getElementById("RightPanelone").classList.add("Active");
        document.getElementById("AsideBarRight").classList.add("RightPanel1Active");
        document.getElementById("pannelone").classList.add("Active");

    }
}


function filterPopup(e) {
    $('.FilterModal').toggleClass('is-visible').animate({ top: 0 });

}
function modalPopup(e) {
    $('.StepInstructionModal').toggleClass('is-visible').animate({ top: 0 });

}

function collpaseButton(event) {
    if (event.currentTarget.classList.value == "collpase-btn") {
        event.currentTarget.parentElement.parentElement.parentElement.classList.toggle("active")
    }
    if (event.currentTarget.classList.value == "resize-div") {
        event.currentTarget.parentElement.parentElement.parentElement.classList.toggle("fullscreen")
    }
}

function handleInstallMenuItemClick(filterType) {
    const filedLi = document.getElementById('field');
    const htvLi = document.getElementById('htv');
    const installLi = document.getElementById('install');
    const templateName = document.getElementById('template-name');

    if (filterType === 'field') {
        addClasses([filedLi], "active");
        removeClasses([htvLi], "active");
        removeClasses([installLi], "active");
        templateName.textContent = 'Field';
        removeClasses([fieldContainer], "display-none");
        addClasses([fieldContainer], "d-flex");
        removeClasses([installcontainer], "d-flex");
        addClasses([installcontainer], "display-none");
        toggelProjectSelectDiv("", "field");
    }

    if (filterType === 'install') {
        addClasses([installLi], "active");
        removeClasses([filedLi], "active");
        removeClasses([htvLi], "active");
        templateName.textContent = 'Install';
        removeClasses([fieldContainer], "d-flex");
        addClasses([fieldContainer], "display-none");
        removeClasses([installcontainer], "display-none");
        addClasses([installcontainer], "d-flex");
        toggelProjectSelectDiv("", "install");
    }


    toggelFilterMenu();

    // if install menu is already not opened
    if (!$(".AsideBarLeft").hasClass("AsideBarLeftActive")) {
        toggleInstallMenu();
    }
}


