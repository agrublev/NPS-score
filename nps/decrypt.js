const CryptoJS = require("crypto-js");

const CryptoJSAesJson = {
    stringify: function (cipherParams) {
        let j = { ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64) };
        if (cipherParams.iv) j.iv = cipherParams.iv.toString();
        if (cipherParams.salt) j.s = cipherParams.salt.toString();
        return JSON.stringify(j);
    },
    parse: function (jsonStr) {
        let j = JSON.parse(jsonStr);
        let cipherParams = CryptoJS.lib.CipherParams.create({
            ciphertext: CryptoJS.enc.Base64.parse(j.ct),
        });
        if (j.iv) cipherParams.iv = CryptoJS.enc.Hex.parse(j.iv);
        if (j.s) cipherParams.salt = CryptoJS.enc.Hex.parse(j.s);
        return cipherParams;
    },
};
let decrypted = JSON.parse(
    CryptoJS.AES.decrypt(
        `{"ct":"OXN8lXPIMkEPkdYBWwWrxg==","iv":"91c08afb6a0c528b6f2ddddaac6d05a7","s":"2a9cc4087a332966"} `,
        "FREEDCAMP-XAOSGTHO(*@%HAUNUJSDIUHT(&H#ASIOJD--==%",
        { format: CryptoJSAesJson }
    ).toString(CryptoJS.enc.Utf8)
);
console.info("Console --- de", decrypted);
