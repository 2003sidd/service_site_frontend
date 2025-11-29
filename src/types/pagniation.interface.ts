export interface paginationType {
    index:number,
    top:number,
    searchBy?:string
}

export interface employteeRequestInterface extends paginationType{
    filterByRole:String
}