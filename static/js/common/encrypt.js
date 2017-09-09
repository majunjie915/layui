define(function(require, exports) {
    var JSEncrypt = require("jsencrypt");
    var encrypt = function(str) {
        var crypt = new JSEncrypt();
        var pubkey = '-----BEGIN PUBLIC KEY-----' + '\n' +
            'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCc0NZYXxwvu37iBJm+BYWle1jx' + '\n' +
            '0Hp6MR7kQZVhjRy3LIlqGLue+XRj5drYAi7kBZSn7o42w7hRsous99RKpeKmHkBk' + '\n' +
            'PE+pmaS4+SrvE2t3eZAjzJpWYu3ZWIjykKKmtwa7DaxoekjuYrQiL8HMD4OZoNRa' + '\n' +
            'IrwlnTcxaInQPl0cWQIDAQAB' + '\n' +
            '-----END PUBLIC KEY-----';

        var pubkey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCc0NZYXxwvu37iBJm+BYWle1jx0Hp6MR7kQZVhjRy3LIlqGLue+XRj5drYAi7kBZSn7o42w7hRsous99RKpeKmHkBkPE+pmaS4+SrvE2t3eZAjzJpWYu3ZWIjykKKmtwa7DaxoekjuYrQiL8HMD4OZoNRaIrwlnTcxaInQPl0cWQIDAQAB';            
        crypt.setPublicKey(pubkey);

        console.log(str);
        if(!str){
            str = "";
        }else if(typeof str == 'String'){

        }else if (Object.prototype.toString.call(str) == "[object Object]"){
            str = JSON.stringify(str);
        }


        var rs = []
        var reg = /.{100}/g;
        rs = str.match(reg);
        var encryStr = "";
        
        if(rs){
            rs.push(str.substring(rs.join('').length));
            
            for (var i = 0; i < rs.length; i++) {
                encryStr += crypt.encrypt(rs[i]);
                if (i < rs.length - 1) {
                    encryStr += "|||";
                }
            }
        }else{
            encryStr += crypt.encrypt(str)
        }
        return encryStr;
    }

    exports.encrypt = encrypt;
})