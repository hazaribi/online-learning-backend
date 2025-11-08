const { supabase } = require('../../config/supabase');

class Progress {
  constructor(data) {
    this.user_id = data.user_id;
    this.course_id = data.course_id;
    this.overall_progress = data.overall_progress || 0;
    this.enrolled_at = data.enrolled_at;
    this.completed_at = data.completed_at;
    this.lesson_progress = data.lesson_progress || [];
    this.quiz_attempts = data.quiz_attempts || [];
  }

  // Get comprehensive progress for user and course
  static async getProgress(userId, courseId) {
    try {
      // Get enrollment info
      const { data: enrollment, error: enrollmentError } = await supabase
        .from('enrollments')
        .select('progress, enrolled_at, completed_at')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .single();

      if (enrollmentError || !enrollment) {
        throw new Error('Enrollment not found');
      }

      // Get all lessons for the course
      const { data: allLessons } = await supabase
        .from('lessons')
        .select('id')
        .eq('course_id', courseId);

      // Get completed lessons count
      const { data: completedLessons } = await supabase
        .from('lesson_progress')
        .select('lesson_id')
        .eq('user_id', userId)
        .eq('completed', true)
        .in('lesson_id', allLessons?.map(l => l.id) || []);

      // Get lesson progress details
      const { data: lessonProgress } = await supabase
        .from('lesson_progress')
        .select(`
          lesson_id,
          completed,
          watched_duration,
          completed_at,
          lessons(title, duration, order_index)
        `)
        .eq('user_id', userId)
        .in('lesson_id', allLessons?.map(l => l.id) || [])
        .order('lessons(order_index)');

      // Get quiz attempts
      const { data: quizAttempts } = await supabase
        .from('quiz_attempts')
        .select(`
          id,
          quiz_id,
          score,
          passed,
          attempted_at,
          quizzes(title)
        `)
        .eq('user_id', userId)
        .in('quiz_id',
          supabase.from('quizzes').select('id').eq('course_id', courseId)
        )
        .order('attempted_at', { ascending: false });

      const totalLessons = allLessons?.length || 0;
      const completedCount = completedLessons?.length || 0;
      const completionPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

      return {
        user_id: userId,
        course_id: courseId,
        overall_progress: enrollment.progress,
        completion_percentage: completionPercentage,
        lessons_completed: completedCount,
        total_lessons: totalLessons,
        enrolled_at: enrollment.enrolled_at,
        completed_at: enrollment.completed_at,
        lesson_progress: lessonProgress || [],
        quiz_attempts: quizAttempts || []
      };
    } catch (error) {
      throw error;
    }
  }

  // Update lesson progress
  static async updateLessonProgress(userId, lessonId, progressData) {
    try {
      const { watched_duration, completed } = progressData;

      // Get lesson info
      const { data: lesson } = await supabase
        .from('lessons')
        .select('course_id, duration')
        .eq('id', lessonId)
        .single();

      if (!lesson) {
        throw new Error('Lesson not found');
      }

      // Update lesson progress
      const { error: progressError } = await supabase
        .from('lesson_progress')
        .upsert({
          user_id: userId,
          lesson_id: lessonId,
          watched_duration,
          completed,
          completed_at: completed ? new Date().toISOString() : null
        });

      if (progressError) throw progressError;

      // Recalculate overall progress
      const overallProgress = await Progress.calculateOverallProgress(userId, lesson.course_id);

      // Update enrollment
      const { error: enrollmentError } = await supabase
        .from('enrollments')
        .update({
          progress: overallProgress,
          completed_at: overallProgress === 100 ? new Date().toISOString() : null
        })
        .eq('user_id', userId)
        .eq('course_id', lesson.course_id);

      if (enrollmentError) throw enrollmentError;

      return { overall_progress: overallProgress };
    } catch (error) {
      throw error;
    }
  }

  // Calculate overall course progress
  static async calculateOverallProgress(userId, courseId) {
    try {
      // Get all lessons for the course
      const { data: allLessons } = await supabase
        .from('lessons')
        .select('id')
        .eq('course_id', courseId);

      if (!allLessons || allLessons.length === 0) {
        return 0;
      }

      // Get completed lessons
      const { data: completedLessons } = await supabase
        .from('lesson_progress')
        .select('lesson_id')
        .eq('user_id', userId)
        .eq('completed', true)
        .in('lesson_id', allLessons.map(l => l.id));

      const completedCount = completedLessons ? completedLessons.length : 0;
      return Math.round((completedCount / allLessons.length) * 100);
    } catch (error) {
      throw error;
    }
  }

  // Get user's course statistics
  static async getUserStats(userId) {
    try {
      // Get enrollment stats
      const { data: enrollments } = await supabase
        .from('enrollments')
        .select(`
          course_id,
          progress,
          completed_at,
          courses(title)
        `)
        .eq('user_id', userId);

      // Get quiz stats
      const { data: quizAttempts } = await supabase
        .from('quiz_attempts')
        .select('score, passed')
        .eq('user_id', userId);

      const totalCourses = enrollments ? enrollments.length : 0;
      const completedCourses = enrollments ? enrollments.filter(e => e.completed_at).length : 0;
      const totalQuizzes = quizAttempts ? quizAttempts.length : 0;
      const passedQuizzes = quizAttempts ? quizAttempts.filter(q => q.passed).length : 0;
      const averageScore = quizAttempts && quizAttempts.length > 0 
        ? Math.round(quizAttempts.reduce((sum, q) => sum + q.score, 0) / quizAttempts.length)
        : 0;

      return {
        total_courses: totalCourses,
        completed_courses: completedCourses,
        completion_rate: totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0,
        total_quizzes: totalQuizzes,
        passed_quizzes: passedQuizzes,
        quiz_pass_rate: totalQuizzes > 0 ? Math.round((passedQuizzes / totalQuizzes) * 100) : 0,
        average_score: averageScore,
        enrollments: enrollments || []
      };
    } catch (error) {
      throw error;
    }
  }

  // Get progress summary
  getProgressSummary() {
    const completedLessons = this.lesson_progress.filter(lp => lp.completed).length;
    const totalLessons = this.lesson_progress.length;
    const quizAttempts = this.quiz_attempts.length;
    const passedQuizzes = this.quiz_attempts.filter(qa => qa.passed).length;

    return {
      overall_progress: this.overall_progress,
      lessons_completed: completedLessons,
      total_lessons: totalLessons,
      quiz_attempts: quizAttempts,
      quizzes_passed: passedQuizzes,
      is_completed: this.completed_at !== null,
      enrolled_at: this.enrolled_at,
      completed_at: this.completed_at
    };
  }
}

module.exports = Progress;