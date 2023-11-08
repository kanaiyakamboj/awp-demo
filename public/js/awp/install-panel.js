function bindStepsDataToInstallPage() {
  const dataFromLocalStoreBaseOnSelection = getCurrentSelectionData();

  if (dataFromLocalStoreBaseOnSelection) {
    const installationSteps = dataFromLocalStoreBaseOnSelection?.steps;
    const installationStepsTimes = dataFromLocalStoreBaseOnSelection?.times;
    const dateAndSubject = dataFromLocalStoreBaseOnSelection?.dateAndSubject;

    if (installationSteps && installationStepsTimes && dateAndSubject) {
      bindStepsToPanel(
        installationSteps,
        installationStepsTimes,
        dateAndSubject
      );
    }

    const currentStepData = dataFromLocalStoreBaseOnSelection?.currentStepData;

    if (currentStepData) {
      bindDataToAllPanel(currentStepData);
    }
  }
}

function bindStepsToPanel(steps, times, dateAndSubject) {
  const stepsWrapperProjectSelection = document.getElementById(
    "installationStepsExtra"
  );

  const stepsWrapperInstallationSteps =
    document.getElementById("installationSteps");

  let stepsLi = `<li data-testid="-1" class="MyInputBtnDateSubject">
  <span>${dateAndSubject?.date}</span>
      <button
        class="MyInputBtnDateSubject">
        ${dateAndSubject.subjectModel.split(".")[0]}
      </button>
    </li>`;
  // dateAndSubject:{date:XL_row_object[0]['Step_Data *Date'],subjectModel:XL_row_object[0]['Step_Data *SUBJECT Model']}

  steps.forEach(async (step, i) => {
    const stepFormated = step.replace("_", " ");
    const stepsTime = times[i];

    const stepData = getDataByStep(step);

    if (stepData) {
      const stepNotes = stepData["Step_Notes"];

      stepsLi += `<li data-testid="${step}" onclick="onStepClick('${step}')" class="MyInputBtn steps-buttons ${
        i === 0 ? "active" : ""
      }">
      <span>${stepsTime}</span>
      <span>${stepFormated}</span>
          <button
            class="MyInputBtn StepInstructionBtn"
            onclick="modalPopup('${stepNotes}')">
            <img src="../../assets/info-icon.svg" alt="" />
          </button>
        </li>`;
    }

    if (i === steps.length - 1) {
      if (stepsLi) {
        if (stepsWrapperInstallationSteps) {
          renderInstallationSteps(stepsLi, [stepsWrapperInstallationSteps]);
        }
        if (stepsWrapperProjectSelection) {
          renderInstallationSteps(stepsLi, [stepsWrapperProjectSelection]);
        }
      }
    }
  });
}

function modalPopup(stepsInstruction) {
  const stepsContent = document.getElementById("stepsContent");
  if (stepsContent && stepsInstruction) {
    stepsContent.textContent = stepsInstruction;
  }

  const instructionModel = document.getElementById("StepInstructionModalId");
  if (instructionModel) {
    instructionModel.classList.toggle("is-visible");
  }
}

function onStepClick(step) {
  const dataFromLocalStore = LocalObjectStore.getDataByKey("filtersData");

  if (dataFromLocalStore) {
    const selectedStepDataForFilters =
      dataFromLocalStore?.allStepsDataPanelGroupWise[step];

    const projectSelectionFilterData = LocalObjectStore.getDataByKey(
      "projectSelectionFilterData"
    );

    LocalObjectStore.addDataToStore("projectSelectionFilterData", {
      ...projectSelectionFilterData,
      currentStep: step,
    });

    const currentStepFilterData = dataFromLocalStore?.filteredColumns[step];

    const newFilteredStateState = {
      currentStep: step,
      currentStepData: selectedStepDataForFilters,
      filteredColumns: {
        ...dataFromLocalStore?.filteredColumns,
        [step]: currentStepFilterData ? currentStepFilterData : new Set(),
      },
    };

    let localStoreObjectForFilters = {};

    if (dataFromLocalStore) {
      localStoreObjectForFilters = {
        ...dataFromLocalStore,
        ...newFilteredStateState,
      };
    }

    LocalObjectStore.addDataToStore("filtersData", localStoreObjectForFilters);

    bindDataToAllPanel(selectedStepDataForFilters);

    addClassActiveToSteps(step);
  }
}

function addClassActiveToSteps(step) {
  let stepElements = document.querySelectorAll(".steps-buttons");

  if (stepElements) {
    removeClasses(stepElements, "active");
  }

  let currentStepElements = document.querySelectorAll(`[data-testid=${step}]`);

  if (currentStepElements) {
    (currentStepElements || []).forEach((currentStepElement) => {
      currentStepElement.classList.add("active");
    });
  }
}

