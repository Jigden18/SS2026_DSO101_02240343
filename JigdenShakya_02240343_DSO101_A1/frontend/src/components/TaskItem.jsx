'use client';
const PRIORITY_STYLES = {
  high: 'bg-red-100 text-red-700 border-red-200',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  low: 'bg-green-100 text-green-700 border-green-200',
};

function formatDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function isOverdue(dateStr, completed) {
  if (!dateStr || completed) return false;
  return new Date(dateStr) < new Date();
}

export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const overdue = isOverdue(task.due_date, task.completed);
  return (
    <div className={`bg-white border rounded-xl p-4 shadow-sm transition-all hover:shadow-md ${task.completed ? 'opacity-60' : ''} ${overdue ? 'border-l-4 border-l-red-400' : 'border-gray-200'}`}>
      <div className="flex items-start gap-3">
        <input type="checkbox" checked={task.completed} onChange={() => onToggle(task)}
          className="mt-1 w-4 h-4 accent-blue-600 cursor-pointer shrink-0"
          aria-label={`Mark "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className={`font-medium ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>{task.title}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.medium}`}>{task.priority}</span>
            {task.completed && <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200">done</span>}
          </div>
          {task.description && <p className="text-sm text-gray-500 mt-1 line-clamp-2">{task.description}</p>}
          {task.due_date && (
            <p className={`text-xs mt-1 ${overdue ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
              📅 {overdue ? 'Overdue: ' : 'Due: '}{formatDate(task.due_date)}
            </p>
          )}
        </div>
        <div className="flex gap-1 shrink-0">
          <button onClick={() => onEdit(task)} className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-600" aria-label={`Edit "${task.title}"`}>Edit</button>
          <button onClick={() => onDelete(task.id)} className="text-xs px-3 py-1.5 border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-red-600" aria-label={`Delete "${task.title}"`}>Delete</button>
        </div>
      </div>
    </div>
  );
}