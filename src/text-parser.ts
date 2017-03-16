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

export function getTextWithinString(text: string, position: number) {
    let textToPosition = text.substring(0, position);
    if(textToPosition.lastIndexOf(' ')){
        textToPosition=textToPosition.substr(textToPosition.lastIndexOf(' '))
    }
    return textToPosition
}

export function getEggCompletionTypeString(text: string, position: number){
   const textToPosition = text.substring(0, position);
   if(textToPosition.endsWith('app.model.')){
       return 'app.model'
   }else if(textToPosition.indexOf('ctx.service.')!=-1){
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