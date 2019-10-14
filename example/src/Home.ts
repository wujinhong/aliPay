import { Request, Response } from "express";
import { Route } from "./Route";

export class Home extends Route
{
    exec(req:Request, res:Response):void
    {
        res.redirect( `http://dl.juhetec.com/web/company/index.html` );
    }
}