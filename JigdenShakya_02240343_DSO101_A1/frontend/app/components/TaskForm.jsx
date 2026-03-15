'use client';
import { useState, useEffect } from 'react';

const EMPTY_FORM = { title: '', description: '', due_date: '', priority: 'medium' };

export default function TaskForm({ onSubmit, editingTask, onCancel }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    if (editingTask) {
      setForm({
        title: editingTask.title || '',
        description: editingTask.description || '',
        due_date: editingTask.due_date ? editingTask.due_date.slice(0, 10) : '',
        priority: editingTask.priority || 'medium',
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
    setApiError(null);
  }, [editingTask]);

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Title is required.';
    else if (form.title.trim().length > 255) newErrors.title = 'Title must be under 255 characters.';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    setSubmitting(true);
    setApiError(null);
    try {
      await onSubmit({
        title: form.title.trim(),
        description: form.description.trim() || null,
        due_date: form.due_date || null,
        priority: form.priority,
      });
      setForm(EMPTY_FORM);
      setErrors({});
    } catch (err) {
      setApiError(err.response?.data?.message || err.message || 'Failed to save task.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4" noValidate>
      <h2 className="text-lg font-semibold text-gray-800">{editingTask ? '✏️ Edit Task' : '➕ Add New Task'}</h2>
      {apiError && <p className="text-red-500 text-sm bg-red-50 border border-red-200 px-3 py-2 rounded-lg">{apiError}</p>}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
        <input
          id="title" name="title" type="text" value={form.title} onChange={handleChange}
          placeholder="Task title"
          className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.title ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
        />
        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          id="description" name="description" value={form.description} onChange={handleChange}
          rows={3} placeholder="Optional description"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
          <input id="due_date" type="date" name="due_date" value={form.due_date} onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex-1">
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select id="priority" name="priority" value={form.priority} onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <button type="submit" disabled={submitting}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {submitting ? 'Saving…' : editingTask ? 'Update Task' : 'Add Task'}
        </button>
        {editingTask && (
          <button type="button" onClick={onCancel}
            className="px-5 py-2 rounded-lg text-sm border border-gray-300 hover:bg-gray-50 transition-colors text-gray-600"
          >Cancel</button>
        )}
      </div>
    </form>
  );
}