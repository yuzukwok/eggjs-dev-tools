
export class MappingClassPath {
    path: string;
    classname: string;
    cache:any;
};


export interface ClassStore{
    paths:any
};

var store:ClassStore={paths:{}}

export  { store }