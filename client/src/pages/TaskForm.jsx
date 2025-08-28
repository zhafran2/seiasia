import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { tasksAPI } from '../services/api';
import './TaskForm.css';

const TaskForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    due_date: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);

  useEffect(() => {
    if (isEditing) {
      fetchTask();
    }
  }, [id]);

  const fetchTask = async () => {
    try {
      setInitialLoading(true);
      const response = await tasksAPI.getById(id);
      const task = response.data.task;
      
      setFormData({
        title: task.title,
        description: task.description || '',
        status: task.status,
        due_date: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : ''
      });
    } catch (error) {
      setErrors({ general: 'Failed to fetch task' });
    } finally {
      setInitialLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    if (formData.due_date) {
      const dueDate = new Date(formData.due_date);
      if (isNaN(dueDate.getTime())) {
        newErrors.due_date = 'Invalid date format';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (isEditing) {
        await tasksAPI.update(id, formData);
      } else {
        await tasksAPI.create(formData);
      }
      navigate('/tasks');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to save task';
      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="task-form-container">
        <div className="loading">Loading task...</div>
      </div>
    );
  }

  return (
    <div className="task-form-container">
      <div className="task-form-card">
        <h2>{isEditing ? 'Edit Task' : 'Create New Task'}</h2>
        
        {errors.general && (
          <div className="error-message">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="task-form">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={errors.title ? 'error' : ''}
              placeholder="Enter task title"
              maxLength={100}
            />
            {errors.title && <span className="error-text">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={errors.description ? 'error' : ''}
              placeholder="Enter task description"
              rows={4}
              maxLength={500}
            />
            {errors.description && <span className="error-text">{errors.description}</span>}
            <small className="char-count">
              {formData.description.length}/500 characters
            </small>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-select"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="due_date">Due Date</label>
              <input
                type="date"
                id="due_date"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
                className={errors.due_date ? 'error' : ''}
              />
              {errors.due_date && <span className="error-text">{errors.due_date}</span>}
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/tasks')}
              className="cancel-btn"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Saving...' : (isEditing ? 'Update Task' : 'Create Task')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
