function setFilesNameDropDownptions(fileNames, element, type) {
  let strHtml = "";
  if (type === "htv") {
    strHtml = "<option value='All'>All</option>";
  }

  if (element) {
    (fileNames || []).forEach((fileName) => {
      strHtml += `<option value=${fileName}>${fileName}</option>`;
    });

    element.innerHTML = strHtml;
  }
}

function bindControls(fileName, pageRefresh) {
  const storeData = LocalObjectStore.getDataByKey("projectLastSyncData");

  if (storeData?.projectName) {
    const pageTitle = document.getElementById("project-name");

    if (pageTitle) {
      pageTitle.textContent = storeData.projectName;
    }
  }

  if (storeData?.fileNames) {
    const selectOptionElement = document.getElementById("file-names");
    if (selectOptionElement) {
      setFilesNameDropDownptions(
        storeData.fileNames,
        selectOptionElement,
        "htv"
      );
    }
  }

  if (fileName === "All") {
    bindMonopilesDropdownAllLocation(fileName, pageRefresh);
  } else {
    if (fileName) {
      bindMonopilesDropdown(fileName, pageRefresh);
    } else {
      const htvName = storeData.fileNames[0];
      if (htvName) {
        bindMonopilesDropdown(htvName, pageRefresh);
      }
    }
  }
}

function bindMonopilesDropdownAllLocation(fileName, pageRefresh) {
  const storeData = LocalObjectStore.getDataByKey("projectStoreXlsxData");

  const monopiles = storeData["allMonopiles"];

  const htvName = storeData.fileNames[0];

  const monopileName = monopiles[0];

  if (monopileName) {
    if (!pageRefresh) {
      //add data to local store
      LocalObjectStore.addDataToStore("selectedTransportVasselData", {
        fileName: htvName,
      });

      setProjectSelectionFilter({
        fileName,
      });

      //add data to local store
      LocalObjectStore.addDataToStore("selectedMonopileData", {
        monopileName,
      });
    }
    setProjectSelectionFilter({ monopileName });

    setDefaultDataToStore(monopileName, "htvAll", pageRefresh);
  }

  const selectOptionElement = document.getElementById("sheet-names");

  if (selectOptionElement) {
    setFilesNameDropDownptions(monopiles, selectOptionElement, "monopiles");
  }
}

function bindMonopilesDropdown(fileName, pageRefresh) {
  const storeData = LocalObjectStore.getDataByKey("projectStoreXlsxData");

  if (storeData && fileName) {
    const storedFileName = storeData[fileName];

    if (storedFileName) {
      const monopiles = storedFileName.monopiles;

      const monopileName = monopiles[0];

      if (monopileName) {
        if (!pageRefresh) {
          //add data to local store
          LocalObjectStore.addDataToStore("selectedTransportVasselData", {
            fileName,
          });

          setProjectSelectionFilter({
            fileName,
          });

          //add data to local store
          LocalObjectStore.addDataToStore("selectedMonopileData", {
            monopileName,
          });
        }

        setProjectSelectionFilter({ monopileName });

        setDefaultDataToStore(monopileName, "", pageRefresh);
      }

      const selectOptionElement = document.getElementById("sheet-names");

      if (selectOptionElement) {
        setFilesNameDropDownptions(monopiles, selectOptionElement, "monopiles");

        document.getElementById("template-name").innerHTML =
          selectOptionElement.value;
      }
    }
  }
}

