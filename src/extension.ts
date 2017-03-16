'use strict';
import { ExtensionContext, languages } from 'vscode';
import { PathIntellisense } from './PathIntellisense';
import { getEggPathClass } from './fs-functions';

export function activate(context: ExtensionContext) {
	const provider = new PathIntellisense(getEggPathClass);
	//const triggers = [':'];
	context.subscriptions.push(languages.registerCompletionItemProvider('javascript', provider, '.'));
}

export function deactivate() {
}