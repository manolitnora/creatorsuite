import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Edit, 
  BarChart2, 
  Layout, 
  Settings,
  Activity,
  Users,
  Target
} from 'react-feather';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Content Creation', href: '/content', icon: Edit },
  { name: 'Campaigns', href: '/campaigns', icon: Target },
  { name: 'A/B Testing', href: '/ab-testing', icon: Layout },
  { name: 'Analytics', href: '/analytics', icon: BarChart2 },
  { name: 'Performance', href: '/performance', icon: Activity },
  { name: 'Team', href: '/team', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 transform bg-white dark:bg-gray-800 shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0">
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b border-gray-200 dark:border-gray-700">
        <Link href="/dashboard" className="flex items-center">
          <img
            className="h-8 w-auto"
            src="/logo.svg"
            alt="CreatorSuite"
          />
          <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
            CreatorSuite
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="mt-5 flex-1 space-y-1 px-2">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                group flex items-center px-2 py-2 text-sm font-medium rounded-md
                ${isActive
                  ? 'bg-primary-50 text-primary-600 dark:bg-primary-900 dark:text-primary-200'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                }
              `}
            >
              <Icon
                className={`
                  mr-3 h-5 w-5 flex-shrink-0
                  ${isActive
                    ? 'text-primary-600 dark:text-primary-200'
                    : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-300 dark:group-hover:text-white'
                  }
                `}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <img
              className="h-8 w-8 rounded-full"
              src="https://via.placeholder.com/32"
              alt="User"
            />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
              User Name
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              View Profile
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
