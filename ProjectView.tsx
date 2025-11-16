import { useState } from 'react';
import { ArrowLeft, MessageSquare, ListTodo } from 'lucide-react';
import TaskBoard from './TaskBoard';
import Chat from './Chat';

interface ProjectViewProps {
  projectId: string;
  onBack: () => void;
}

interface Project {
  id: string;
  name: string;
  description: string | null;
}

export default function ProjectView({ projectId, onBack }: ProjectViewProps) {
  const [activeTab, setActiveTab] = useState<'tasks' | 'chat'>('tasks');

  const projects = JSON.parse(localStorage.getItem('projects') || '[]') as Project[];
  const project = projects.find(p => p.id === projectId);

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-slate-600 dark:text-slate-400">Project not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{project.name}</h1>
              {project.description && (
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{project.description}</p>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'tasks'
                  ? 'bg-blue-500 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <ListTodo className="w-4 h-4" />
              <span>Tasks</span>
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'chat'
                  ? 'bg-blue-500 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'tasks' ? <TaskBoard projectId={projectId} /> : <Chat projectId={projectId} />}
      </main>
    </div>
  );
}
