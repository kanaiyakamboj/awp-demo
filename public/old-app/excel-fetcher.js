import * as XLSX from "https://unpkg.com/xlsx/xlsx.mjs";


export async function fetchExcelToJson(path){
    let arrayOfArrays = [];
//Here excell.xlsx file is in current working directory
    fetch(path).then(res => {
        return res.arrayBuffer();
    }).then(res => {
        let workbook = XLSX.read(new Uint8Array(res), {
            type: 'array'
        });
        workbook.SheetNames.forEach(function (sheetName) {
            // Here is your object
            let sheet = workbook.Sheets[sheetName];
            arrayOfArrays.push(
                {
                    sheet: sheetName,
                    steps: XLSX.utils.sheet_to_json(sheet)
                }
            );
        });
    })
    return arrayOfArrays;
}