function bindAllProjectSelectionFilterControlOnRefresh() {
  const lastSync = document.getElementById("last-sync");
  const selectFileNameOptionElement = document.getElementById("file-names");
  const selectSheetNameOptionElement = document.getElementById("sheet-names");
  const templateName = document.getElementById("template-name");

  const storeData = LocalObjectStore.getDataByKey("projectLastSyncData");

  const selectedTransportVasselData = LocalObjectStore.getDataByKey(
    "selectedTransportVasselData"
  );

  const selectedMonopileData = LocalObjectStore.getDataByKey(
    "selectedMonopileData"
  );

  const projectName = storeData?.projectName;

  const fileName = selectedTransportVasselData?.fileName;

  const lastSyncDate = storeData?.lastSyncDate;

  if (lastSyncDate && projectName) {
    if (lastSync) {
      lastSync.textContent = lastSyncDate;
    }

    if (fileName) {
      bindControls(fileName, "pageRefresh");
    }
  }

  if (selectFileNameOptionElement && fileName) {
    selectFileNameOptionElement.value = fileName;
  }

  const monopileName = selectedMonopileData?.monopileName;

  if (selectSheetNameOptionElement && monopileName) {
    selectSheetNameOptionElement.value = monopileName;
  }

  if (templateName && monopileName) {
    templateName.innerHTML = monopileName;
  }

  bindLegend();
  showInstallationSteps();

  const dataFromLocalStore = LocalObjectStore.getDataByKey("filtersData");

  if (dataFromLocalStore) {
    addClassActiveToSteps(dataFromLocalStore.currentStep);
  }
}

function onHtvDropdownChange(e) {
  const val = e.target.value;

  if (val) {
    //add data to local store
    LocalObjectStore.addDataToStore("selectedTransportVasselData", {
      fileName: val,
    });

    setProjectSelectionFilter({
      fileName: val,
    });

    if (val === "All") {
      bindMonopilesDropdownAllLocation(val);
    } else {
      bindMonopilesDropdown(val);
    }
  }
}

function onMonopileDropdownChange(e) {
  const val = e.target.value;

  if (val) {
    //add data to local store
    LocalObjectStore.addDataToStore("selectedMonopileData", {
      monopileName: val,
    });

    const htvName = getMonoToHtv(val);

    LocalObjectStore.addDataToStore("selectedTransportVasselData", {
      fileName: htvName,
    });

    const selectFileNameOptionElement = document.getElementById("file-names");

    if (selectFileNameOptionElement) {
      selectFileNameOptionElement.value = htvName;
    }

    document.getElementById("template-name").innerHTML = val;

    setProjectSelectionFilter({ monopileName: val });

    setDefaultDataToStore(val);
  }
}

function setDefaultDataToStore(monopileName, htvAll, pageRefresh) {
  if (monopileName) {
    const storeData = LocalObjectStore.getDataByKey("projectStoreXlsxData");

    const selectedTransportVassel = LocalObjectStore.getDataByKey(
      "selectedTransportVasselData"
    );

    const fileName = selectedTransportVassel?.fileName;

    if (storeData && selectedTransportVassel && fileName) {
      const selectedTransportVasselData = storeData[fileName];

      if (selectedTransportVasselData) {
        const stepsDataForMonopile = selectedTransportVasselData[monopileName];

        const stepsData = stepsDataForMonopile?.stepsData;

        if (stepsData) {
          const stepsFormattedDataByPanels = getStepsFormatedDataByPanels(
            stepsDataForMonopile.steps,
            stepsData
          );

          const dataFromLocalStore =
            LocalObjectStore.getDataByKey("filtersData");

          if (!pageRefresh) {
            //This is for 3dModels use only
            const projectSelectionFilterData = {
              fileName,
              monopileName,
              stepsData: stepsData,
              currentStep: "STEP_1",
            };

            LocalObjectStore.addDataToStore(
              "projectSelectionFilterData",
              projectSelectionFilterData
            );
          }

          let dataToStore = dataFromLocalStore;

          if (!dataFromLocalStore || !pageRefresh) {
            dataToStore = {
              steps: stepsDataForMonopile?.steps,
              times: stepsDataForMonopile?.times,
              dateAndSubject: stepsDataForMonopile?.dateAndSubject,
              stepsData: stepsData,
              currentStepData: stepsFormattedDataByPanels["STEP_1"],
              allStepsDataPanelGroupWise: stepsFormattedDataByPanels,
              currentStep: "STEP_1",
              filteredColumns: dataFromLocalStore?.filteredColumns
                ? dataFromLocalStore?.filteredColumns
                : { STEP_1: new Set() },
            };
            LocalObjectStore.addDataToStore("filtersData", {
              ...dataToStore,
            });
          } else {
            const filteredColumns = dataFromLocalStore?.filteredColumns
              ? dataFromLocalStore?.filteredColumns
              : { STEP_1: new Set() };

            LocalObjectStore.addDataToStore("filtersData", {
              ...dataToStore,
              filteredColumns,
            });
          }
        }
      }
    }
  }

  bindStepsDataToInstallPage();

  showInstallationSteps();
}

