import { Range, Position, TextDocument } from 'vscode';

export function isInString(text: string, character: number) : boolean {
    let inSingleQuoationString = (text.substring(0, character).match(/\'/g) || []).length % 2 === 1;
    let inDoubleQuoationString = (text.substring(0, character).match(/\"/g) || []).length % 2 === 1;
    return inSingleQuoationString || inDoubleQuoationString;
}

export function isImportOrRequire(text) {
    let isImport = text.substring(0, 6) === 'import';
    let isRequire = text.indexOf('require(') != -1;
    return isImport || isRequire;
}

export function getTextWithinString(text: string, position: number,eggcomtype:string) {
    let textToPosition = text.substring(0, position);
    // if(textToPosition.lastIndexOf(' ')!= -1){
    //     textToPosition=textToPosition.substr(textToPosition.lastIndexOf(' '))
    // }
    //截取最近的数据
    switch (eggcomtype) {
        case 'ctx.service':
            textToPosition=textToPosition.substr(textToPosition.lastIndexOf('ctx.service.')+12)
            break;
        case 'app.model':
            textToPosition=textToPosition.substr(textToPosition.lastIndexOf('app.model.')+10)
            break;
        case 'app.config':
        textToPosition=textToPosition.substr(textToPosition.lastIndexOf('app.config.')+11)
            break;
        default:
            break;
    }
     
    textToPosition=textToPosition.trim()
    let endot=textToPosition.charAt(textToPosition.length-1)=="."
    if(endot)  textToPosition=textToPosition.substr(0,textToPosition.length-1)
    return textToPosition
}

export function getEggCompletionTypeString(text: string, position: number){
   const textToPosition = text.substring(0, position);
   // 一行文本中出现以下特征字符则开始自动完成，靠右优先
   let configindex =textToPosition.indexOf('app.config.');
   let serviceindex=textToPosition.indexOf('ctx.service.');
   if(textToPosition.endsWith('app.model.')){
       return 'app.model'
   }else if(configindex!=-1&&configindex>=serviceindex){
       return 'app.config'
   }
   else if(serviceindex!=-1&&serviceindex>=configindex){
       return 'ctx.service'
   }else{
       return 'null'
   }
}

export function importStringRange(line: string, position: Position): Range {
    const textToPosition = line.substring(0, position.character);
    const slashPosition = textToPosition.lastIndexOf('/');

    const startPosition = new Position(position.line, slashPosition + 1);
    const endPosition = position;

    return new Range(startPosition, endPosition);
}