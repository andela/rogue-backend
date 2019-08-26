
import bcrypt from 'bcrypt';

/**
 * @class CryptData
 * @description class defining the methods used to crypt and decrypt
 * sensitive information
*/
class CryptData {
  /**
  * @param {string} dataToEncrypt - string to encrypt
  * @return {string} - hashed string
  * @memberof CryptData
 */
  static async encryptData(dataToEncrypt) {
    const salt = 6;
    try {
      const hashedData = await bcrypt.hash(dataToEncrypt, salt);
      return hashedData;
    } catch (err) {
      return Error('An error occurred while hashing');
    }
  }

  /**
  * @param {string} dataToDecrypt - string to decrypt
  * @param {string} dataBaseHash - hash used to compare the string against
  * @return {boolean} - result of the comparison. If the passed in string
  * is the same as the hash used to compare, then a boolean 'true' is
  * returned else 'false' is returned.
  * @memberof CryptData
  */
  static async decryptData(dataToDecrypt, dataBaseHash) {
    try {
      const isPasswordCorrect = await bcrypt
        .compare(dataToDecrypt, dataBaseHash);
      return isPasswordCorrect;
    } catch (err) {
      return Error('An error occurred while comparing the data sent');
    }
  }
}
export default CryptData;
