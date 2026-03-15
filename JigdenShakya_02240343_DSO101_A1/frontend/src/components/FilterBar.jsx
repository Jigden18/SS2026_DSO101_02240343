'use client';
export default function FilterBar({ filters, onChange }) {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      <div className="flex items-center gap-1.5">
        <label htmlFor="status-filter" className="text-xs text-gray-500 font-medium uppercase tracking-wide">Status</label>
        <select
          id="status-filter"
          value={filters.status}
          onChange={(e) => onChange({ ...filters, status: e.target.value })}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <div className="flex items-center gap-1.5">
        <label htmlFor="priority-filter" className="text-xs text-gray-500 font-medium uppercase tracking-wide">Priority</label>
        <select
          id="priority-filter"
          value={filters.priority}
          onChange={(e) => onChange({ ...filters, priority: e.target.value })}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">All</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
    </div>
  );
}