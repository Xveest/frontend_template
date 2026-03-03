import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      
      {/* main con margen izquierdo (ml-64) para no quedar debajo del sidebar */}
      <main className="flex-1 ml-64 p-8 transition-all">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;