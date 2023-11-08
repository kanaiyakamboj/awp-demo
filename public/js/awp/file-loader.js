class FileLoader{
    static getFileName(filesName) {
        const fileNameArray = filesName.split(".");
        const ext = fileNameArray.pop();
        const  name = fileNameArray.join('.');
        return [name, ext];
    }

    static loadStoreDataFiles(files, dataStoreLoadedDelegate) {
        const loadingFiles = new Set();
        const relativePath = files[0].webkitRelativePath;

        const folder = relativePath.split("/")[0];

        const storeData = {
            projectName: folder,
            fileNames:[],
            loadTimes: {}
        };
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const [fileName, extension] = FileLoader.getFileName(file.name);
            if (extension === 'mex') {
                FileLoader.loadMex(file, storeData, loadingFiles, dataStoreLoadedDelegate);
            }
            if (extension === "xlsx") {
                FileLoader.loadTransport(file, storeData, loadingFiles, dataStoreLoadedDelegate);
            }
            if (extension === "gltf" ) {
                FileLoader.loadModel(file, storeData, loadingFiles, dataStoreLoadedDelegate);
            }
        }
    }
    static loadFile(file, storeData){

    }

    static loadJSON(file, delegate){
        const reader = new FileReader();
        reader.onload = function (event) {
            delegate(JSON.parse(event.target.result));
        };
        reader.readAsText(file);
    }

    static loadModel(file, storeData, loadingFiles, dataStoreLoadedDelegate){
        const startTime = Date.now();
        loadingFiles.add(file.name);
        const [fileName, extension] = FileLoader.getFileName(file.name);
        loadGLTF(fileName, URL.createObjectURL(file), (data) => {
            loadingFiles.delete(file.name);
            storeData.loadTimes[file.name] = Date.now()-startTime;
            if (loadingFiles.size === 0) {
                dataStoreLoadedDelegate(storeData);
            }
        });
    }

    static loadMex(file, storeData, loadingFiles, dataStoreLoadedDelegate) {
        const startTime = Date.now();
        FileLoader.loadJSON(file, (data)=>{
            const [fileName, extension] = FileLoader.getFileName(file.name);
            storeData[fileName] = data;

            loadingFiles.delete(file.name);
            storeData.loadTimes[file.name] = Date.now()-startTime;
            if (loadingFiles.size === 0) {
                dataStoreLoadedDelegate(storeData);
            }
        });
    }

    static loadTransport(file, storeData, loadingFiles, dataStoreLoadedDelegate) {
        const startTime = Date.now();
        loadingFiles.add(file.name);

        const reader = new FileReader();

        const sheetWiseData = {};

        reader.onload = function (e) {
            const data = e.target.result;

            const workbook = XLSX.read(data, { type: "binary" });

            workbook.SheetNames.forEach(function (sheetName) {
                const XL_row_object = XLSX.utils.sheet_to_row_object_array( workbook.Sheets[sheetName] );

                sheetWiseData[sheetName] = {
                    stepsData: XL_row_object.reduce(
                        (acc, item, i) => ({ ...acc, [`STEP_${i + 1}`]: item }),
                        {} ),
                    steps: XL_row_object.map((item, i) => `STEP_${i + 1}`),
                };
            });

            const monopiles = workbook.SheetNames;
            const [fileName, extension] = FileLoader.getFileName(file.name);
            if (fileName.startsWith("BAR") || fileName.startsWith("HTV")) {
                storeData.fileNames.push(fileName);
            }
            storeData[fileName] = {
                monopiles,
                ...sheetWiseData,
            };

            loadingFiles.delete(file.name);
            storeData.loadTimes[file.name] = Date.now()-startTime;
            if (loadingFiles.size === 0) {
                dataStoreLoadedDelegate(storeData);
            }
        };

        reader.onerror = function (ex) {
            console.error(ex);
        };

        reader.readAsBinaryString(file);
    }
}