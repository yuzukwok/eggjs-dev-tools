import { CompletionItemProvider, TextDocument, Position, CompletionItem, workspace, Range } from 'vscode';
import { isImportOrRequire, getTextWithinString,getEggCompletionTypeString, importStringRange } from './text-parser';
import { getPath, extractExtension, Mapping } from './fs-functions';
import { PathCompletionItem } from './PathCompletionItem';
import { getConfig, Config } from './config';

interface State {
    config?: Config,
    fileName?: string,
    textCurrentLine?: string,
    textWithinString?:string,
    eggCompletionType?: string
}

export class PathIntellisense implements CompletionItemProvider {
    
    constructor(private getEggPathClass: Function) { 
        //console.log('ctor1');
    }
    
    provideCompletionItems(document: TextDocument, position: Position): Thenable<CompletionItem[]> {       console.log('provideCompletionItems 激活');
        const textCurrentLine = document.getText(document.lineAt(position).range);
        //console.log(textCurrentLine)
        const state: State = {
            config: getConfig(),
            fileName: document.fileName,
            textCurrentLine,
            textWithinString: getTextWithinString(textCurrentLine, position.character),
            eggCompletionType:getEggCompletionTypeString(textCurrentLine, position.character),
        };
        console.log(state);
        return this.shouldProvide(state) ? this.provide(state) : Promise.resolve([]);
    }

    

    shouldProvide(state: State) {
        // 目前支持 ctx.service app.model

        if(state.eggCompletionType =="ctx.service"|| state.eggCompletionType=='app.model'){
            return true
        }else{
            return false
        }

    }

    provide(state: State) {
        console.log('提供');
        const path = getPath(state.fileName, state.textWithinString,state.eggCompletionType);
        console.log(path);
         return this.getEggPathClass(path).then(children => {
             console.log(children)
             return [
             ...children.map(child => new PathCompletionItem(child, state.eggCompletionType,state.config))
         ]});
        
    }

    resolveCompletionItem(item: CompletionItem): Thenable<CompletionItem>{
        //读取详细信息
       // item.detail='detail'
        return Promise.resolve(item);
    }
}