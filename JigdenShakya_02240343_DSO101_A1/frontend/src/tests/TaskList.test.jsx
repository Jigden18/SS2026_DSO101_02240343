import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskList from '../components/TaskList';

const mockTasks = [
  { id: 1, title: 'Task One', description: 'First task', due_date: null, priority: 'high', completed: false },
  { id: 2, title: 'Task Two', description: null, due_date: '2025-06-01T00:00:00.000Z', priority: 'low', completed: true },
];

describe('TaskList', () => {
  it('renders a list of tasks', () => {
    render(<TaskList tasks={mockTasks} loading={false} onToggle={jest.fn()} onEdit={jest.fn()} onDelete={jest.fn()} />);
    expect(screen.getByText('Task One')).toBeInTheDocument();
    expect(screen.getByText('Task Two')).toBeInTheDocument();
  });

  it('shows empty state message when list is empty', () => {
    render(<TaskList tasks={[]} loading={false} onToggle={jest.fn()} onEdit={jest.fn()} onDelete={jest.fn()} />);
    expect(screen.getByText('No tasks found')).toBeInTheDocument();
  });

  it('shows loading spinner while loading', () => {
    render(<TaskList tasks={[]} loading={true} onToggle={jest.fn()} onEdit={jest.fn()} onDelete={jest.fn()} />);
    expect(screen.getByText('Loading tasks…')).toBeInTheDocument();
  });

  it('calls onEdit when Edit is clicked', () => {
    const mockEdit = jest.fn();
    render(<TaskList tasks={mockTasks} loading={false} onToggle={jest.fn()} onEdit={mockEdit} onDelete={jest.fn()} />);
    fireEvent.click(screen.getAllByRole('button', { name: /edit/i })[0]);
    expect(mockEdit).toHaveBeenCalledWith(mockTasks[0]);
  });

  it('calls onDelete when Delete is clicked', () => {
    const mockDelete = jest.fn();
    render(<TaskList tasks={mockTasks} loading={false} onToggle={jest.fn()} onEdit={jest.fn()} onDelete={mockDelete} />);
    fireEvent.click(screen.getAllByRole('button', { name: /delete/i })[0]);
    expect(mockDelete).toHaveBeenCalledWith(mockTasks[0].id);
  });
});