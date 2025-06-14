import signatures from '../mockData/signatures.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class SignatureService {
  constructor() {
    this.signatures = [...signatures];
  }

  async getByDocumentId(documentId) {
    await delay(250);
    return this.signatures.filter(sig => sig.documentId === documentId).map(sig => ({ ...sig }));
  }

  async create(signatureData) {
    await delay(300);
    const newSignature = {
      id: Date.now().toString(),
      signedAt: new Date().toISOString(),
      ipAddress: '192.168.1.1', // Mock IP
      ...signatureData
    };
    this.signatures.push(newSignature);
    return { ...newSignature };
  }

  async verify(signatureId) {
    await delay(400); // Simulate verification time
    const signature = this.signatures.find(sig => sig.id === signatureId);
    if (!signature) {
      throw new Error('Signature not found');
    }

    return {
      isValid: true,
      signedAt: signature.signedAt,
      ipAddress: signature.ipAddress,
      verificationTimestamp: new Date().toISOString()
    };
  }

  async delete(signatureId) {
    await delay(250);
    const index = this.signatures.findIndex(sig => sig.id === signatureId);
    if (index === -1) {
      throw new Error('Signature not found');
    }
    
    const deletedSignature = { ...this.signatures[index] };
    this.signatures.splice(index, 1);
    return deletedSignature;
  }
}

export default new SignatureService();