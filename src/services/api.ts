import axios, { AxiosResponse } from "axios"

const baseURL = `https://fakestoreapi.com/`;


const client = axios.create({
    baseURL,
  });
  
export const fetchData = async (endpoint:string)=>{

    try{
        const response :AxiosResponse= await client.get(`${endpoint}`);
        const data = response.data;
        return data;

    }catch(error){
        console.log('Error Occurred',error)
    }
}