# aliPay
支付宝推荐的公钥证书方式模式SDK、示例及相关工具


有问题请提交 Issues.


支付宝支付共有两种模式，这里支持的是支付宝推荐的公钥证书方式模式

安装
npm install alipay_sdk2

使用
源码有例子，可以下载源码查看使用方法。
typescript使用方法：
1、this.aliPay = new AliPayUtil( this.alipay_cert_sn, this.privateKeyPath );//初使化
2、this.aliPay.getPayCode( rsaSignParam );//生成APP支付字符串
3、this.aliPay.rsaCheck( req.body );//支付回调验签
详细使用方法查看 example/src/AliPay.ts
javascript使用方法
1、this.aliPay = new AliPayUtil_1.AliPayUtil( this.alipay_cert_sn, this.privateKeyPath );//初使化
2、this.aliPay.getPayCode( rsaSignParam );//生成APP支付字符串
3、this.aliPay.rsaCheck( req.body );//支付回调验签：
详细使用方法，查看项目编译生成的*.js文件 example/bin/AliPay.js
AliPayJavaSnTool用于生成三个证书序列号：
1、app_cert_sn
2、alipay_cert_sn
3、alipay_root_cert_sn
