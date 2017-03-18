'use strict';
import { ExtensionContext, languages, workspace, commands, Uri } from 'vscode';
import { PathIntellisense } from './PathIntellisense';
import { getEggPathClass } from './fs-functions';
import { store, MappingClassPath } from './store';
import { findAllNodePid,findDebugPortAndDebug } from './debughelper';

export function activate(context: ExtensionContext) {

	const provider = new PathIntellisense(getEggPathClass);
	//const triggers = [':'];
	context.subscriptions.push(languages.registerCompletionItemProvider('javascript', provider, '.'));


	var disposable = commands.registerCommand('extension.eggdebugattach', () => {

		findAllNodePid().then(function (pids) {
			findDebugPortAndDebug(pids,9229)
		})

	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }