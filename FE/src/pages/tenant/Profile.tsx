export default function TenantSelfProfile() {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-bold">My Profile</h1>
        <form className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium">Full Name</label>
            <input type="text" className="border px-3 py-2 rounded w-full" value="John Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input type="email" className="border px-3 py-2 rounded w-full" value="john@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium">Mobile</label>
            <input type="text" className="border px-3 py-2 rounded w-full" value="9876543210" />
          </div>
          <button className="bg-black text-white px-4 py-2 rounded">Save Changes</button>
        </form>
      </div>
    );
  }
  