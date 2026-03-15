'use client';
import { useState } from 'react';
import useTasks from './hooks/useTasks';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import SearchBar from './components/SearchBar';
import FilterBar from './components/FilterBar';

export default function HomePage() {
  const { tasks, loading, error, filters, setFilters, addTask, editTask, removeTask, toggleComplete } = useTasks();
  const [editingTask, setEditingTask] = useState(null);

  const handleSubmit = async (data) => {
    if (editingTask) {
      await editTask(editingTask.id, data);
      setEditingTask(null);
    } else {
      await addTask(data);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try { await removeTask(id); }
    catch { alert('Failed to delete task. Please try again.'); }
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">📝 Todo List</h1>
        <p className="text-gray-500 mt-1 text-sm">Stay organised. Get things done.</p>
        {totalCount > 0 && <p className="text-xs text-gray-400 mt-2">{completedCount} / {totalCount} tasks completed</p>}
      </header>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">⚠️ {error}</div>
      )}

      <TaskForm onSubmit={handleSubmit} editingTask={editingTask} onCancel={() => setEditingTask(null)} />

      <div className="mt-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <SearchBar value={filters.search} onChange={(val) => setFilters((f) => ({ ...f, search: val }))} />
          </div>
          <FilterBar filters={filters} onChange={setFilters} />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">{totalCount} task{totalCount !== 1 ? 's' : ''} found</span>
          {(filters.status !== 'all' || filters.priority || filters.search) && (
            <button onClick={() => setFilters({ status: 'all', priority: '', search: '' })} className="text-xs text-blue-500 hover:underline">Clear filters</button>
          )}
        </div>
        <TaskList
          tasks={tasks} loading={loading}
          onToggle={toggleComplete}
          onEdit={(task) => { setEditingTask(task); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          onDelete={handleDelete}
        />
      </div>
    </main>
  );
}