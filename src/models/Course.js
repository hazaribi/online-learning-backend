const { supabase } = require('../../config/supabase');

class Course {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.price = data.price;
    this.category = data.category;
    this.thumbnail_url = data.thumbnail_url;
    this.instructor_id = data.instructor_id;
    this.status = data.status || 'draft';
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.instructor = data.instructor;
    this.lessons = data.lessons;
  }

  // Create new course
  static async create(courseData) {
    const { data, error } = await supabase
      .from('courses')
      .insert([{
        ...courseData,
        status: 'draft',
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return new Course(data);
  }

  // Get all published courses
  static async findAll() {
    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        instructor:users(name, email),
        lessons(id)
      `)
      .eq('status', 'published');

    if (error) throw error;
    
    return data.map(course => {
      const courseObj = new Course(course);
      courseObj.lesson_count = course.lessons.length;
      delete courseObj.lessons;
      return courseObj;
    });
  }

  // Find course by ID
  static async findById(id) {
    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        instructor:users(name, email),
        lessons(id, title, duration, order_index, is_free)
      `)
      .eq('id', id)
      .single();

    if (error) return null;
    return new Course(data);
  }

  // Find courses by instructor
  static async findByInstructor(instructorId) {
    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        instructor:users(name, email),
        lessons(id)
      `)
      .eq('instructor_id', instructorId);

    if (error) throw error;
    return data.map(course => new Course(course));
  }

  // Update course
  async update(updateData) {
    const { data, error } = await supabase
      .from('courses')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', this.id)
      .select()
      .single();

    if (error) throw error;
    
    Object.assign(this, data);
    return this;
  }

  // Delete course
  async delete() {
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', this.id);

    if (error) throw error;
    return true;
  }

  // Publish course
  async publish() {
    return await this.update({ status: 'published' });
  }

  // Archive course
  async archive() {
    return await this.update({ status: 'archived' });
  }

  // Check if user owns this course
  isOwnedBy(userId) {
    return this.instructor_id === userId;
  }

  // Get course lessons
  async getLessons() {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', this.id)
      .order('order_index');

    if (error) throw error;
    return data;
  }

  // Add lesson to course
  async addLesson(lessonData) {
    const { data, error } = await supabase
      .from('lessons')
      .insert([{
        ...lessonData,
        course_id: this.id,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Get enrollment count
  async getEnrollmentCount() {
    const { count, error } = await supabase
      .from('enrollments')
      .select('*', { count: 'exact', head: true })
      .eq('course_id', this.id);

    if (error) throw error;
    return count || 0;
  }

  // Get completed students for a course
  static async getCompletedStudents(courseId) {
    const { data, error } = await supabase
      .from('enrollments')
      .select(`
        id,
        progress,
        completed_at,
        student:users(id, name, email)
      `)
      .eq('course_id', courseId)
      .eq('progress', 100)
      .not('completed_at', 'is', null);

    if (error) throw error;
    
    return data.map(enrollment => ({
      id: enrollment.id,
      student_id: enrollment.student.id,
      student_name: enrollment.student.name,
      student_email: enrollment.student.email,
      progress: enrollment.progress,
      completed_at: enrollment.completed_at
    }));
  }
}

module.exports = Course;