function getDataByStep(step, type) {
  const dataFromLocalStoreBaseOnSelection = getCurrentSelectionData();

  let selectedStepData = {};

  if (dataFromLocalStoreBaseOnSelection) {
    const installationStepsData = dataFromLocalStoreBaseOnSelection?.stepsData;
    const stepsDataToWorkForFilters =
      dataFromLocalStoreBaseOnSelection?.stepsDataToWorkForFilters;

    if (installationStepsData && stepsDataToWorkForFilters) {
      if (type === "stepForFilters") {
        selectedStepData = stepsDataToWorkForFilters[step];
      } else {
        selectedStepData = installationStepsData[step];
      }
    }
  }

  return selectedStepData;
}

function createPanelsDataToShow(selectedStepData) {
  const monopileName = getCurrentSelectionKey().split("_")[1];
  const possiblePannelGroups = getAllPosiblePanelGoupps();

  const panelsDataStructure = {};

  possiblePannelGroups.forEach((panelGroup) => {
    panelsDataStructure[panelGroup] = {};

    if (panelGroup === "Eng_Data") {
      panelsDataStructure[panelGroup]["Location"] = monopileName;
    }
  });

  for (let [key, val] of Object.entries(selectedStepData)) {
    const objKeyValArr = key.split("*");

    const groupName = objKeyValArr[0].trim();

    const objKey = objKeyValArr[1];

    if (panelsDataStructure[groupName]) {
      panelsDataStructure[groupName][objKey] = val;
    }
  }

  return panelsDataStructure;
}

function renderInstallationSteps(steps, elements) {
  const stepsTemplate = `
    <ul class="progress-steps">
    ${steps}
    </ul>`;

  if (stepsTemplate) {
    (elements || []).forEach((element) => {
      if (element) {
        element.innerHTML = stepsTemplate;
      }
    });
  }
}

function bindDataToAllPanel(panelsData) {
  if (panelsData) {
    const allPanelGroups = Object.keys(panelsData);

    const dataFromLocalStore = LocalObjectStore.getDataByKey("filtersData");

    const currentStep = dataFromLocalStore.currentStep;

    const filteredColumnsCurrentStep =
      dataFromLocalStore?.filteredColumns[currentStep];

    allPanelGroups.forEach((panelGroup) => {
      const panelName = document.getElementById(panelGroup);
      const panelData = panelsData[panelGroup];

      if (panelName && panelData) {
        bindDataToPanels(panelName, panelData, filteredColumnsCurrentStep);
      }
    });
  }
}

function bindDataToPanels(panel, panelsData, filteredColumnsCurrentStep) {
  let panelHtml = "";

  if (panel && panelsData) {
    Object.entries(panelsData).forEach(([title, value]) => {
      if (!filteredColumnsCurrentStep.has(title)) {
        panelHtml += `<div class="ValueView">
        <span>${title}</span>
        <h4>${value}</h4>
      </div>`;
      }
    });

    panel.innerHTML = panelHtml;
  }
}

function bindAllDataPanelsValuesToPopup(panelGroupId) {
  const modelPopupDataPanelFields = document.getElementById("dataPanelFields");

  const dataFromLocalStoreBaseOnSelection = getCurrentSelectionData();

  const currentStepData = dataFromLocalStoreBaseOnSelection?.currentStepData;

  if (modelPopupDataPanelFields) {
    if (dataFromLocalStoreBaseOnSelection) {
      let dataPanelHtml = "";

      const currentStep = dataFromLocalStoreBaseOnSelection.currentStep;

      const currentStepDataFilterColumns =
        dataFromLocalStoreBaseOnSelection?.filteredColumns[currentStep];

      const currentStepKeyValData = currentStepData[panelGroupId];

      let checked = "";

      if (currentStepKeyValData) {
        Object.entries(currentStepKeyValData).forEach(([key, val], index) => {
          const checkboxValue = `${key},${val}`;

          if (!currentStepDataFilterColumns.has(key)) {
            checked = "checked";
          } else {
            checked = "";
          }

          dataPanelHtml += `<li>
      <input class="styled-checkbox" ${checked} data-testid='${val}' id="styled-checkbox-${index}" type="checkbox" value="${checkboxValue}">
      <label for="styled-checkbox-${index}">${key}</label>
  </li>`;
        });

        modelPopupDataPanelFields.innerHTML = `<ul class="filter-checklist">
  ${dataPanelHtml}
  </ul>
  <button class="MyBtn OrangeBtn W100 JustifyCenter" onclick="onClickDataPanelFilterApply('${currentStep}','${panelGroupId}')">Apply Now</button>`;
      }
    }
  }
}

