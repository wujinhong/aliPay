export class ConfigMgr
{
    private static _instance:ConfigMgr;
    public config;

    public static get instance():ConfigMgr
    {
        if( null == ConfigMgr._instance )
        {
            ConfigMgr._instance = new ConfigMgr();
        }
        return ConfigMgr._instance;
    }

    public getConfig( key:string ):any
    {
        return this.config[ key ];
    }

}

export class ConfigKey
{
    public static mysql_net:string = "mysql_net";
    public static mysql_local:string = "mysql_local";
    public static use_db:string = "use_db";

    public static redis_local:string = "redis_local";
    public static redis_net:string = "redis_net";
    public static use_redis:string = "use_redis";
    public static use_statistic:string = "use_statistic";

    public static version:string = "version";
}