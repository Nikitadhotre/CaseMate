import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 pt-16">
      {/* Sidebar - fixed position */}
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      {/* Main content area with dynamic margin based on sidebar state */}
      <div
        className="min-h-screen transition-all duration-300"
        style={{
          marginLeft: sidebarCollapsed ? '80px' : '280px'
        }}
      >
        {/* Page content */}
        <main className="py-8 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
