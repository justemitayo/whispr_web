// libs/ByteLock.ts
import ByteLock from 'bytelock';

export class MessageCipher {
  static generateCipherKey(sender_id: string, recipient_id: string): number {
    const key = ByteLock.generateCipherKey(sender_id, recipient_id);
    if (key === null) {
      throw new Error('Failed to generate cipher key');
    }
    return key;
  }

  static cipherMessage(message: string, key: number): string {
    if (key === null || key === undefined) {
      throw new Error('Invalid cipher key');
    }
    return ByteLock.cipherMessage(message, key);
  }

  static decipherMessage(cipherText: string, key: number): string {
    if (key === null || key === undefined) {
      throw new Error('Invalid cipher key');
    }
    return ByteLock.decipherMessage(cipherText, key);
  }
}
