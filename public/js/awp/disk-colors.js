export function getDiskColors(storeData, psfd){
    let pink = [];
    let black = [];
    let purple = [];
    let red = [];



    if(storeData && psfd){
        for(let i = 0; i < storeData.fileNames.length; i++){
            const fileName = storeData.fileNames[i];
            const monopiles = storeData[fileName].monopiles;
            if(fileName===psfd.fileName){
                for(let j = 0; j < monopiles.length; j++){
                    if(!psfd.monopileName) break;
                    if(monopiles[j]===psfd.monopileName) break;
                    purple.push(monopiles[j]);
                }
                break;
            }
            black = black.concat(monopiles);
        }
        if(storeData[psfd.fileName]) pink = storeData[psfd.fileName].monopiles;
        if(psfd.monopileName) red.push(psfd.monopileName);
    }
    return {
        pink:pink,
        black:black,
        purple:purple,
        red:red
    }
}