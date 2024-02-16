export interface Products{
    id:number,
    title:string,
    price:string,
    category:string,
    description:string,
    image:string
}


export interface ShopState{
    products:Products[];
}