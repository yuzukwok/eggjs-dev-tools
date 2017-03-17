import { CompletionItem, CompletionItemKind, Range, TextEdit } from 'vscode';
import { FileInfo } from './FileInfo';
import { workspace } from 'vscode';
import { Config } from './config';
import{ camelize } from './camelize';
import {store,MappingClassPath} from './store'

const withExtension = workspace.getConfiguration('path-intellisense')['extensionOnImport'];

export class PathCompletionItem extends CompletionItem {
    constructor(fileInfo: FileInfo,eggtype:string,eggentry:string, config: Config) {
           //label
        super(fileInfo.file);
        let item=fileInfo.file
        //remove extension
        item=this.removeExtension(item)
        //case
        item=camelize(item)
        if(eggtype=="app.model"){
            //首字母
           item=item.charAt(0).toUpperCase() + item.substr(1)
        }
        this.label=item
         //if(fileInfo.isFile){
          this.kind = CompletionItemKind.Class;
        //  }else{
        //    this.kind=CompletionItemKind.File;
        //  }
        //sort 
        this.sortText='0'+item

        //缓存结果
        if(fileInfo.isFile){
            let key=eggentry+item
            // 是否存在
            let obj=store.paths[key]
            if(!obj){
            store.paths[key]={}
            store.paths[key].path=fileInfo.filePath
            store.paths[key].classname=eggentry+item
            }
            //console.log(store.paths[key])
        }
        
    }
    
    addGroupByFolderFile(fileInfo: FileInfo) {
        this.sortText = `${fileInfo.isFile ? 'b' : 'a'}_${fileInfo.file}`;
    }
    
    addSlashForFolder(fileInfo: FileInfo, importRange: Range, autoSlash: boolean) {
        if (!fileInfo.isFile) {
            this.label = `${fileInfo.file}/`;
            var newText = autoSlash ? `${fileInfo.file}/` : `${fileInfo.file}`;
            this.textEdit = new TextEdit(importRange, newText);
        }
    }
    
    removeExtension(item:string):string {
     let fragments=  item.split('.');
     const extension = fragments[fragments.length - 1];
     return item.replace('.'+extension,'')
    }



}