import { Edit2, Mail, MapPin, Briefcase, Phone, Globe, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface UserInfoCardProps {
  onEditClick: () => void;
}

export default function UserInfoCard({ onEditClick }: UserInfoCardProps) {
  const { user } = useAuth();

  const joinDate = user?.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'N/A';

  const infoItems = [
    { icon: Mail, label: 'Email', value: user?.email },
    { icon: Briefcase, label: 'Title', value: user?.title || 'Not set' },
    { icon: Briefcase, label: 'Company', value: user?.company || 'Not set' },
    { icon: MapPin, label: 'Location', value: user?.location || 'Not set' },
    { icon: Phone, label: 'Phone', value: user?.phone || 'Not set' },
    { icon: Globe, label: 'Website', value: user?.website ? <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline">{user.website}</a> : 'Not set' },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 mb-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center flex-shrink-0">
            {user?.avatar ? (
              <img src={user.avatar} alt="Avatar" className="w-full h-full rounded-xl object-cover" />
            ) : (
              <span className="text-3xl font-bold text-white">{user?.fullName?.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{user?.fullName}</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{user?.role}</p>
            {user?.bio && <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-md">{user.bio}</p>}
          </div>
        </div>
        <button
          onClick={onEditClick}
          className="flex items-center gap-2 px-3 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
        >
          <Edit2 className="w-4 h-4" />
          <span className="hidden sm:inline">Edit</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {infoItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center gap-3">
              <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-slate-500 dark:text-slate-400">{item.label}</p>
                <p className="text-sm text-slate-900 dark:text-white truncate font-medium">{item.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
          <Calendar className="w-4 h-4" />
          <span>Joined {joinDate}</span>
        </div>
        <div className="px-3 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-medium rounded-full">
          {user?.department || 'General'}
        </div>
      </div>
    </div>
  );
}
