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
    RightPanelOne = document.getElementById("pannelone");
    RightPanelOneParent = document.getElementById("RightPanelone");
   if (RightPanelOne) {
        RightPanelOne.classList.toggle("Active");
        asideBarRight.classList.toggle("RightPanel1Active");
        RightPanelOneParent.classList.toggle("Active");

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
            RightPanelOneParent.classList.toggle("Active");

        }
        if (event.currentTarget.classList.contains("PannelIcon2")) {
            if (RightPanelOneParent.classList.contains("Active")) {
                RightPanelOne.classList.remove("Active");
                event.currentTarget.parentElement.classList.remove("RightPanel1Active");
                RightPanelOneParent.classList.remove("Active");
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
        asideBarRight.classList.add("RightPanel2Active");
        document.getElementById("installationSteps").classList.add("Active");
        RightPanelOneParent.classList.remove("Active");
        asideBarRight.classList.remove("RightPanel1Active");
        RightPanelOne.classList.remove("Active");

    }
    if (page == "field") {
        document.getElementById("pannelthree").classList.remove("Active");
        document.getElementById("AsideBarleft").classList.remove("AsideBarLeftActive");
        document.getElementById("panneltwo").classList.remove("Active");
        asideBarRight.classList.remove("RightPanel2Active");
        document.getElementById("installationSteps").classList.remove("Active");
        RightPanelOneParent.classList.add("Active");
        asideBarRight.classList.add("RightPanel1Active");
        RightPanelOne.classList.add("Active");

    }
}


function filterPopup(e) {
    document.getElementById("FilterModalId").classList.toggle("is-visible") 
}
function modalPopup(e) {
    document.getElementById("StepInstructionModalId").classList.toggle("is-visible") 
}

function collpaseButton(event) {
    if (event.currentTarget.classList.value == "collpase-btn") {id="collpaseparent"
        event.currentTarget.parentElement.parentElement.parentElement.classList.toggle("active")
    }
    if (event.currentTarget.classList.value == "resize-div") {
        event.currentTarget.parentElement.parentElement.parentElement.classList.toggle("fullscreen")
        event.currentTarget.parentElement.parentElement.parentElement.parentElement.classList.toggle("HideCards")
        
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

  
}


