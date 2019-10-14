import { Request, Response } from 'express';
import { resolve } from "path";
import { AliPayUtil, RsaSignParam } from "./AliPayUtil";

export class AliPay
{
    private readonly APP_ID:string = '2019123412341234';
    private readonly NOTIFY_URL = 'https://gordon.com/pay/aliNotify';
    private readonly aliPay:AliPayUtil;

    /**
     * 公钥证书方式模式
     * 详情：https://docs.open.alipay.com/291/106118
     * */
    /**由（应用公钥证书：appCertPublicKey.crt）生成*/
    private readonly app_cert_sn:string = "testingtestingtestingtestingtesting";
    /**由（支付宝根证书：alipayRootCert.crt）生成*/
    private readonly alipay_root_cert_sn:string = "testingtesting336e5abf83c5d8_testingtesting3d3b83462e1dfcf6";
    /**由（支付宝公钥证书：alipayCertPublicKey_RSA2.crt）生成，用于异步验签*/
    private readonly alipay_cert_sn:string = "testingtestingYcVC2H9hLJhm/Ty672l6twcZg" +
        "testingtestingTOQ1nIPwJIW88g9BcEQq/ReMYfGuKtestingtestingtestingtestingARH/QLO" +
        "testingtestingMjdIM4NpbRxBg8O8R74VROzYce1l9lRtestingtestingtestingtestingwvM" +
        "testingtestingtestingtestingtestingtesting0iiHGyHW/niUErszX+Vx/iKdwIDAQAB";

    private readonly privateKeyPath:string = resolve( './config/gordon.com_private.pem' );


    constructor()
    {
        this.aliPay = new AliPayUtil( this.alipay_cert_sn, this.privateKeyPath );
    }

    public async doOrder( req:Request, res:Response ):Promise<void>
    {
        let data = req.body;
        if( data.uid == null || data.shop_id == null )
        {
            res.json( { code:0, message:'参数不能为null', prepay_id:'' } )
        }
        let code = 0;
        let msg = 'success';
        data.ip = req.ip.replace( /::ffff:/, '' );
        try
        {
            const param:RsaSignParam = {
                app_id:this.APP_ID,
                notify_url:this.NOTIFY_URL,
                app_cert_sn:this.app_cert_sn,
                alipay_root_cert_sn:this.alipay_root_cert_sn,
                subject:<string>req.body.body,
                trade_no: 'trade_no',
                total_amount: 6
            };

            res.json( { code:code, orderInfo:this.aliPay.getPayCode( param ) } );
            return;
        }
        catch( error )
        {
            code = 2;
            msg = '订单生成失败 ';
            res.json( { code:code, message:msg + error.message } );
        }
    }

    /**
     * 支付回调接口
     * @param req
     * @param res
     */
    public async doNotify( req:Request, res:Response ):Promise<void>
    {
        let _payInfo = req.body;

        let msg:string = 'success';
        if( _payInfo.trade_status == 'TRADE_SUCCESS' )
        {
            try
            {
                if( this.aliPay.rsaCheck( _payInfo ) )
                {//校验签名成功
                    let checkParam:any = {};
                    checkParam.trade_no = _payInfo.out_trade_no;//自己订单号
                    checkParam.pay_fee = _payInfo.total_amount;
                    checkParam.out_trade_no = _payInfo.trade_no;//三方订单号
                    checkParam.pay_time = new Date();
                    checkParam.buyer_id = _payInfo.buyer_id;
                    checkParam.buyer_email = _payInfo.buyer_logon_id;
                }
                else
                {
                    msg = 'sign error';
                }
            }
            catch( error )
            {
                msg = error.message;
            }
        }
        else
        {
            msg = _payInfo.trade_status;
        }
        res.end( msg );
    }
}