function getStepsFormatedDataByPanels(steps, stepsData) {
  const stepsDataObject = {};

  steps.forEach((step) => {
    stepsDataObject[step] = createPanelsDataToShow(stepsData[step]);
  });

  return stepsDataObject;
}

function getFileName(filesName) {
  const fileNameArray = filesName.split(".");

  const extension = fileNameArray.pop();
  const fileName = fileNameArray.join(".");

  return [fileName, extension];
}

function bindDataForPannelGroupSetting(xlsxData) {
  for (let [key, val] of Object.entries(xlsxData)) {
    if (key.startsWith("HTV")) {
      return val;
    }
  }
}

loadParsed = (filesByExt, folder, fileNames, date, time, start, res) => {
  const [xlsxData, mexData, gltfData] = res;

  xlsxData["panel_Groups_Data"] = bindDataForPannelGroupSetting(xlsxData);

  function sortFiles(fileNames) {
    const sortedFiles = fileNames.sort((a, b) => {
      const fileArrA = a.split("-");
      const lastElementA = parseInt(fileArrA[fileArrA.length - 1]);
      const fileArrB = b.split("-");
      const lastElementB = parseInt(fileArrB[fileArrB.length - 1]);

      return lastElementA - lastElementB;
    });

    return sortedFiles;
  }

  const sortedFiles = sortFiles(fileNames);
  const modalBackgroundDiv = document.getElementById("modalBackgroundDiv");
  const textarea = document.getElementById("modalBackgroundT");
  const statustext = document.getElementById("modalBackgroundP");
  const projectLastSyncData = {
    projectName: folder,
    lastSyncDate: `Last Sync on: ${date} at: ${time}`,
    fileNames: sortedFiles,
  };

  LocalObjectStore.addDataToStore("projectLastSyncData", projectLastSyncData);

  const storeObject = {
    fileNames: sortedFiles,
    ...xlsxData,
  };

  const xlsxMexData = {
    ...storeObject,
    ...mexData,
  };

  /*
  const entriesForIndexedDB = [
    ["projectStoreXlsxData", storeObject],
    ["projectStoreMexData", mexData],
    ["projectStoreGltfData", gltfData],
  ];
*/

  //add data to local store
  LocalObjectStore.addDataToStore("projectStoreXlsxData", xlsxMexData);

  const entriesForIndexedDB = [
    ["projectStoreXlsxData", xlsxMexData],
    ["projectStoreGltfData", gltfData],
    ["projectLastSyncData", projectLastSyncData],
  ];

  const timeNow = new Date();
  const diff = timeNow - start;

  if (DataValidator.validate(xlsxMexData)) {
    clearIndexedDB();
    localStorage.removeItem("projectSelectionFilterData");
    setAllDataToIndexedDB(entriesForIndexedDB).then(async (res) => {
      textarea.value += "Total new load time:\t" + diff + " ms\n";
      statustext.innerText = "Loaded Successfully. Click here to continue";
      statustext.style.color = "green";
      localStorage.removeItem("projectSelectionFilterData");

      console.log("time took in parsing: ", diff);

      const result = await bindAllPanelsAsPerConfigSetup();

      loadCanvas();

      bindControls("All");

      const lastSync = document.getElementById("last-sync");

      if (lastSync) {
        lastSync.textContent = `Last Sync on: ${date} at: ${time}`;
      }
      textarea.value += "Data Valid";
      datastoreLoaded(xlsxMexData);
    });
  } else {
    console.log(DataValidator.errorObj);
    statustext.innerText = "Failed to Load. Click here to continue";
    statustext.style.color = "red";
  }
  statustext.onclick = () => {
    modalBackgroundDiv.hidden = true;
  };
  for (let i = 0; i < DataValidator.log.length; i++) {
    textarea.value += DataValidator.log[i] + "\n";
  }
};

