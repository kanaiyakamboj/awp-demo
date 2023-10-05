$(document).ready(function () {
  $(".ToggleBtn").click(function () {
    $(".ToggleDiv").toggleClass("Active");
  });
});

function onClickToggelProjectSelectDiv(event, page) {
  const asideBarRightPanels = document.getElementById("asideBarRightPanels");
  const asideBarLeftPanels = document.getElementById("asideBarLeftPanels");
  const leftSideDownPannelButton = document.getElementById(
    "leftSideDownPannelButton"
  );

  const rightSideDownPanelButton = document.getElementById(
    "rightSideDownPanelButton"
  );

  const installationStepsPannel = document.getElementById(
    "installationStepsPannel"
  );

  const rightTopProjectSelectionPannel = document.getElementById(
    "rightTopProjectSelectionPannel"
  );

  const rightSidePannelOneButton = document.getElementById(
    "rightSidePannelOneButton"
  );

  if (event != "") {
    const currentTarget = event.currentTarget;

    const storeFilteredData = JSON.parse(localStorage.getItem("projectSelectionFilterData"));
    const currentStepData=storeFilteredData?.currentStepData;

    if (!currentStepData) {
      showAlert();
      return false;
    }

    if (currentTarget.classList.contains("PannelIcon")) {
      if (installationStepsPannel.classList.contains("Active")) {
        removeClasses(
          [rightSideDownPanelButton, installationStepsPannel],
          "Active"
        );
        removeClasses([currentTarget.parentElement], "RightPanel2Active");

      }

      currentTarget.classList.toggle("Active");
      currentTarget.parentElement.classList.toggle("RightPanel1Active");
      rightTopProjectSelectionPannel.classList.toggle("Active");
    }

    if (currentTarget.classList.contains("PannelIcon2")) {
      if (rightTopProjectSelectionPannel.classList.contains("Active")) {
        removeClasses(
          [rightSidePannelOneButton, rightTopProjectSelectionPannel],
          "Active"
        );
        removeClasses([currentTarget.parentElement], "RightPanel1Active");
      }
      const className = currentTarget.getAttribute("class");

      currentTarget.classList.toggle("Active");
      currentTarget.parentElement.classList.toggle("RightPanel2Active");
      installationStepsPannel.classList.toggle("Active");
    }

    if (currentTarget.classList.contains("LeftPannelIcon1")) {
      const className = currentTarget.getAttribute("class");

      currentTarget.classList.toggle("Active");
      currentTarget.parentElement.classList.toggle("AsideBarLeftActive");
    }
  }

  if (page == "install") {
    removeClasses(
      [rightSidePannelOneButton, rightTopProjectSelectionPannel],
      "Active"
    );
    addClasses([asideBarLeftPanels], "AsideBarLeftActive");
    removeClasses([asideBarRightPanels], "RightPanel1Active");
    addClasses([asideBarRightPanels], "RightPanel2Active");
    addClasses(
      [
        leftSideDownPannelButton,
        rightSideDownPanelButton,
        installationStepsPannel,
      ],
      "Active"
    );
  }

  if (page == "field") {
    removeClasses(
      [
        leftSideDownPannelButton,
        rightSideDownPanelButton,
        installationStepsPannel,
      ],
      "Active"
    );
    removeClasses([asideBarLeftPanels], "AsideBarLeftActive");
    removeClasses([asideBarRightPanels], "RightPanel2Active");
    addClasses([asideBarRightPanels], "RightPanel1Active");
    addClasses(
      [rightTopProjectSelectionPannel, rightSidePannelOneButton],
      "Active"
    );
  }
}

function onClickFilterPopup(panelGroupId) {
  if(['engData','sbCrane','psCrane'].includes(panelGroupId) || panelGroupId==="closeClick"){
    hideShowFilterPopup();

    if(panelGroupId!=="closeClick"){
      bindAllDataPanelsValuesToPopup(panelGroupId);
    }
  }
}

function hideShowFilterPopup(){
  const modelPopup = document.getElementById("FilterModalId");
  modelPopup.classList.toggle("is-visible");
}

window.fullScreen = false;
function onClickCollpaseButton(event) {
  window.fullScreen = event.target.className === 'fullscreen';
  const currentTarget = event.currentTarget;
  const parentElement = currentTarget.parentElement.parentElement.parentElement;
  if (currentTarget.classList.value == "collpase-btn") {
    parentElement.classList.toggle("active");
  }

  if (currentTarget.classList.value == "resize-div") {
    parentElement.classList.toggle("fullscreen");
    parentElement.parentElement.classList.toggle("HideCards");
  }
}

function handleInstallMenuItemClick(filterType) {
  const filedLi = document.getElementById("field");
  const htvLi = document.getElementById("htv");
  const installLi = document.getElementById("install");

  const templateName = document.getElementById("template-name");

  const filedTemplate = document.getElementById("field-container");
  const installTemplate = document.getElementById("install-container");
  window.filterType=filterType;
  if (filterType === "field") {
    addClasses([filedLi], "active");
    removeClasses([htvLi], "active");
    removeClasses([installLi], "active");
    templateName.textContent = "Field";
    removeClasses([filedTemplate], "display-none");
    addClasses([installTemplate], "display-none");

    onClickToggelProjectSelectDiv("", "field");
  }

  if (filterType === "install") {

    const storeFilteredData = JSON.parse(localStorage.getItem("projectSelectionFilterData"));
    const currentStepData=storeFilteredData?.currentStepData;

    if (!currentStepData) {
      showAlert();
      return false;
    }

    addClasses([installLi], "active");
    removeClasses([filedLi], "active");
    removeClasses([htvLi], "active");
    templateName.textContent = "Install";
    addClasses([filedTemplate], "display-none");
    removeClasses([installTemplate], "display-none");

    onClickToggelProjectSelectDiv("", "install");
  }
}

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

function closeFilterMenu() {
  let filterMenuElement = document.getElementById("filter-menu");
  let currentClass = filterMenuElement.getAttribute("class");

  if (currentClass.includes("is-visible")) {
    filterMenuElement.classList.remove("is-visible");
  }

  bindLegend();
}

function openFilterMenu() {
  let filterMenuElement = document.getElementById("filter-menu");
  let currentClass = filterMenuElement.getAttribute("class");

  if (!currentClass.includes("is-visible")) {
    filterMenuElement.classList.add("is-visible");
  }
}

window.addEventListener("load", () =>
  setTimeout(() => {
    // showHidePannelsOnpageLoad();

    bindAllProjectSelectionFilterControlOnRefresh();
    loadCanvas();
  }, 1000)
);

function showAlert() {
  alert("Please make workpack selection first");
}
