let loadingFiles = new Set();

function removeAndCheck(name) {
  loadingFiles.delete(name);
  if (loadingFiles.size === 0) {
    document.getElementById("modalBackgroundDiv").hidden = true;
    datastoreLoaded();
  }
}
function setFilesNameDropDownptions(fileNames, element) {
  let strHtml = '<option value="">--Select option--</option>';

  if (element) {
    (fileNames || []).forEach((fileName) => {
      strHtml += `<option value=${fileName}>${fileName}</option>`;
    });

    element.innerHTML = strHtml;
  }
}

function bindControls(fileName) {
  const storeData = JSON.parse(localStorage.getItem("selectedProjectStore"));

  if (storeData.projectName) {
    const btnElement = document.getElementById("btn-import-file");

    if (btnElement) {
      btnElement.textContent = storeData.projectName;

      const pageTitle = document.getElementById("project-name");

      if (pageTitle) {
        pageTitle.textContent = storeData.projectName;
      }
    }
  }

  if (storeData.fileNames) {
    const selectOptionElement = document.getElementById("file-names");
    if (selectOptionElement) {
      setFilesNameDropDownptions(storeData.fileNames, selectOptionElement);
    }
  }

  if (fileName) {
    bindMonopilesDropdown(fileName);
  } else {
    const selectOptionElement = document.getElementById("sheet-names");

    if (selectOptionElement) {
      setFilesNameDropDownptions([], selectOptionElement);
    }
  }
}

function bindMonopilesDropdown(fileName) {
  const storeData = JSON.parse(localStorage.getItem("selectedProjectStore"));

  if (storeData && fileName) {
    const storedFileName = storeData[fileName];

    if (storedFileName) {
      const monopiles = storedFileName.monopiles;

      const selectOptionElement = document.getElementById("sheet-names");

      if (selectOptionElement) {
        setFilesNameDropDownptions(monopiles, selectOptionElement);
      }
    }
  }
}

function bindAllProjectSelectionFilterControlOnRefresh() {
  const lastSync = document.getElementById("last-sync");
  const btnElement = document.getElementById("btn-import-file");
  const selectFileNameOptionElement = document.getElementById("file-names");
  const selectSheetNameOptionElement = document.getElementById("sheet-names");

  const projectSelectionFilterData = JSON.parse(
    localStorage.getItem("projectSelectionFilterData")
  );

  const projectName = projectSelectionFilterData?.projectName;
  const fileName = projectSelectionFilterData?.fileName;

  if (projectName) {
    if (lastSync) {
      lastSync.textContent = projectSelectionFilterData?.lastSyncDate;
    }

    if (fileName) {
      bindControls(fileName);
    }

    if (btnElement) {
      btnElement.textContent = projectName;
    }
  }

  if (selectFileNameOptionElement && fileName) {
    selectFileNameOptionElement.value = fileName;
  }

  const monopileName = projectSelectionFilterData?.monopileName;

  if (selectSheetNameOptionElement && monopileName) {
    selectSheetNameOptionElement.value = monopileName;
  }

  bindLegend();
  bindAllPanelsAsPerConfigSetup();
  bindStepsDataToInstallPage();
  showInstallationSteps();
}

function onHtvDropdownChange(e) {
  const val = e.target.value;

  if (val) {
    const projectSelectionFilterData = JSON.parse(
      localStorage.getItem("projectSelectionFilterData")
    );

    if (projectSelectionFilterData) {
      setProjectSelectionFilter({
        ...projectSelectionFilterData,
        fileName: val,
      });
    }

    bindMonopilesDropdown(val);
  }
}

function onMonopileDropdownChange(e) {
  const val = e.target.value;

  if (val) {
    setProjectSelectionFilter({ monopileName: val });

    bindAllPanelsAsPerConfigSetup();

    getStepsDataForInstallPage(val);
  }
}

function getStepsDataForInstallPage(monopileName) {
  if (monopileName) {
    const storeData = JSON.parse(localStorage.getItem("selectedProjectStore"));

    const projectSelectionFilterData = JSON.parse(
      localStorage.getItem("projectSelectionFilterData")
    );

    const fileName = projectSelectionFilterData?.fileName;

      const defaultSelectedPaneldata=stepsDataForMonopile.stepsData["STEP_1"];
      
      setProjectSelectionFilter({
        steps: stepsDataForMonopile.steps,
        stepsData: stepsDataForMonopile.stepsData,
        currentStepKeyVal:defaultSelectedPaneldata,
        currentStepData: createPanelsDataToShow(defaultSelectedPaneldata),
        currentStepDataToForFilterPopup: createPanelsDataToShow(defaultSelectedPaneldata),
        currentStep:"STEP_1",
      });
      
    if (storeData && projectSelectionFilterData && fileName) {
      const selectedTransportVasselData = storeData[fileName];

      if (selectedTransportVasselData) {
        const stepsDataForMonopile = selectedTransportVasselData[monopileName];

        const stepsData = stepsDataForMonopile?.stepsData;

        if (stepsData) {
          const defaultSelectedPaneldata = stepsData["STEP_1"];

          setProjectSelectionFilter({
            steps: stepsDataForMonopile.steps,
            stepsData: stepsDataForMonopile.stepsData,
            currentStepKeyVal: defaultSelectedPaneldata,
            currentStepData: createPanelsDataToShow(defaultSelectedPaneldata),
            currentStepDataToForFilterPopup: createPanelsDataToShow(
              defaultSelectedPaneldata
            ),
            currentStep: "STEP_1",
          });

          bindStepsDataToInstallPage();

          showInstallationSteps();
        }
      }
    }
  }
}