function zipFileParsed(fileName, objMap, start) {
  // TODO: Put the parsed zip objMap into memory.
  // const args = { filesByExt, folder, fileNames, date, time, start: new Date() };
  //
  // parseDataAndStoreToIndexedDb(args);
  LocalObjectStore.clearAllData();
  const date = new Date().toLocaleDateString();
  const time = new Date().toLocaleTimeString();

  let fileNames = Object.keys(objMap.xlsx).filter(
    (x) => x.startsWith("HTV") || x.startsWith("BAR")
  );
  loadParsed(null, fileName, fileNames, date, time, start, [
    objMap.xlsx,
    { ...objMap.mex, ...objMap.json },
    objMap.gltf,
  ]);

  // const statustext = document.getElementById("modalBackgroundP");
  // const modalBackgroundDiv = document.getElementById("modalBackgroundDiv");
  // statustext.onclick = () => {
  //   modalBackgroundDiv.hidden = true;
  // };
  // statustext.innerText =
  //   "Loading from ZIP successful. TODO: Put the parsed zip objMap into memory";
  // statustext.style.color = "orange";
}

function btnImportProjectClickZip(event) {
  const modalBackgroundDiv = document.getElementById("modalBackgroundDiv");
  const textarea = document.getElementById("modalBackgroundT");
  const statustext = document.getElementById("modalBackgroundP");
  const start = new Date();
  if (modalBackgroundDiv) {
    modalBackgroundDiv.hidden = false;
    statustext.innerText = "Loading from ZIP..";
    statustext.style.color = "white";
    textarea.value = "";
    statustext.onclick = () => {};
  }

  const file = event.target.files[0];
  textarea.value += file.name + " File selected \n";
  if (file.name.split(".").pop().toLowerCase() !== "zip") {
    textarea.value += file.name + " not a zip file, aborting \n";
    statustext.innerText = "Failed to Load from ZIP. Click here to continue";
    statustext.style.color = "red";
    statustext.onclick = () => {
      modalBackgroundDiv.hidden = true;
    };
    return;
  }
  textarea.value += file.name + " is a zip file, reading file... \n";
  let reader = new FileReader();
  reader.onload = function (e) {
    textarea.value += file.name + " successfully read, decompressing... \n";
    let content = e.target.result;
    const new_zip = new JSZip();
    new_zip.load(content);
    let objMap = {
      xlsx: {
        allMonopiles: new Set(),
        monoToHTVMapping: {},
      },
      mex: {},
      json: {},
      gltf: {},
    };
    textarea.value += file.name + " successfully decompressed, parsing... \n";

    for (const [key, value] of Object.entries(new_zip.files)) {
      const fileArr = key.split("/").pop().split(".");
      let ext = fileArr.pop();
      const name = fileArr.pop();
      if (ext === "xlsm") ext = "xlsx";
      if (ext === "xlsx") {
        const fileData = parseXlsxFromData(value.asBinary(), name);

        objMap[ext][name] = fileData;

        if (!name.startsWith("Deck") && !name.startsWith("Legend")) {
          objMap[ext].allMonopiles = [
            ...objMap[ext].allMonopiles,
            ...fileData?.monopiles,
          ];

          objMap[ext].monoToHTVMapping = {
            ...objMap[ext].monoToHTVMapping,
            ...fileData.monoHtvMap,
          };
        }

        textarea.value += name + " Parsed \n";
      }
      if (ext === "mex" || ext === "json") {
        objMap[ext][name] = JSON.parse(value.asText());
        textarea.value += name + " Parsed \n";
      }
    }
    let parsingNumber = 0;
    for (const [key, value] of Object.entries(new_zip.files)) {
      const fileArr = key.split("/").pop().split(".");
      let ext = fileArr.pop();
      const name = fileArr.join(".");
      if (ext === "gltf") {
        parsingNumber++;
        textarea.value += name + " Parsing \n";
        parseGLTFData(value.asBinary(), (obj) => {
          objMap[ext][name] = obj;
          textarea.value += name + " Parsed \n";
          parsingNumber--;
          if (parsingNumber == 0) {
            textarea.value += "Parsing Complete\n";
            zipFileParsed(file.name, objMap, start);
          }
        });
      }
    }
  };
  reader.readAsArrayBuffer(file);
  event.target.value = "";
}

