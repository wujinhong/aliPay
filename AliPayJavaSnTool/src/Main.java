import com.alipay.api.AlipayApiException;
import com.alipay.api.internal.util.AlipaySignature;
import com.alipay.api.internal.util.AntCertificationUtil;
import org.apache.commons.io.FileUtils;

import java.io.File;
import java.io.IOException;

public class Main
{
    public static void main( String[] args )
    {
        try
        {

            System.out.println( "app_cert_sn=" + AlipaySignature.getCertSN( "./crt/appCertPublicKey.crt" ) );

            System.out.println( "alipay_cert_sn=" + AlipaySignature.getAlipayPublicKey( "./crt/alipayCertPublicKey_RSA2.crt" ) );
        }
        catch( AlipayApiException e )
        {

        }

        try
        {
            String rootCertContent = FileUtils.readFileToString( new File( "./crt/alipayRootCert.crt" ), "UTF-8" );
            System.out.println( "alipay_root_cert_sn=" + AntCertificationUtil.getRootCertSN( rootCertContent ) );
        }
        catch( IOException e1 )
        {
            e1.printStackTrace();
        }
    }
}
