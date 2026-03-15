'use client';
import TaskItem from './TaskItem';

export default function TaskList({ tasks, loading, onToggle, onEdit, onDelete }) {
  if (loading) {
    return (
      <div className="text-center py-12 text-gray-400">
        <div className="animate-spin inline-block w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full mb-3" />
        <p className="text-sm">Loading tasks…</p>
      </div>
    );
  }
  if (tasks.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-4xl mb-3">📭</p>
        <p className="text-lg font-medium text-gray-500">No tasks found</p>
        <p className="text-sm mt-1">Add a task above or adjust your filters.</p>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}