import documents from '../mockData/documents.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class DocumentService {
  constructor() {
    this.documents = [...documents];
  }

  async getAll() {
    await delay(300);
    return [...this.documents];
  }

  async getById(id) {
    await delay(250);
    const document = this.documents.find(doc => doc.id === id);
    if (!document) {
      throw new Error('Document not found');
    }
    return { ...document };
  }

  async getByStatus(status) {
    await delay(300);
    return this.documents.filter(doc => doc.status === status).map(doc => ({ ...doc }));
  }

  async create(documentData) {
    await delay(400);
    const newDocument = {
      id: Date.now().toString(),
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      content: {},
      signatures: [],
      ...documentData
    };
    this.documents.push(newDocument);
    return { ...newDocument };
  }

  async update(id, updateData) {
    await delay(350);
    const index = this.documents.findIndex(doc => doc.id === id);
    if (index === -1) {
      throw new Error('Document not found');
    }
    
    this.documents[index] = {
      ...this.documents[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    return { ...this.documents[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.documents.findIndex(doc => doc.id === id);
    if (index === -1) {
      throw new Error('Document not found');
    }
    
    const deletedDocument = { ...this.documents[index] };
    this.documents.splice(index, 1);
    return deletedDocument;
  }

  async duplicate(id) {
    await delay(350);
    const original = await this.getById(id);
    const duplicated = await this.create({
      ...original,
      title: `${original.title} (Copy)`,
      status: 'draft',
      signatures: []
    });
    return duplicated;
  }

  async generateContent(templateId, answers) {
    await delay(500); // Simulate AI processing time
    
    // Mock AI content generation based on template and answers
    const templates = {
      'rental-agreement': {
        title: 'RESIDENTIAL LEASE AGREEMENT',
        sections: [
          {
            title: 'PARTIES',
            content: `This Residential Lease Agreement ("Agreement") is entered into on ${answers.startDate || '[DATE]'} between ${answers.landlordName || '[LANDLORD]'} ("Landlord") and ${answers.tenantName || '[TENANT]'} ("Tenant").`
          },
          {
            title: 'PROPERTY',
            content: `Landlord hereby leases to Tenant the residential property located at ${answers.propertyAddress || '[PROPERTY ADDRESS]'} ("Premises").`
          },
          {
            title: 'TERM',
            content: `The lease term shall commence on ${answers.startDate || '[START DATE]'} and end on ${answers.endDate || '[END DATE]'}, for a total period of ${answers.leaseTerm || '[LEASE TERM]'}.`
          },
          {
            title: 'RENT',
            content: `Tenant agrees to pay rent in the amount of $${answers.rentAmount || '[RENT AMOUNT]'} per month, due on the ${answers.rentDueDate || '1st'} day of each month.`
          }
        ]
      },
      'nda': {
        title: 'NON-DISCLOSURE AGREEMENT',
        sections: [
          {
            title: 'PARTIES',
            content: `This Non-Disclosure Agreement ("Agreement") is entered into between ${answers.disclosingParty || '[DISCLOSING PARTY]'} ("Disclosing Party") and ${answers.receivingParty || '[RECEIVING PARTY]'} ("Receiving Party").`
          },
          {
            title: 'CONFIDENTIAL INFORMATION',
            content: `For purposes of this Agreement, "Confidential Information" shall mean any and all technical and non-technical information disclosed by the Disclosing Party, including but not limited to: ${answers.informationType || 'proprietary information, trade secrets, business plans'}.`
          },
          {
            title: 'OBLIGATIONS',
            content: `The Receiving Party agrees to hold all Confidential Information in strict confidence and not to disclose such information to any third parties without prior written consent.`
          }
        ]
      }
    };

    const template = templates[templateId] || templates['rental-agreement'];
    
    return {
      title: template.title,
      sections: template.sections,
      generatedAt: new Date().toISOString()
    };
  }
}

export default new DocumentService();