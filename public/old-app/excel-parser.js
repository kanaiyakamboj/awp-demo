import * as XLSX from "https://unpkg.com/xlsx/xlsx.mjs";


export async function loadExcelJson(data) {
    let reader = new FileReader();
    // reader.readAsText(data,'UTF-8');
    let arrayOfArrays = [];
    // here we tell the reader what to do when it's done reading...
    reader.onload = function(e) {
        let content = e.target.result; // this is the content!
        let workbook = XLSX.read(content, {
            type: 'binary'
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

    }
    await reader.readAsBinaryString(data);
    return arrayOfArrays;
}