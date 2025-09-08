"use client";

import { useRouter, usePathname } from 'next/navigation';

interface NavItem {
  name: string;
  href: string;
  current: boolean;
  isTab?: boolean;
}

export default function AdminNavbar() {
  const router = useRouter();
  const pathname = usePathname();

  const navigation: NavItem[] = [
    { name: 'Feature Toggles', href: '/admin/manage/toggles', current: pathname === '/admin/manage/toggles' },
    { name: 'Analytics', href: '/admin/manage/analytics', current: pathname === '/admin/manage/analytics' },
    { name: 'Comments', href: '/admin/manage/comments', current: pathname === '/admin/manage/comments' },
  ];

  const handleNavigation = (href: string) => {
    if (href.startsWith('/admin/manage?')) {
      // Handle tab switching within the same page
      const url = new URL(window.location.href);
      const tab = new URLSearchParams(href.split('?')[1]).get('tab');
      if (tab) {
        url.searchParams.set('tab', tab);
        window.history.pushState({}, '', url.toString());
        // Trigger a custom event to notify the page component
        window.dispatchEvent(new CustomEvent('tabChange', { detail: { tab } }));
      }
    } else {
      router.push(href);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    router.push('/admin');
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">NZLouis Blog Admin</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex space-x-4">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className={`px-3 py-2 text-sm rounded-md ${
                    item.current
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
            <button
              onClick={handleLogout}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}