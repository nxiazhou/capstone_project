import { useState, useEffect } from 'react';
import Sidebar from "../components/Sidebar";
import { useRouter } from 'next/router';

export default function PanelView() {
  const [panels, setPanels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchPanels = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('/api/panels', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch panels');
        const result = await response.json();
        setPanels(result.data || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch panels');
      } finally {
        setLoading(false);
      }
    };
    fetchPanels();
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Panel View</h1>
        {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Panel Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">IP Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">MAC Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center py-6">Loading...</td></tr>
              ) : panels.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-6 text-gray-400">No panels found.</td></tr>
              ) : (
                panels.map(panel => (
                  <tr key={panel.id}>
                    <td className="px-6 py-4">{panel.name}</td>
                    <td className="px-6 py-4">{panel.location}</td>
                    <td className="px-6 py-4">{panel.ipAddress}</td>
                    <td className="px-6 py-4">{panel.macAddress}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => router.push(`/panel-player?panelId=${panel.id}`)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 