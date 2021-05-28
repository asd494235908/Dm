import JSEncrypt from 'jsencrypt';
export const RsaEncryption = function (word, key) {
    if (key === undefined) {
        key = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqFm17J2hC9MYkoUCg2o0
TnfHUOiVnLtuSiwvERU2z2d3vuVQdv/CbtMEA1wOTkaSYY11Tk9S26ohkK63d7M4
gM+CXxvp/tosd+GqudBWXZpFdHzC4y9MEw5GeUtd2EdSvk6cQvhlpRzIsmiW3nLx
5Lkkv/lbBCJY5ufWbLcjUW8A4MuncbGA6m7Em0jU18CkWbOjCj7bUxaNFAHpRXGD
6yHboi3fT9gzthWyiZ6zO15nP8CvA4ZwfNBuoABDVHyK1dQXjwTijS1nl8Mb1MFs
x0DTKzKyaMfOlBgPpCEm75vm6IsLx1zArKRFuW4vQcsmHkZdBRt7X6shb0UKniKb
hwIDAQAB
-----END PUBLIC KEY-----`
    }
    var encrypt = new JSEncrypt();
    encrypt.setPublicKey(key);
    word = typeof word === 'string' ? word : JSON.stringify(word)
    // 加密数据
    var res = encrypt.encrypt(word);
    return res
}