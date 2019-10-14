import { Router } from "express";
import { AliPay } from "./AliPay";
export class PayRouter
{
    private readonly _router:Router;
    private static _instance:PayRouter;

    constructor()
    {
        const router:Router = Router();
        //支付宝路由
        let aliPay:AliPay = new AliPay();
        router.post( '/aliOrder', aliPay.doOrder.bind( aliPay ) );
        router.post( '/aliNotify', aliPay.doNotify.bind( aliPay ) );

        this._router = router;
    }

    public static get instance():PayRouter
    {
        if( null == PayRouter._instance )
        {
            PayRouter._instance = new PayRouter();
        }

        return PayRouter._instance;
    }

    public get router():Router
    {
        return this._router;
    }
}