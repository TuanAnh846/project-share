import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { LogOut, Moon, Sun, Plus, FolderKanban, User } from "lucide-react";
import ProjectList from "./ProjectList";
import ProjectView from "./ProjectView";
import CreateProjectModal from "./CreateProjectModal";
import ProfileModal from "./ProfileModal";
import ProjectStats from "./ProjectStats";

interface Project {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

interface Task {
  id: string;
  status: string;
}

export default function Dashboard() {
  const { signOut, user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedProjects = localStorage.getItem("projects");
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
  }, []);

  const getAllTasks = (): Task[] => {
    const allTasks: Task[] = [];
    projects.forEach((project) => {
      const projectTasks = localStorage.getItem(`tasks-${project.id}`);
      if (projectTasks) {
        allTasks.push(...JSON.parse(projectTasks));
      }
    });
    return allTasks;
  };

  const saveProjects = (updatedProjects: Project[]) => {
    setProjects(updatedProjects);
    localStorage.setItem("projects", JSON.stringify(updatedProjects));
  };

  const handleProjectCreated = (newProject: Project) => {
    setShowCreateModal(false);
    saveProjects([newProject, ...projects]);
  };

  const handleProjectSelect = (projectId: string) => {
    setSelectedProject(projectId);
  };

  const handleBackToProjects = () => {
    setSelectedProject(null);
  };

  const handleProfileUpdate = () => {
    window.location.reload();
  };

  if (selectedProject) {
    return (
      <ProjectView projectId={selectedProject} onBack={handleBackToProjects} />
    );
  }

  // Check what info is missing
  const missingFields: string[] = [];
  if (!user?.fullName || user.fullName.trim() === "")
    missingFields.push("full name");
  if (!user?.avatar) missingFields.push("profile picture");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                <FolderKanban className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                TaskFlow
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowProfileModal(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group"
                title="Edit profile"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Avatar"
                      className="w-full h-full rounded-lg object-cover"
                    />
                  ) : (
                    <User className="w-4 h-4 text-white" />
                  )}
                </div>
                <span className="hidden sm:inline text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                  {user?.fullName?.split(" ")[0] || "User"}
                </span>
              </button>

              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <Sun className="w-5 h-5 text-slate-400" />
                ) : (
                  <Moon className="w-5 h-5 text-slate-600" />
                )}
              </button>
              <button
                onClick={signOut}
                className="flex items-center gap-2 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 🔔 Notification about missing info */}
        {missingFields.length > 0 && (
          <div className="mb-6 p-4 rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800 text-amber-700 dark:text-amber-400 flex items-center justify-between">
            <div>
              <p className="font-medium">
                You haven’t provided your {missingFields.join(" and ")} yet.
              </p>
              <p className="text-sm mt-1 text-amber-600 dark:text-amber-300">
                Please complete your profile to unlock all features.
              </p>
            </div>
            <button
              onClick={() => setShowProfileModal(true)}
              className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-md text-sm font-medium transition"
            >
              Complete Profile
            </button>
          </div>
        )}

        <ProjectStats projects={projects} allTasks={getAllTasks()} />

        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Your Projects
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Manage your projects and collaborate with your team
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white rounded-lg transition-all duration-200 shadow-lg shadow-primary-500/30"
          >
            <Plus className="w-5 h-5" />
            <span>New Project</span>
          </button>
        </div>

        <ProjectList
          projects={projects}
          loading={loading}
          onSelectProject={handleProjectSelect}
        />
      </main>

      {showCreateModal && (
        <CreateProjectModal
          onClose={() => setShowCreateModal(false)}
          onCreated={handleProjectCreated}
        />
      )}

      {showProfileModal && (
        <ProfileModal
          onClose={() => setShowProfileModal(false)}
          onUpdate={handleProfileUpdate}
        />
      )}
    </div>
  );
}
