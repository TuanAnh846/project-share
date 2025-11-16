import { useState, useEffect } from 'react';
import { Plus, Circle, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import CreateTaskModal from './CreateTaskModal';
import TaskCard from './TaskCard';
import TaskStats from './TaskStats';
import TaskFilters from './TaskFilters';

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date: string | null;
  created_at: string;
}

interface TaskBoardProps {
  projectId: string;
}

const columns = [
  { id: 'todo', label: 'To Do', icon: Circle, color: 'slate' },
  { id: 'in_progress', label: 'In Progress', icon: Clock, color: 'blue' },
  { id: 'review', label: 'Review', icon: AlertCircle, color: 'amber' },
  { id: 'done', label: 'Done', icon: CheckCircle2, color: 'green' },
] as const;

export default function TaskBoard({ projectId }: TaskBoardProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  useEffect(() => {
    const savedTasks = localStorage.getItem(`tasks-${projectId}`);
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, [projectId]);

  const saveTasks = (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
    localStorage.setItem(`tasks-${projectId}`, JSON.stringify(updatedTasks));
  };

  const handleTaskCreated = (newTask: Task) => {
    setShowCreateModal(false);
    saveTasks([newTask, ...tasks]);
  };

  const handleStatusChange = (taskId: string, newStatus: Task['status']) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    saveTasks(updatedTasks);
  };

  const handleTaskDelete = (taskId: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    saveTasks(updatedTasks);
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesPriority = !priorityFilter || task.priority === priorityFilter;
    const matchesStatus = !statusFilter || task.status === statusFilter;

    return matchesSearch && matchesPriority && matchesStatus;
  });

  const hasActiveFilters = searchQuery || priorityFilter || statusFilter;

  const handleClearFilters = () => {
    setSearchQuery('');
    setPriorityFilter(null);
    setStatusFilter(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Task Board</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white rounded-lg transition-all duration-200 shadow-lg shadow-primary-500/30"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      <TaskStats tasks={tasks} />

      <TaskFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        priorityFilter={priorityFilter}
        onPriorityChange={setPriorityFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={handleClearFilters}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((column) => {
          const columnTasks = filteredTasks.filter((task) => task.status === column.id);
          const Icon = column.icon;

          return (
            <div key={column.id} className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-4">
                <Icon className={`w-5 h-5 text-${column.color}-500`} />
                <h3 className="font-semibold text-slate-900 dark:text-white">{column.label}</h3>
                <span className="ml-auto text-sm text-slate-500 dark:text-slate-400">{columnTasks.length}</span>
              </div>

              <div className="space-y-3">
                {columnTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onStatusChange={handleStatusChange}
                    onDelete={handleTaskDelete}
                  />
                ))}
                {columnTasks.length === 0 && (
                  <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-8">No tasks</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showCreateModal && (
        <CreateTaskModal projectId={projectId} onClose={() => setShowCreateModal(false)} onCreated={handleTaskCreated} />
      )}
    </div>
  );
}
