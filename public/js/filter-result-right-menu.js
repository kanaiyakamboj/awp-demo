function setFilesNameDropDownptions(fileNames, element) {
  let strHtml = '<option value="">--Select option--</option>';

  fileNames.forEach((fileName) => {
    strHtml += `<option value=${fileName}>${fileName}</option>`;
  });

  element.innerHTML = strHtml;
}

function bindControls(fileName) {
  const storeData = JSON.parse(localStorage.getItem("selectedProjectStore"));

  if (storeData.projectName) {
    const btnElement = document.getElementById("btn-import-file");
    btnElement.textContent = storeData.projectName;
    const pageTitle = document.getElementById("project-name");
    pageTitle.textContent = storeData.projectName;
  }

  if (storeData.fileNames) {
    const selectOptionElement = document.getElementById("file-names");
    setFilesNameDropDownptions(storeData.fileNames, selectOptionElement);
  }

  if (fileName) {
    bindMonopilesDropdown(fileName);
  }else{
    const selectOptionElement = document.getElementById("sheet-names");

    setFilesNameDropDownptions(
      [],
      selectOptionElement
    );
  }
}

function bindMonopilesDropdown(fileName) {
  const storeData = JSON.parse(localStorage.getItem("selectedProjectStore"));
  if (fileName) {
    if (storeData[fileName].monopiles) {
      const selectOptionElement = document.getElementById("sheet-names");

      setFilesNameDropDownptions(
        storeData[fileName].monopiles,
        selectOptionElement
      );
    }
  }
}

function bindAllProjectSelectionFilterControlOnRefresh() {
  const projectSelectionFilterData = JSON.parse(
    localStorage.getItem("projectSelectionFilterData")
  );

  if (projectSelectionFilterData && projectSelectionFilterData.projectName) {
    bindControls(projectSelectionFilterData.fileName);

    const btnElement = document.getElementById("btn-import-file");

    btnElement.textContent = projectSelectionFilterData.projectName;
  }

  if (projectSelectionFilterData && projectSelectionFilterData.fileName) {
    const selectFileNameOptionElement = document.getElementById("file-names");

    selectFileNameOptionElement.value = projectSelectionFilterData.fileName;
  }

  if (projectSelectionFilterData && projectSelectionFilterData.monopileName) {
    const selectSheetNameOptionElement = document.getElementById("sheet-names");

    selectSheetNameOptionElement.value =
      projectSelectionFilterData.monopileName;
  }
}

function onHtvDropdownChange(e) {
  const val = e.target.value;

  localStorage.removeItem("projectSelectionFilterData");

  const storeData = JSON.parse(localStorage.getItem("selectedProjectStore"));

  setProjectSelectionFilter({
    projectName: storeData.projectName,
    fileName: val,
  });

  bindMonopilesDropdown(val);
}

function onMonopileDropdownChange(e) {
  const val = e.target.value;

  setProjectSelectionFilter({ monopileName: val });
}

async function btnImportProjectClick(event) {
  const fileNames = [];

  localStorage.removeItem("selectedProjectStore");

  localStorage.removeItem("projectSelectionFilterData");

  var files = event.target.files;

  for (let i = 0; i < files.length; i++) {
    const [fileName, extension] = files[i].name.split(".");
    if (extension === "xlsx") {
      parseXlsx(files[i]);

      fileNames.push(fileName);
    }

    if (extension === "mex") {
      parseMex(files[i]);
    }
  }

  var relativePath = files[0].webkitRelativePath;

  var folder = relativePath.split("/")[0];

  const storeData = {
    projectName: folder,
    fileNames: fileNames,
  };

  setDataToStore(storeData, "selectedProjectStore");

  bindControls();
}

function setDataToStore(data, key, existedData) {
  let storeData;

  if (existedData) {
    storeData = { ...existedData, ...data };
  } else {
    storeData = data;
  }

  //add data to the store
  localStorage.setItem(key, JSON.stringify(storeData));
}

function parseMex(file) {
  var reader = new FileReader();

  reader.onload = function (event) {
    var data = JSON.parse(event.target.result);

    formatProjectStoreDataBeforePush(file, data);
    window.buildMonopile(data);
  };

  reader.readAsText(file);
}
function parseXlsx(file) {
  const reader = new FileReader();

  const sheetWiseData = {};

  reader.onload = function (e) {
    const data = e.target.result;

    const workbook = XLSX.read(data, {
      type: "binary",
    });

    workbook.SheetNames.forEach(function (sheetName) {
      const XL_row_object = XLSX.utils.sheet_to_row_object_array(
        workbook.Sheets[sheetName]
      );

      sheetWiseData[sheetName] = {
        stepsData: formatDataStepWise(XL_row_object),
        steps: XL_row_object.map((item, i) => `STEP ${i + 1}`),
      };
    });

    formatProjectStoreDataBeforePush(file, sheetWiseData, workbook.SheetNames);
    window.datastoreLoaded();
  };

  reader.onerror = function (ex) {
    console.log(ex);
  };

  reader.readAsBinaryString(file);
}

function formatProjectStoreDataBeforePush(file, sheetWiseData, monopiles) {
  const fileName = file.name.split(".")[0];

  const storeData = JSON.parse(localStorage.getItem("selectedProjectStore"));

  const projectData = {
    [fileName]: {
      monopiles,
      ...sheetWiseData,
    },
  };

  if (storeData) {
    setDataToStore(projectData, "selectedProjectStore", storeData);
  } else {
    setDataToStore(projectData, "selectedProjectStore");
  }
}

function formatDataStepWise(data) {
  return data.reduce(
    (acc, item, i) => ({ ...acc, [`STEP ${i + 1}`]: item }),
    {}
  );
}

function setProjectSelectionFilter(filterData) {
  const jsonPreviousData = localStorage.getItem("projectSelectionFilterData");

  const previousData = JSON.parse(jsonPreviousData);

  if (!previousData) {
    setDataToStore(filterData, "projectSelectionFilterData");
  } else {
    setDataToStore(filterData, "projectSelectionFilterData", previousData);
  }
}

function showHideRightPanel(){
    const element=document.getElementById('right-fields-result-sidebar');
    const className=element.getAttribute('class');
    if(className.includes('display-none')){
        element.classList.remove('display-none');
        element.classList.add('resize');
        element.classList.add('display-block');
    }else{
        element.classList.add('resize');
        element.classList.add('display-none');
        element.classList.remove('display-block');
    }
}

function toggelDiv(){
    let elementAsideBarRight=document.getElementById('AsideBarRight');
    let currentClassAsideBarRight=elementAsideBarRight.getAttribute('class');
    let elementContentWrapper=document.getElementById('ContentWrapper');
  
    if(currentClassAsideBarRight.includes('Active')){
        elementAsideBarRight.classList.add('AsideBarRight');
        elementAsideBarRight.classList.remove('Active');

        elementContentWrapper.classList.add('ChangeFlex');
         elementContentWrapper.classList.add('ToggleDiv');
        elementContentWrapper.classList.add('ContentWrapper');
    }else{
        elementAsideBarRight.classList.add('AsideBarRight');
        elementAsideBarRight.classList.add('Active');

        elementContentWrapper.classList.add('ToggleDiv');
        elementContentWrapper.classList.remove('ChangeFlex');
        elementContentWrapper.classList.add('ContentWrapper');
    }
  }