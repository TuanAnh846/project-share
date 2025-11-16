import { BarChart3, Users, FolderOpen, TrendingUp } from 'lucide-react';

interface Project {
  id: string;
  name: string;
}

interface Task {
  id: string;
  status: string;
}

interface ProjectStatsProps {
  projects: Project[];
  allTasks: Task[];
}

export default function ProjectStats({ projects, allTasks }: ProjectStatsProps) {
  const totalProjects = projects.length;
  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter(t => t.status === 'done').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const stats = [
    {
      label: 'Total Projects',
      value: totalProjects,
      icon: FolderOpen,
      color: 'primary',
      bgColor: 'bg-primary-50 dark:bg-primary-900/20',
    },
    {
      label: 'Total Tasks',
      value: totalTasks,
      icon: BarChart3,
      color: 'accent',
      bgColor: 'bg-accent-50 dark:bg-accent-900/20',
    },
    {
      label: 'Completed',
      value: completedTasks,
      icon: TrendingUp,
      color: 'green',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      label: 'Team Members',
      value: '0',
      icon: Users,
      color: 'blue',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
  ];

  return (
    <div className="space-y-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={`${stat.bgColor} rounded-xl p-4 border border-slate-200 dark:border-slate-700`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                </div>
                <Icon className={`w-8 h-8 text-${stat.color}-500 opacity-75`} />
              </div>
            </div>
          );
        })}
      </div>

      {totalTasks > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Overall Completion</span>
            <span className="text-sm font-bold text-primary-600 dark:text-primary-400">{completionRate}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-primary-500 to-accent-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            {completedTasks} of {totalTasks} tasks completed
          </p>
        </div>
      )}
    </div>
  );
}
