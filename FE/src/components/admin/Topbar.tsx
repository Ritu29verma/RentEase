export default function Topbar() {
    return (
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Tenant Rent Management</h1>
        <div className="text-sm flex items-center gap-3">
          <span>Admin</span>
          <button className="text-blue-500 hover:underline">Logout</button>
        </div>
      </header>
    );
  }