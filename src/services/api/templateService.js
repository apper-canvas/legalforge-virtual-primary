import templates from '../mockData/templates.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TemplateService {
  constructor() {
    this.templates = [...templates];
  }

  async getAll() {
    await delay(300);
    return [...this.templates];
  }

  async getById(id) {
    await delay(250);
    const template = this.templates.find(t => t.id === id);
    if (!template) {
      throw new Error('Template not found');
    }
    return { ...template };
  }

  async getByCategory(category) {
    await delay(300);
    return this.templates.filter(t => t.category === category).map(t => ({ ...t }));
  }

  async search(query) {
    await delay(350);
    const lowercaseQuery = query.toLowerCase();
    return this.templates.filter(t => 
      t.name.toLowerCase().includes(lowercaseQuery) ||
      t.description.toLowerCase().includes(lowercaseQuery) ||
      t.category.toLowerCase().includes(lowercaseQuery)
    ).map(t => ({ ...t }));
  }
}

export default new TemplateService();