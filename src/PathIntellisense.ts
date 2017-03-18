import { CompletionItemProvider, TextDocument, Position, CompletionItem, workspace, CompletionItemKind, Range } from 'vscode';
import { isImportOrRequire, getTextWithinString, getEggCompletionTypeString, importStringRange } from './text-parser';
import { getPath, getEggConfigPath, extractExtension, findSymbol, Mapping } from './fs-functions';
import { PathCompletionItem,dealwithSymbol } from './PathCompletionItem';
import { getConfig, Config } from './config';
import { dlv } from './dlv'
import { store } from './store'
interface State {
    config?: Config,
    fileName?: string,
    textCurrentLine?: string,
    textWithinString?: string,
    eggCompletionType?: string
}

export class PathIntellisense implements CompletionItemProvider {

    constructor(private getEggPathClass: Function) {
        //console.log('ctor1');
    }

    provideCompletionItems(document: TextDocument, position: Position): Thenable<CompletionItem[]> {
        console.log('provideCompletionItems 激活');
        const textCurrentLine = document.getText(document.lineAt(position).range);
        //console.log(textCurrentLine)
        let eggcomtype = getEggCompletionTypeString(textCurrentLine, position.character)
        let txtinline = getTextWithinString(textCurrentLine, position.character, eggcomtype)
        const state: State = {
            config: getConfig(),
            fileName: document.fileName,
            textCurrentLine,
            textWithinString: txtinline,
            eggCompletionType: eggcomtype,
        };
        console.log(state);
        return this.shouldProvide(state) ? this.provide(state) : Promise.resolve([]);
    }



    shouldProvide(state: State) {
        // 目前支持 ctx.service app.model app.config
        if (state.eggCompletionType == "ctx.service" || state.eggCompletionType == 'app.model' || state.eggCompletionType == "app.config") {
            return true
        } else {
            return false
        }

    }

    provide(state: State) {
        console.log('提供');
        if (state.eggCompletionType == 'app.config') {
            // 基于run文件
            const configpath = getEggConfigPath();
            let runconfig = require(configpath)
            //提取 
            let objpath = state.textWithinString.substr(state.textWithinString.lastIndexOf('app.') + 4)
            objpath = objpath.substring(0, objpath.length - 1)
            let extarct = dlv(runconfig, objpath)
            if (extarct) {
                let completionItemList = []
                for (var key in extarct) {
                    if (extarct.hasOwnProperty(key)) {
                        var element = extarct[key];
                        let item = new CompletionItem(key)
                        item.kind = CompletionItemKind.Property;
                        if (typeof element == 'string') {
                            item.detail = '前次运行值：' + element
                        } else {

                        }
                        item.sortText = '0' + key
                        completionItemList.push(item)
                    }
                }
                return completionItemList
            }



        } else {
            //基于路径

            //如果当前entry 与 缓存中数据一致，说明已经处于文件级别，不在查找目录
            let cur = store.paths[state.textWithinString]
            if (!cur) {
                const path = getPath(state.fileName, state.textWithinString, state.eggCompletionType);
                console.log(path);
                return this.getEggPathClass(path).then(children => {
                    console.log(children)
                    return [
                        ...children.map(child => new PathCompletionItem(child, state.eggCompletionType, state.textWithinString, state.config))
                    ]
                });
            } else {
                //文件级别 开始读取typescript 符号
                console.log(cur)
                var findpath = cur.path
             return   findSymbol(findpath).then(function (res) {
                 // 更新cache
                   store.paths[state.textWithinString].cache=res
                   let  re=dealwithSymbol(res)
                   console.log(re)
                   return re
                }, function (err) {
                    console.log(err)
                })
            }

        }




    }
   
    resolveCompletionItem(item: CompletionItem): Thenable<CompletionItem> {
        //读取详细信息
        // item.detail='detail'
        return Promise.resolve(item);
    }
}