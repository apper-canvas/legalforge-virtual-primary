import questions from '../mockData/questions.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class QuestionService {
  constructor() {
    this.questions = { ...questions };
  }

  async getByTemplateId(templateId) {
    await delay(300);
    const templateQuestions = this.questions[templateId];
    if (!templateQuestions) {
      throw new Error('Questions not found for template');
    }
    return [...templateQuestions];
  }

  async validateAnswers(templateId, answers) {
    await delay(200);
    const templateQuestions = await this.getByTemplateId(templateId);
    const validation = {
      isValid: true,
      errors: [],
      warnings: []
    };

    templateQuestions.forEach(question => {
      const answer = answers[question.id];
      
      // Check required fields
      if (question.required && (!answer || answer.toString().trim() === '')) {
        validation.errors.push({
          questionId: question.id,
          message: `${question.text} is required`
        });
        validation.isValid = false;
      }

      // Check dependencies
      if (question.dependsOn && question.dependsOn.questionId) {
        const dependencyAnswer = answers[question.dependsOn.questionId];
        if (dependencyAnswer !== question.dependsOn.value && answer) {
          validation.warnings.push({
            questionId: question.id,
            message: `This field may not be applicable based on your previous answer`
          });
        }
      }

      // Type-specific validation
      if (answer && question.type === 'email' && !/\S+@\S+\.\S+/.test(answer)) {
        validation.errors.push({
          questionId: question.id,
          message: 'Please enter a valid email address'
        });
        validation.isValid = false;
      }

      if (answer && question.type === 'date' && new Date(answer) < new Date()) {
        validation.warnings.push({
          questionId: question.id,
          message: 'The selected date is in the past'
        });
      }
    });

    return validation;
  }
}

export default new QuestionService();