function btnImportProjectClick(event) {
  const date = new Date().toLocaleDateString();
  const time = new Date().toLocaleTimeString();

  const filesByExt = {};

  const fileNames = [];

  const files = event.target.files;

  const relativePath = files[0].webkitRelativePath;

  const folder = relativePath.split("/")[0];

  for (let i = 0; i < files.length; i++) {
    let [fileName, extension] = getFileName(files[i].name);
    if (extension === "xlsm") extension = "xlsx";
    if (extension === "json") extension = "mex";
    if (extension === "gltf") {
      const fileUrl = URL.createObjectURL(files[i]);

      const fileNameUrlObject = {
        fileName,
        fileUrl,
      };
      if (!filesByExt[extension]) {
        filesByExt[extension] = [];
      }

      filesByExt[extension].push(fileNameUrlObject);
    } else if (extension === "xlsx" || extension === "mex") {
      if (extension === "xlsx") {
        if (fileName.startsWith("BAR") || fileName.startsWith("HTV")) {
          fileNames.push(fileName);
        }
      }

      if (!filesByExt[extension]) {
        filesByExt[extension] = [];
      }

      filesByExt[extension].push(files[i]);
    }
  }

  const args = { filesByExt, folder, fileNames, date, time, start: new Date() };

  //clear the cache so next time same name directory can be picked again without refresh
  event.target.value = "";

  parseDataAndStoreToIndexedDb(args);
}

function parseDataAndStoreToIndexedDb({
  filesByExt,
  folder,
  fileNames,
  date,
  time,
  start,
}) {
  const xlsxFiles = filesByExt["xlsx"];
  const mexFiles = filesByExt["mex"];
  const gltfFiles = filesByExt["gltf"];

  LocalObjectStore.clearAllData();

  const modalBackgroundDiv = document.getElementById("modalBackgroundDiv");
  const textarea = document.getElementById("modalBackgroundT");
  const statustext = document.getElementById("modalBackgroundP");

  if (modalBackgroundDiv) {
    modalBackgroundDiv.hidden = false;
    statustext.innerText = "Loading..";
    statustext.style.color = "white";
    textarea.value = "";
    statustext.onclick = () => {};
  }

  const promiseXlsx = parseXlsx(xlsxFiles);
  const promiseMex = parseMex(mexFiles);
  const promiseGltf = loadGLTFPromise(gltfFiles);

  Promise.all([promiseXlsx, promiseMex, promiseGltf])
    .then((res) =>
      loadParsed(filesByExt, folder, fileNames, date, time, start, res)
    )
    .catch((err) => {
      console.log("error in parsing: ", err);
    });
}

