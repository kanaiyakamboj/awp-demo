import {
  set,
  get,
  clear,
  setMany,
  del,
  keys,
} from "https://unpkg.com/idb-keyval@5.0.2/dist/esm/index.js";

window.setDataToIndexedDB = (key, data) => {
  return new Promise((resolve, reject) => {
    try {
      set(key, data).then((res) => {
        resolve(true);
      });
    } catch (err) {
      reject(err);
    }
  });
};

window.setAllDataToIndexedDB = (entries) => {
  return new Promise((resolve, reject) => {
    try {
      setMany(entries).then((res) => {
        resolve(true);
      });
    } catch (err) {
      reject(err);
    }
  });
};

window.getDataFromIndexedDB = (key) => {
  const data = get(key);

  return data;
};

window.getAllStoreDataByKeys = async (keys) => {
  const result = await getAllKeysData(keys);

  return result;
};

window.deleteDataByKey = (key) => del(key);

window.clearIndexedDB = () => clear();

window.getAllIndexedDBKeys = () => keys();

async function getAllKeysData(keys) {
  let objectOfValues = {};

  return new Promise((resolve, reject) => {
    try {
      let counter=0;
      keys.forEach(async (key) => {
        const result = await getDataFromIndexedDB(key);
        counter=counter+1;
        const keysLength = result ? Object.keys(result).length : 0;

        objectOfValues = {
          ...objectOfValues,
          ...(keysLength > 0 ? { [key]: { ...result } } : undefined),
        };

        if (counter === keys.length) {
          resolve(objectOfValues);
        }
      });
    } catch (err) {
      reject(err);
    }
  });
}
