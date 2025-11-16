import { CheckCircle2, Clock, AlertCircle, ListTodo } from 'lucide-react';

interface Task {
  id: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: string;
}

interface TaskStatsProps {
  tasks: Task[];
}

export default function TaskStats({ tasks }: TaskStatsProps) {
  const stats = {
    total: tasks.length,
    done: tasks.filter(t => t.status === 'done').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    todo: tasks.filter(t => t.status === 'todo').length,
    urgent: tasks.filter(t => t.priority === 'urgent').length,
  };

  const completionRate = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

  const statCards = [
    {
      label: 'Total Tasks',
      value: stats.total,
      icon: ListTodo,
      color: 'slate',
      bgColor: 'bg-slate-50 dark:bg-slate-800',
    },
    {
      label: 'Completed',
      value: stats.done,
      icon: CheckCircle2,
      color: 'green',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      label: 'In Progress',
      value: stats.inProgress,
      icon: Clock,
      color: 'primary',
      bgColor: 'bg-primary-50 dark:bg-primary-900/20',
    },
    {
      label: 'Urgent',
      value: stats.urgent,
      icon: AlertCircle,
      color: 'accent',
      bgColor: 'bg-accent-50 dark:bg-accent-900/20',
    },
  ];

  return (
    <div className="space-y-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={`${stat.bgColor} rounded-lg p-4 border border-slate-200 dark:border-slate-700`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                </div>
                <Icon className={`w-8 h-8 text-${stat.color}-500 opacity-75`} />
              </div>
            </div>
          );
        })}
      </div>

      {stats.total > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Completion Rate</span>
            <span className="text-sm font-bold text-primary-600 dark:text-primary-400">{completionRate}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