function bindAllPanelsAsPerConfigSetup() {
  return new Promise((resolve, reject) => {
    try {
      const store = LocalObjectStore.getDataByKey("projectStoreXlsxData");
      if (store) {
        const storePannelConfig = store["pannel-group-config"];

        const configData = storePannelConfig?.pannelsConfigData;

        if (configData) {
          bindAllPannelsByConfig(configData);
          resolve(true);
        } else {
          fetch("../pannel-group-config.json")
            .then((response) => response.json())
            .then((pannelsConfig) => {
              const configData = pannelsConfig.pannelsConfigData;

              if (configData) {
                bindAllPannelsByConfig(configData);
                resolve(true);
              }
            });
        }
      } else {
        fetch("../pannel-group-config.json")
          .then((response) => response.json())
          .then((pannelsConfig) => {
            const configData = pannelsConfig.pannelsConfigData;

            if (configData) {
              bindAllPannelsByConfig(configData);
              resolve(true);
            }
          });
      }
    } catch (e) {
      reject(false);
    }
  });
}

function bindAllPannelsByConfig(configData) {
  setPanelsAsPerConfigs(configData);

  bindAllTemplatesToPanels();
}

function bindAllTemplatesToPanels() {
  bindProjectMap();
  bindProjectSelectionSection();
  bindStepsDataToInstallPage();
}

function onClickDataPanelFilterApply(step, panelGroupId) {
  const checkboxElements = document.getElementsByClassName("styled-checkbox");

  const dataFromLocalStore = LocalObjectStore.getDataByKey("filtersData");

  const filteredColumnsCurrentStep = dataFromLocalStore?.filteredColumns[step]
    ? dataFromLocalStore?.filteredColumns[step]
    : new Set();

  const currentStepData = dataFromLocalStore.currentStepData;

  const panelGroupColumns = currentStepData[panelGroupId];

  for (let [key, _] of Object.entries(panelGroupColumns)) {
    if (filteredColumnsCurrentStep.has(key)) {
      filteredColumnsCurrentStep.delete(key);
    }
  }

  [...checkboxElements].forEach((checbox) => {
    if (!checbox.checked) {
      const [key, _] = checbox.value.split(",");

      filteredColumnsCurrentStep.add(key);
    }
  });

  if (dataFromLocalStore) {
    const localStoreObjectForFilters = {
      ...dataFromLocalStore,
      filteredColumns: {
        ...dataFromLocalStore.filteredColumns,
        [step]: filteredColumnsCurrentStep,
      },
    };

    LocalObjectStore.addDataToStore("filtersData", localStoreObjectForFilters);

    if (currentStepData) {
      const panel = document.getElementById(panelGroupId);
      bindDataToPanels(
        panel,
        currentStepData[panelGroupId],
        filteredColumnsCurrentStep
      );
    }

    hideShowFilterPopup();
  }
}

function getCurrentSelectionKey() {
  //read data from local store
  const selectedTransportVasselData = LocalObjectStore.getDataByKey(
    "selectedTransportVasselData"
  );
  const selectedMonopileData = LocalObjectStore.getDataByKey(
    "selectedMonopileData"
  );

  const htvName = selectedTransportVasselData?.fileName;
  const monopileName = selectedMonopileData?.monopileName;

  const currentSelectionKey = `${htvName}_${monopileName}`;

  return currentSelectionKey;
}

function getCurrentSelectionData() {
  const dataFromLocalStore = LocalObjectStore.getDataByKey("filtersData");

  if (dataFromLocalStore) {
    const selectedTransportVasselData = LocalObjectStore.getDataByKey(
      "selectedTransportVasselData"
    );
    const selectedMonopileData = LocalObjectStore.getDataByKey(
      "selectedMonopileData"
    );

    const currentStoreData = dataFromLocalStore;

    if (currentStoreData) {
      currentStoreData.fileName = selectedTransportVasselData.fileName;
      currentStoreData.monopileName = selectedMonopileData.monopileName;
    }

    return currentStoreData;
  }

  return null;
}

function getAllPosiblePanelGoupps() {
  const store = LocalObjectStore.getDataByKey("projectStoreXlsxData");

  const possibleGroups = new Set();

  if (store) {
    const panel_Groups_Data = store?.panel_Groups_Data;

    if (panel_Groups_Data) {
      let allFields = {};

      for (let [key, val] of Object.entries(panel_Groups_Data)) {
        if (key !== "monopiles" && key !== "monoHtvMap") {
          allFields = val?.stepsData?.STEP_1;
          break;
        }
      }

      if (allFields) {
        const allColumns = Object.keys(allFields);

        allColumns.forEach((column) => {
          if (column.includes("*")) {
            const panelGroupName = column.split("*")[0].trim();

            if (panelGroupName !== "Step_Notes") {
              possibleGroups.add(panelGroupName);
            }
          }
        });
      }
    }
  }

  return possibleGroups;
}
