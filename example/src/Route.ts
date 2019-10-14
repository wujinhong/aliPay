import {Request, Response} from "express";
export class Route
{
    path: string;
    type: string;
    constructor( path:string, type:string="GET" )
    {
        this.path = path;
        this.type = type;
    }
    public exec( req:Request, res:Response ):void
    {
        res.setHeader('Access-Control-Allow-Origin', '*');
    }
}