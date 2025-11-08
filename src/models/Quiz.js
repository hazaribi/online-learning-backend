const { supabase } = require('../../config/supabase');

class Quiz {
  constructor(data) {
    this.id = data.id;
    this.course_id = data.course_id;
    this.lesson_id = data.lesson_id;
    this.title = data.title;
    this.questions = data.questions;
    this.passing_score = data.passing_score || 70;
    this.created_at = data.created_at;
  }

  // Create new quiz
  static async create(quizData) {
    const { data, error } = await supabase
      .from('quizzes')
      .insert([{
        ...quizData,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return new Quiz(data);
  }

  // Find quiz by course ID
  static async findByCourse(courseId) {
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('course_id', courseId)
      .single();

    if (error) return null;
    return new Quiz(data);
  }

  // Find quiz by ID
  static async findById(id) {
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return new Quiz(data);
  }

  // Update quiz
  async update(updateData) {
    const { data, error } = await supabase
      .from('quizzes')
      .update(updateData)
      .eq('id', this.id)
      .select()
      .single();

    if (error) throw error;
    
    Object.assign(this, data);
    return this;
  }

  // Delete quiz
  async delete() {
    const { error } = await supabase
      .from('quizzes')
      .delete()
      .eq('id', this.id);

    if (error) throw error;
    return true;
  }

  // Calculate score for given answers
  calculateScore(answers) {
    let correctAnswers = 0;
    const totalQuestions = this.questions.length;

    this.questions.forEach((question, index) => {
      const userAnswer = answers[index];
      const correctAnswer = question.correct_answer.toString();
      
      if (userAnswer === correctAnswer) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const passed = score >= this.passing_score;

    return {
      score,
      passed,
      correct_answers: correctAnswers,
      total_questions: totalQuestions
    };
  }

  // Save quiz attempt
  async saveAttempt(userId, answers, result) {
    const { data, error } = await supabase
      .from('quiz_attempts')
      .insert([{
        user_id: userId,
        quiz_id: this.id,
        answers,
        score: result.score,
        passed: result.passed,
        attempted_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get user attempts
  async getUserAttempts(userId) {
    const { data, error } = await supabase
      .from('quiz_attempts')
      .select('*')
      .eq('quiz_id', this.id)
      .eq('user_id', userId)
      .order('attempted_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  // Validate quiz data
  static validateQuizData(quizData) {
    const { title, questions, passing_score } = quizData;
    
    if (!title || title.trim().length === 0) {
      throw new Error('Quiz title is required');
    }
    
    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      throw new Error('At least one question is required');
    }
    
    questions.forEach((question, index) => {
      if (!question.question || question.question.trim().length === 0) {
        throw new Error(`Question ${index + 1} text is required`);
      }
      
      if (!question.options || !Array.isArray(question.options) || question.options.length < 2) {
        throw new Error(`Question ${index + 1} must have at least 2 options`);
      }
      
      if (question.correct_answer === undefined || question.correct_answer === null) {
        throw new Error(`Question ${index + 1} must have a correct answer`);
      }
      
      const correctIndex = parseInt(question.correct_answer);
      if (correctIndex < 0 || correctIndex >= question.options.length) {
        throw new Error(`Question ${index + 1} correct answer index is invalid`);
      }
    });
    
    if (passing_score && (passing_score < 0 || passing_score > 100)) {
      throw new Error('Passing score must be between 0 and 100');
    }
    
    return true;
  }
}

module.exports = Quiz;