function getFileName(filesName) {
  let fileName = "";
  let extension = "";

  const fileNameArray = filesName.split(".");

  if (fileNameArray.length === 2) {
    fileName = fileNameArray[0];
    extension = fileNameArray[1];
  }

  if (fileNameArray.length === 3) {
    fileName = `${fileNameArray[0]}.${fileNameArray[1]}`;
    extension = fileNameArray[2];
  }

  return [fileName, extension];
}

async function btnImportProjectClick(event) {
  const date = new Date().toLocaleDateString();
  const time = new Date().toLocaleTimeString();

  const modalBackgroundDiv = document.getElementById("modalBackgroundDiv");

  if (modalBackgroundDiv) {
    document.getElementById("modalBackgroundDiv").hidden = false;
  }

  const fileNames = [];

  localStorage.removeItem("selectedProjectStore");

  localStorage.removeItem("projectSelectionFilterData");

  var files = event.target.files;

  for (let i = 0; i < files.length; i++) {
    const [fileName, extension] = getFileName(files[i].name);

    if (extension === "xlsx") {
      await parseXlsx(files[i]);

      if (fileName.startsWith("BAR") || fileName.startsWith("HTV")) {
        fileNames.push(fileName);
      }
    }

    if (extension === "mex" || extension === "gltf") {
      if (extension === "gltf") {
        if (
          [
            "150333.00000-3D-THIALF-MAIN",
            "150450.27000-3D-320-01-1_full",
            "THIALF",
          ].includes(fileName)
        ) {
          const url = URL.createObjectURL(files[i]);
          loadingFiles.add(files[i].name);
          loadGLTF(fileName, url, (data) => {
            //formatProjectStoreDataBeforePush(files[i], data);
            //TODO: store somehow?
            removeAndCheck(files[i].name);
          });
        }
        //debugger
      } else {
        await parseMex(files[i]);
      }
    }
  }

  var relativePath = files[0].webkitRelativePath;

  var folder = relativePath.split("/")[0];

  const storeData = {
    projectName: folder,
    fileNames: fileNames,
  };

  localStorage.removeItem("projectSelectionFilterData");

  setProjectSelectionFilter({
    projectName: folder,
    lastSyncDate: `Last Sync on: ${date} at: ${time}`,
  });

  setDataToStore(storeData, "selectedProjectStore");

  bindControls();

  const lastSync = document.getElementById("last-sync");

  if (lastSync) {
    lastSync.textContent = `Last Sync on: ${date} at: ${time}`;
  }
}

function bindLegend() {
  const legendElement = document.getElementById("legend-section");
  const store = JSON.parse(localStorage.getItem("selectedProjectStore"));
  if (store) {
    const legendFieldLayoutData = store["Legend-FieldLayout"];

    if (legendFieldLayoutData) {
      const legendData = legendFieldLayoutData["Legend FieldLayout"];

      if (legendData && legendElement) {
        const legendDataArray = formateLegendData(legendData);

        let legendLiHtml = "";

        legendDataArray.forEach((legend) => {
          legendLiHtml += `<li><span style="background:${legend.ColorIcon}"></span>${legend.Title}</li>`;
        });

        legendElement.innerHTML = legendLiHtml;
      }
    }
  }

  function formateLegendData(legendData) {
    const steps = legendData?.steps;

    return (steps || []).map((step) => legendData.stepsData[step]);
  }
}

function setDataToStore(data, key, existedData) {
  let storeData;

  if (existedData && data) {
    storeData = { ...existedData, ...data };
  } else {
    storeData = data;
  }

  //add data to the store
  localStorage.setItem(key, JSON.stringify(storeData));
}

function parseMex(file) {
  loadingFiles.add(file.name);

  var reader = new FileReader();

  reader.onload = function (event) {
    var data = JSON.parse(event.target.result);

    formatProjectStoreDataBeforePush(file, data);
    loadingFiles.delete(file.name);
    if (loadingFiles.size === 0) datastoreLoaded();
  };

  reader.readAsText(file);
}

function parseXlsx(file) {
  loadingFiles.add(file.name);

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
        steps: XL_row_object.map((item, i) => `STEP_${i + 1}`),
      };
    });

    formatProjectStoreDataBeforePush(file, sheetWiseData, workbook.SheetNames);

    removeAndCheck(file.name);
  };

  reader.onerror = function (ex) {
    console.log(ex);
  };

  reader.readAsBinaryString(file);
}

function formatProjectStoreDataBeforePush(file, sheetWiseData, monopiles) {
  const fName = file.name;

  if (fName) {
    const [fileName] = getFileName(fName);

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
}

function formatDataStepWise(data) {
  return data.reduce(
    (acc, item, i) => ({ ...acc, [`STEP_${i + 1}`]: item }),
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

function showInstallationSteps() {
  const projectSelectionFilterData = JSON.parse(
    localStorage.getItem("projectSelectionFilterData")
  );

  if (
    projectSelectionFilterData &&
    projectSelectionFilterData.currentStepData
  ) {
    const panelOneInstallationSteps = document.getElementById(
      "panelOneInstallationSteps"
    );

    if (panelOneInstallationSteps) {
      removeClasses([panelOneInstallationSteps], "display-none");
    }
  }
}
