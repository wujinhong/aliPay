export interface RsaSignParam {
    app_id: string;
    notify_url: string;
    app_cert_sn: string;
    alipay_root_cert_sn: string;
    subject: string;
    trade_no: string;
    total_amount: number;
}
/**
 * 公钥证书方式模式
 * 详情：https://docs.open.alipay.com/291/106118
 * */
export declare class AliPayUtil {
    private readonly privateKey;
    private readonly publicKey;
    constructor(publicKey: string, privateKeyPath: string);
    /**
     * 验签
     * 详情：https://docs.open.alipay.com/200/106120
     * @param signObj {JSON} 被验证签名obj
     * @return {Boolean}
     */
    rsaCheck(signObj: any): boolean;
    getPayCode(params: RsaSignParam): string;
    /**
     * 生成签名
     * @param params {JSON} 待签参数
     * @return signed string
     */
    private rsaSign;
    /**
     * 筛选、排序、拼接请求参数
     * @param params {JSON}
     * @param encode {Boolean} 是否对value进行encode  app支付需要encode
     * @return 待签名字符串
     */
    private static formatter;
}
