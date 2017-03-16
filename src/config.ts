import { workspace, WorkspaceConfiguration } from 'vscode';
import { Mapping } from './fs-functions';

export interface Config {
    autoSlash: boolean,
    mappings: Mapping[]
}

export function getConfig(): Config {
   return null
}

