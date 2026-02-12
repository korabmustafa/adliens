import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '../components/admin/AdminSidebar';

export function AdminLayout() {
  return (
    <div className="mx-auto w-full max-w-[1700px] md:flex">
      <AdminSidebar />
      <main className="min-w-0 flex-1 p-4 md:p-8 xl:p-10">
        <Outlet />
      </main>
    </div>
  );
}
