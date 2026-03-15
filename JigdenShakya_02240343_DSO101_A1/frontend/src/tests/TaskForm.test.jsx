import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskForm from '../components/TaskForm';

describe('TaskForm', () => {
  it('renders all form fields', () => {
    render(<TaskForm onSubmit={jest.fn()} editingTask={null} onCancel={jest.fn()} />);
    expect(screen.getByPlaceholderText('Task title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Optional description')).toBeInTheDocument();
    expect(screen.getByLabelText(/due date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add task/i })).toBeInTheDocument();
  });

  it('shows validation error when title is empty on submit', async () => {
    render(<TaskForm onSubmit={jest.fn()} editingTask={null} onCancel={jest.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /add task/i }));
    await waitFor(() => expect(screen.getByText('Title is required.')).toBeInTheDocument());
  });

  it('calls onSubmit with correct data when title is provided', async () => {
    const mockSubmit = jest.fn().mockResolvedValue(undefined);
    render(<TaskForm onSubmit={mockSubmit} editingTask={null} onCancel={jest.fn()} />);
    fireEvent.change(screen.getByPlaceholderText('Task title'), { target: { value: 'My New Task' } });
    fireEvent.click(screen.getByRole('button', { name: /add task/i }));
    await waitFor(() => expect(mockSubmit).toHaveBeenCalledWith(expect.objectContaining({ title: 'My New Task' })));
  });

  it('renders in edit mode when editingTask is provided', () => {
    const task = { id: 1, title: 'Existing Task', description: 'Desc', due_date: null, priority: 'high' };
    render(<TaskForm onSubmit={jest.fn()} editingTask={task} onCancel={jest.fn()} />);
    expect(screen.getByDisplayValue('Existing Task')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /update task/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });
});