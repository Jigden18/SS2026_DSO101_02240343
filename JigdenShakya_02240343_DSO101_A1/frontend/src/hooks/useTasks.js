'use client';
import { useState, useEffect, useCallback } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from '../lib/taskApi';

export default function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ status: 'all', priority: '', search: '' });

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filters.status !== 'all') params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;
      if (filters.search.trim()) params.search = filters.search.trim();
      const res = await getTasks(params);
      setTasks(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch tasks.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const addTask = async (data) => {
    const res = await createTask(data);
    setTasks((prev) => [res.data.data, ...prev]);
    return res.data.data;
  };

  const editTask = async (id, data) => {
    const res = await updateTask(id, data);
    setTasks((prev) => prev.map((t) => (t.id === id ? res.data.data : t)));
    return res.data.data;
  };

  const removeTask = async (id) => {
    await deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleComplete = async (task) => {
    await editTask(task.id, { completed: !task.completed });
  };

  return { tasks, loading, error, filters, setFilters, addTask, editTask, removeTask, toggleComplete, refetch: fetchTasks };
}