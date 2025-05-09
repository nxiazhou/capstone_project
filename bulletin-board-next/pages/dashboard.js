import Sidebar from "../components/Sidebar";

export default function Dashboard() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-10">
        <h2 className="text-3xl font-bold mb-4">Dashboard</h2>
        <p>Welcome to the dashboard!</p>
      </div>
    </div>
  );
}