function bindLegend() {
  const legendElement = document.getElementById("legend-section");
  const store = LocalObjectStore.getDataByKey("projectStoreXlsxData");

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

    return (steps || []).map((step) =>legendData.stepsData[step]);
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

function parseMex(files) {
  const projectMexData = {};

  return new Promise((resolve, reject) => {
    try {
      files.forEach((file, index) => {
        var reader = new FileReader();

        reader.onload = function (event) {
          var data = JSON.parse(event.target.result);

          const [fileName] = getFileName(file.name);

          projectMexData[fileName] = {
            ...data,
          };

          if (index === files.length - 1) {
            resolve(projectMexData);
          }
        };

        reader.readAsText(file);
      });
    } catch (err) {
      reject(err);
    }
  });
}

function parseXlsxFromData(data, fileName) {
  const sheetWiseData = {};
  const monoHtvMap = {};
  const monopilesArr = [];
  const workbook = XLSX.read(data, {
    type: "binary",
  });

  workbook.SheetNames.forEach(function (sheetName) {
    const XL_row_object = XLSX.utils.sheet_to_row_object_array(
      workbook.Sheets[sheetName]
    );

    if (sheetName.includes("-")) {
      monopilesArr.push(sheetName);
    }

    monoHtvMap[sheetName] = fileName;

    sheetWiseData[sheetName] = {
      stepsData: formatDataStepWise(XL_row_object),
      steps: XL_row_object.map((item, i) => `STEP_${i + 1}`),
      times: XL_row_object.map((item, i) => `${item["Step_Data *Time"]}`),
      dateAndSubject: {
        date: XL_row_object[0]["Step_Data *Date"],
        subjectModel: XL_row_object[0]["Step_Data *SUBJECT Model"],
      },
    };
  });

  const monopiles = monopilesArr;

  return {
    monoHtvMap,
    monopiles,
    ...sheetWiseData,
  };
}

function sortMonopiles(fileNames) {
  const sortedFiles = fileNames.sort((a, b) => {
    const fileA = a.split("-")[1];
    const elementA = fileA.charAt(0);
    const fileArrB = b.split("-")[1];
    const elementB = fileArrB.charAt(0);

    if (elementA < elementB) {
      return -1;
    }

    if (elementA > elementB) {
      return 1;
    }
  });

  return sortedFiles;
}

function parseXlsx(files) {
  const projectXlsxData = { allMonopiles: new Set(), monoToHTVMapping: {} };
  return new Promise((resolve, reject) => {
    try {
      files.forEach((file, index) => {
        const reader = new FileReader();

        reader.onload = function (e) {
          const data = e.target.result;

          const [fileName] = getFileName(file.name);

          const xlsxParsedData = parseXlsxFromData(data, fileName);

          projectXlsxData[fileName] = xlsxParsedData;

          if (!fileName.startsWith("Deck") && !fileName.startsWith("Legend")) {
            projectXlsxData.allMonopiles = [
              ...projectXlsxData.allMonopiles,
              ...xlsxParsedData?.monopiles,
            ];

            projectXlsxData.monoToHTVMapping = {
              ...projectXlsxData.monoToHTVMapping,
              ...xlsxParsedData.monoHtvMap,
            };
          }
          if (index === files.length - 1) {
            projectXlsxData.allMonopiles = sortMonopiles(
              projectXlsxData.allMonopiles
            );

            resolve(projectXlsxData);
          }
        };

        reader.onerror = function (ex) {
          reject(ex);
          console.log(ex);
        };

        reader.readAsBinaryString(file);
      });
    } catch (err) {
      reject(err);
    }
  });
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
  const dataFromLocalStoreBaseOnSelection = getCurrentSelectionData();

  if (
    dataFromLocalStoreBaseOnSelection &&
    dataFromLocalStoreBaseOnSelection.currentStepData
  ) {
    const panelOneInstallationSteps = document.getElementById(
      "panelOneInstallationSteps"
    );

    if (panelOneInstallationSteps) {
      removeClasses([panelOneInstallationSteps], "display-none");
    }
  }
}

function getMonoToHtv(monopile) {
  const storeData = LocalObjectStore.getDataByKey("projectStoreXlsxData");

  const monoToHTVMap = storeData["monoToHTVMapping"];

  return monoToHTVMap[monopile];
}
