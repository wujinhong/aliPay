import { Route } from "./Route";
import { Home } from "./Home";
import { PayRouter } from "./PayRouter";

export class RouteMgr
{
    private routes:Array<Route> = [];
    private static _instance:RouteMgr;

    constructor()
    {
        this.routes.push( new Home( "/" ) );
    }
    public static get instance():RouteMgr
    {
        if( null == RouteMgr._instance )
        {
            RouteMgr._instance = new RouteMgr();
        }

        return RouteMgr._instance;
    }

    public use( app:any ):void
    {
        //增加支付路由
        app.use('/pay', PayRouter.instance.router);
        const routes:Array<Route> = this.routes;
        const length:number = routes.length;
        for ( let i:number = 0; i < length; i++ )
        {
            const handler:Route = routes[ i ];

            if ( handler.type == "GET" )
            {
                app.get( handler.path, handler.exec.bind( handler ) );
            }
            else
            {
                app.post( handler.path, handler.exec.bind( handler ) );
            }
        }
    }
}