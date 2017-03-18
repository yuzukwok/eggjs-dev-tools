
export class MappingClassPath {
    path: string;
    classname: string;
    cache:any;
};


export interface ClassStore{
    paths:any
};

var store:ClassStore={paths:{}}
var debuginfo={ curmaxport:0}

export  { store,debuginfo }