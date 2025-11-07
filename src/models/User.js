const { supabase } = require('../../config/supabase');
const bcrypt = require('bcryptjs');

class User {
  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.password = data.password;
    this.name = data.name;
    this.role = data.role || 'student';
    this.avatar_url = data.avatar_url;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Create new user
  static async create(userData) {
    const { email, password, name, role = 'student' } = userData;
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const { data, error } = await supabase
      .from('users')
      .insert([{
        email,
        password: hashedPassword,
        name,
        role,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return new User(data);
  }

  // Find user by email
  static async findByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) return null;
    return new User(data);
  }

  // Find user by ID
  static async findById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return new User(data);
  }

  // Get all users (admin only)
  static async findAll() {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, role, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(user => new User(user));
  }

  // Update user
  async update(updateData) {
    const { data, error } = await supabase
      .from('users')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', this.id)
      .select()
      .single();

    if (error) throw error;
    
    // Update current instance
    Object.assign(this, data);
    return this;
  }

  // Delete user
  async delete() {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', this.id);

    if (error) throw error;
    return true;
  }

  // Verify password
  async verifyPassword(password) {
    return await bcrypt.compare(password, this.password);
  }

  // Get user without password
  toJSON() {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }

  // Check if user has role
  hasRole(role) {
    return this.role === role;
  }

  // Check if user is instructor
  isInstructor() {
    return this.role === 'instructor';
  }

  // Check if user is admin
  isAdmin() {
    return this.role === 'admin';
  }

  // Check if user is student
  isStudent() {
    return this.role === 'student';
  }
}

module.exports = User;