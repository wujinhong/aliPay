"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
/**
 * 公钥证书方式模式
 * 详情：https://docs.open.alipay.com/291/106118
 * */
var AliPayUtil = /** @class */ (function () {
    function AliPayUtil(publicKey, privateKeyPath) {
        var privateKey = fs_1.readFileSync(privateKeyPath);
        if (privateKey.indexOf('BEGIN') === -1) {
            this.privateKey = "-----BEGIN RSA PRIVATE KEY-----\n" + privateKey + "\n-----END RSA PRIVATE KEY-----";
        }
        else {
            this.privateKey = privateKey.toString();
        }
        if (publicKey.indexOf('BEGIN') === -1) {
            this.publicKey = "-----BEGIN PUBLIC KEY-----\n" + publicKey + "\n-----END PUBLIC KEY-----";
        }
        else {
            this.publicKey = publicKey.toString();
        }
    }
    /**
     * 验签
     * 详情：https://docs.open.alipay.com/200/106120
     * @param signObj {JSON} 被验证签名obj
     * @return {Boolean}
     */
    AliPayUtil.prototype.rsaCheck = function (signObj) {
        var sign = decodeURIComponent(signObj.sign);
        delete signObj.sign; //除去sign参数
        delete signObj.sign_type; //除去sign_type参数
        var data = AliPayUtil.formatter(signObj);
        var crypto = require('crypto');
        return crypto
            .createVerify("RSA-SHA256")
            .update(data)
            .verify(this.publicKey, sign, 'base64');
    };
    AliPayUtil.prototype.getPayCode = function (params) {
        var param = {
            app_id: params.app_id,
            method: "alipay.trade.app.pay",
            charset: "utf-8",
            sign_type: "RSA2",
            notify_url: params.notify_url,
            app_cert_sn: params.app_cert_sn,
            alipay_root_cert_sn: params.alipay_root_cert_sn,
            timestamp: require("moment")().format('YYYY-MM-DD HH:mm:ss'),
            biz_content: {
                subject: params.subject,
                out_trade_no: params.trade_no,
                total_amount: params.total_amount,
                product_code: 'QUICK_MSECURITY_PAY'
            },
            version: "1.0"
        };
        /*const stringify:string = AliPayUtil.formatter( param );
        console.log( stringify );*/
        var formatStr = AliPayUtil.formatter(param, true);
        return formatStr + "&sign=" + encodeURIComponent(this.rsaSign(param));
    };
    /**
     * 生成签名
     * @param params {JSON} 待签参数
     * @return signed string
     */
    AliPayUtil.prototype.rsaSign = function (params) {
        var crypto = require('crypto');
        return crypto.createSign("RSA-SHA256")
            .update(AliPayUtil.formatter(params))
            .sign(this.privateKey, 'base64');
    };
    /**
     * 筛选、排序、拼接请求参数
     * @param params {JSON}
     * @param encode {Boolean} 是否对value进行encode  app支付需要encode
     * @return 待签名字符串
     */
    AliPayUtil.formatter = function (params, encode) {
        if (encode === void 0) { encode = false; }
        var sortedParams = {};
        Object.keys(params).sort().map(function (key) {
            if (typeof params[key] === 'object') {
                params[key] = JSON.stringify(params[key]);
            }
            sortedParams[key] = encode
                ? encodeURIComponent(params[key])
                : params[key];
        });
        var qs = require('querystring');
        return qs.unescape(qs.stringify(sortedParams));
    };
    return AliPayUtil;
}());
exports.AliPayUtil = AliPayUtil;
