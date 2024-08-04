import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
    providedIn: 'root'
})
export class CryptoService {

    private SECRET_KEY = 'qwtp jjnz jgmw lewb'

    hashKey(secretKey: string): CryptoJS.lib.WordArray {
        return CryptoJS.SHA256(secretKey);
    }

    decrypt(iv: string, encryptedData: string): string {
        try {
            const keyBytes = this.hashKey(this.SECRET_KEY);
            const ivBytes = CryptoJS.enc.Hex.parse(iv);
            const encryptedDataBytes = CryptoJS.enc.Hex.parse(encryptedData);
            const cipherParams = CryptoJS.lib.CipherParams.create({
                ciphertext: encryptedDataBytes
            });
            const decryptedBytes = CryptoJS.AES.decrypt(cipherParams, keyBytes, {
                iv: ivBytes,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });
            const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
            if (!decryptedText) {
                throw new Error('Decryption failed. Check if the encrypted data is valid.');
            }
            return decryptedText;
        } catch (error) {
            console.error('Decryption Error:', error);
            throw error;
        }
    }
}
