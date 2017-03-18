import { readdir } from 'fs';
import { resolve as resolvePath, sep as dirSeparator, normalize } from 'path';
import { FileInfo } from './FileInfo';
import { TextDocument, workspace, Uri, commands } from 'vscode';
import { join } from 'path'
import { store } from './store'

export interface Mapping {
    key: string,
    value: string
}

export function getEggPathClass(path) {
    return readdirPromise(path)
        .then(files => {
            return files.map(f => new FileInfo(path, f))
        })
        .catch(() => []);
}

export function getPath(fileName: string, linetxt: string, eggtype: string): string {
    let base = workspace.rootPath
    if (eggtype == 'ctx.service') {
        let dirs = linetxt.split('.')
        return join(base, '/app/service', ...dirs)
    } else if (eggtype == 'app.model') {
        return join(base, '/app/model')
    } else {
        return ''
    }
}

export function findSymbol(file) {
    return new Promise<string[]>((resolve, reject) => {
        // 当前workspace是否存在
        let found = false;
        for (var index = 0; index < workspace.textDocuments.length; index++) {
            var element = workspace.textDocuments[index];
            if (element.uri.fsPath == file) {
                //当前已存在
                found = true
                commands.executeCommand('vscode.executeDocumentSymbolProvider', element.uri).then(function (res) {
                    resolve(res)
                }, function (err) {
                    console.log(err)
                    reject(err)
                });
            }
        }
        if (!found) {
            //打开之后再读取
            let uri = Uri.file(file)
            workspace.openTextDocument(uri).then(function (file) {
                commands.executeCommand('vscode.executeDocumentSymbolProvider', uri).then(function (res) {
                    resolve(res)
                }, function (err) {
                    console.log(err)
                    reject(err)
                });
            },function(err){
                reject(err)
            })

        }

    })

}
export function getEggConfigPath() {
    let base = workspace.rootPath
    return join(base, '/run/application_config.json')
}

export function extractExtension(document: TextDocument) {
    if (document.isUntitled) {
        return undefined;
    }

    const fragments = document.fileName.split('.');
    const extension = fragments[fragments.length - 1];

    if (!extension || extension.length > 3) {
        return undefined;
    }

    return extension;
}

function readdirPromise(path: string) {
    return new Promise<string[]>((resolve, reject) => {
        readdir(path, (error, files) => {
            if (error) {
                reject(error);
            } else {
                resolve(files);
            }
        });
    });
}

