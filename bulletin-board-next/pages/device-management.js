import { useState, useEffect } from 'react';
import Sidebar from "../components/Sidebar";
import { useRouter } from 'next/router';

  // API 调用函数
  const API_BASE_URL = '/api/panels';

  const fetchPanels = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/panels', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          // 删除 Content-Type，GET 请求不需要
        }
      });

      // 先检查 HTTP 状态
      if (!response.ok) {
        // 尝试获取错误详情
        const text = await response.text();
        console.error(`API Error (${response.status}):`, text);
        
        throw new Error(`API Error ${response.status}: ${
          text.includes('<!DOCTYPE') ? 'Server Error' : text.substring(0, 50)
        }`);
      }

      // 检查响应类型
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Invalid response format: ${text.substring(0, 50)}`);
      }

      // 解析 JSON
      const result = await response.json();
      
      // 验证响应结构
      if (result?.code === 200 && Array.isArray(result.data)) {
        return result.data;
      }
      
      throw new Error(result?.message || 'Invalid response structure');
    } catch (error) {
      console.error('获取面板列表失败:', error);
      throw error; // 将错误传递给上层处理
    }
  };

  const createPanel = async (panelData) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(panelData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.code === 200) {
        return result.data;
      }
      throw new Error(result.message);
    } catch (error) {
      console.error('Error creating panel:', error);
      throw error;
    }
  };

  const updatePanel = async (id, panelData) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(panelData)
      });


      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} \n ${text}`);
      }
      const result = await response.json(); // 直接解析JSON
      if (!response.ok) throw new Error(result.message);
      if (result.code === 200) {
        return result.data;
      }
      throw new Error(result.message);
    } catch (error) {
      console.error('Error updating panel:', error);
      throw error;
    }
  };

  const deletePanel = async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      if (result.code === 200) {
        return true;
      }
      
      throw new Error(result.message);
    } catch (error) {
      console.error('Error deleting panel:', error);
      throw error;
    }
  };

export default function DeviceManagement() {
  const [panels, setPanels] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentPanel, setCurrentPanel] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [formData, setFormData] = useState({
    subscriberId: 1,
    name: '',
    location: '',
    ipAddress: '',
    macAddress: '',
    status: 'OFFLINE', // 新增默认状态
    lastHeartbeat: null // 新增心跳时间
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const role = typeof window !== "undefined" ? localStorage.getItem('authRole') : null;

  // 加载面板数据
  useEffect(() => {
    const loadPanels = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchPanels();
        setPanels(data);
      } catch (err) {
        console.error('设备加载失败:', err);
        setError(err.message || '无法加载设备列表');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPanels();
  }, []);

  const handleOpenModal = (panel = null) => {
    if (panel) {
      setCurrentPanel(panel);
      setFormData({
        subscriberId: panel.subscriberId,
        name: panel.name,
        location: panel.location,
        ipAddress: panel.ipAddress,
        macAddress: panel.macAddress,
      });
    } else {
      setCurrentPanel(null);
      setFormData({
        subscriberId: 1,
        name: '',
        location: '',
        ipAddress: '',
        macAddress: '',
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      if (currentPanel) {
        const updatedPanel = await updatePanel(currentPanel.id, formData);
        setPanels(panels.map(panel =>
          panel.id === currentPanel.id ? updatedPanel : panel
        ));
      } else {
        const newPanel = await createPanel(formData);
        setPanels([...panels, newPanel]);
      }
      setShowModal(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this device?')) {
      setIsLoading(true);
      setError(null);
      try {
        await deletePanel(id);
        setPanels(panels.filter(panel => panel.id !== id));
      } catch (error) {
        setError('Failed to delete device: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const filteredPanels = panels.filter(panel => {
    const matchesSearch = panel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         panel.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || panel.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Device Management</h1>
          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by name or location..."
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="ONLINE">Online</option>
              <option value="OFFLINE">Offline</option>
            </select>
            <button
              onClick={() => handleOpenModal()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Add Device
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MAC Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPanels.map((panel) => (
                <tr key={panel.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{panel.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{panel.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{panel.ipAddress}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{panel.macAddress}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {role === 'admin' ? (
                      <>
                        <button
                          onClick={() => handleOpenModal(panel)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Edit
                        </button>
                        <a
                          href={`/panel-player?panelId=${panel.id}`}
                          className="text-green-600 hover:underline mr-4"
                        >
                          View
                        </a>
                        <button
                          onClick={() => handleDelete(panel.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </>
                    ) : (
                      <a
                        href={`/panel-player?panelId=${panel.id}`}
                        className="text-green-600 hover:underline"
                      >
                        View
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-6">
                {currentPanel ? 'Edit Device' : 'Add Device'}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Device Name</label>
                    <input
                      type="text"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <input
                      type="text"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">IP Address</label>
                    <input
                      type="text"
                      required
                      pattern="^(\d{1,3}\.){3}\d{1,3}$"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={formData.ipAddress}
                      onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">MAC Address</label>
                    <input
                      type="text"
                      required
                      pattern="^([0-9A-Fa-f]{2}(:|-)){5}[0-9A-Fa-f]{2}$"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      value={formData.macAddress}
                      onChange={(e) => setFormData({ ...formData, macAddress: e.target.value })}
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 