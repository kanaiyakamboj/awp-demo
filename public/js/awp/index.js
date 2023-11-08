$(document).ready(function () {
  $(".ToggleBtn").click(function () {
    $(".ToggleDiv").toggleClass("Active");
  });
});

function onClickToggelProjectSelectDiv(event) {
  const panel2 = document.getElementById("panel2");

  if (event != "") {
    const currentTarget = event.currentTarget;

    if (currentTarget.classList.contains("PannelIcon")) {
      currentTarget.classList.toggle("Active");
      currentTarget.parentElement.classList.toggle("RightPanel1Active");
      panel2.classList.toggle("Active");
    }

    if (currentTarget.classList.contains("LeftPannelIcon1")) {
      currentTarget.classList.toggle("Active");
      currentTarget.parentElement.classList.toggle("AsideBarLeftActive");
    }
  }
}

function onClickFilterPopup(panelGroupId) {
  const panelGroups = getAllPosiblePanelGoupps();

  if (panelGroups.has(panelGroupId) || panelGroupId === "closeClick") {
    hideShowFilterPopup();

    if (panelGroupId !== "closeClick") {
      bindAllDataPanelsValuesToPopup(panelGroupId);
    }
  }
}

function hideShowFilterPopup() {
  const modelPopup = document.getElementById("FilterModalId");
  modelPopup.classList.toggle("is-visible");
}

function hideShowFaqPopup() {
  $("#iframeFaq").attr("src", "../../assets/documents/awp-user-manual.pdf");

  const modalPopup = document.getElementById("faqPopup");

  /*
  if(modelPopup.classList.contains('is-visible')){
    closeFilterMenu();
  }
  */

  modalPopup.classList.toggle("is-visible");
}

function hideShowDocsPopup() {
  const modalPopup = document.getElementById("docsPopup");

  modalPopup.classList.toggle("is-visible");
}

window.fullScreen = false;

function onClickCollpaseButton(event) {
  window.fullScreen = event.target.className === "fullscreen";

  const currentTarget = event.currentTarget;

  const parentElement = currentTarget.parentElement.parentElement.parentElement;

    if (currentTarget.classList.value == "collpase-btn") {
      document.getElementById("legend").classList.toggle("fullscreen");
      parentElement.classList.toggle("active");
  }

  if (currentTarget.classList.value == "resize-div") {
    parentElement.classList.toggle("fullscreen");
    parentElement.parentElement.classList.toggle("HideCards");
    document.getElementById("legend").classList.toggle("fullscreen");
  }
}

function handleInstallMenuItemClick(filterType) {
  const installLi = document.getElementById("install");

  const templateName = document.getElementById("template-name");

  window.filterType = filterType;

  addClasses([installLi], "active");

  templateName.textContent = "Install";
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
    if (element) {
      element.classList.remove(className);
    }
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

function importButtonConditionally() {
  const deviceType = getOS();

  const devices = ["iOS", "Android"];

  const normalImportControl = document.getElementById("btn-import-file");
  const zipImportControl = document.getElementById("btn-import-file-zip");

  if (devices.includes(deviceType)) {
    normalImportControl.style.display = "none";
    zipImportControl.style.display = "inline-flex";
  } else {
    normalImportControl.style.display = "inline-flex";
    zipImportControl.style.display = "none";
  }
}

window.addEventListener("load", async () => {
  const result = await bindAllPanelsAsPerConfigSetup();

  setTimeout(() => {
    const projectStoreXlsxData = getDataFromIndexedDB("projectStoreXlsxData");

    if (projectStoreXlsxData) {
      projectStoreXlsxData.then((res) => {
        bindAllProjectSelectionFilterControlOnRefresh();
        loadCanvas();
        if (DataValidator.validate(res)) {
          datastoreLoaded(res);
        } else {
          localStorage.removeItem("projectSelectionFilterData");
        }
      });
    }
    getVersion();

    importButtonConditionally();
    //openFilterMenu();
    if (!window?.pageRefreshed) {
      hideShowDocsPopup();
    }
  }, 1000);
});

function showAlert() {
  alert("Please make workpack selection first");
}

function getVersion() {
  fetch("../version.json")
    .then((response) => response.json())
    .then((json) => {
      const versionElement = document.getElementById("version-number");

      if (versionElement) {
        versionElement.textContent = json.version;
      }
    });
}

function getOS() {
  // return 'Android';
  var uA = navigator.userAgent || navigator.vendor || window.opera;
  if (
    (/iPad|iPhone|iPod/.test(uA) && !window.MSStream) ||
    (uA.includes("Mac") && "ontouchend" in document)
  )
    return "iOS";

  var i,
    os = ["Windows", "Android", "Unix", "Mac", "Linux", "BlackBerry"];
  for (i = 0; i < os.length; i++)
    if (new RegExp(os[i], "i").test(uA)) return os[i];
}

function clearAllFilters() {
    if (confirm("Are you sure you want to reset all filters?") == false)
        return;

  const getfiltersData = LocalObjectStore.getDataByKey("filtersData");

  if (getfiltersData) {
    const currentStep = getfiltersData?.currentStep;

    const stepsDataToWorkForFilters =
      getfiltersData?.allStepsDataPanelGroupWise;

    const newFilterObject = {
      ...getfiltersData,
      filteredColumns: { [currentStep]: new Set() },
    };

    LocalObjectStore.addDataToStore("filtersData", newFilterObject);

    if (stepsDataToWorkForFilters) {
      const panelGroupData = stepsDataToWorkForFilters[currentStep];
      bindDataToAllPanel(panelGroupData);
    }
  }
}

function hideShowNotesPopup(){
  loadNotesCanvas();
  const modelPopup = document.getElementById("NotesModal");
  modelPopup.classList.toggle("is-visible");
}
