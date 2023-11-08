class LocalObjectStore {
  constructor() {
    loaclStore = {};
  }

  static addDataToStore(key, value) {
    this.loaclStore[key] = value;

    //add data to indexedDB
    setDataToIndexedDB(key, value);
  }

  static removeDataFromStore(key) {
    delete this.loaclStore[key];

    //remove data from indexedDB
    deleteDataByKey(key);
  }

  static getAllData() {
    return this.loaclStore;
  }

  static clearAllData() {
    return (this.loaclStore = {});
  }

  static getDataByKey(key) {
    if (this.loaclStore && this.loaclStore[key]) {
      return this.loaclStore[key];
    } else {
      return undefined;
      // throw Erro(`${key} does not exist in the store`);
    }
  }
}

if (window.performance.getEntriesByType) {
  if (window.performance.getEntriesByType("navigation")[0].type === "reload") {
    setTimeout(() => {
      synDataBackToLocalStoreOnPagerefresh();
    }, 300);
  }
}

async function synDataBackToLocalStoreOnPagerefresh() {
  // const keysToGetDataFor=["projectStoreGltfData","projectStoreXlsxData"];

  window.pageRefreshed = true;

  const keysForFilteredData = [
    "filtersData",
    "selectedTransportVasselData",
    "projectStoreXlsxData",
    "selectedMonopileData",
    "projectLastSyncData",
    "projectSelectionFilterData",
  ];

  const filteredDataAsObject = await getAllStoreDataByKeys(keysForFilteredData);

  //add data to local store after page refresh
  LocalObjectStore.loaclStore = {
    ...LocalObjectStore.loaclStore,
    ...filteredDataAsObject,
  };

  bindAllPanelsAsPerConfigSetup();
}

function formatIndexedDBData(dataFromIndexedDBAsArray) {
  return dataFromIndexedDBAsArray.reduce((acc, item) => {
    acc = { ...acc, ...item };

    return acc;
  }, {});
}
