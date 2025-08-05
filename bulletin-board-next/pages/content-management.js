import { useState, useEffect, useRef  } from 'react';
import Sidebar from "../components/Sidebar";

export default function ContentManagement() {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadProgress, setUploadProgress] = useState('');
  const fileInputRef = useRef(null); // ✅ 用于访问 input 元素

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/files', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();
      setFiles(data);
    } catch (err) {
      console.error('Error fetching files:', err);
      setError('Failed to load files');
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);
    setError('');
    setSuccess('');
    setUploadProgress('Uploading and reviewing file...');

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/files/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      const result = await response.json();

      // ✅ 同时判断 HTTP 和业务状态码
      if (response.ok && result.code === 200) {
        setSuccess('✅ File uploaded and approved by GPT-4o.');
        await fetchFiles();
      } else {
        setError('❌ Content review finished, content is illegal!');
        await fetchFiles();
      }
    } catch (err) {
      setError('❌ Upload failed: Network error');
    } finally {
      setIsUploading(false);
      setUploadProgress('');

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/files/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error("Delete failed");

      setSuccess('✅ File deleted successfully.');
      await fetchFiles();
    } catch (err) {
      console.error('Error deleting file:', err);
      setError('❌ Failed to delete file.');
    }
  };

  const filteredFiles = files.filter(file =>
    file.originalName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const role = typeof window !== "undefined" ? localStorage.getItem('authRole') : null;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Content Management</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        {uploadProgress && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700 mr-2"></div>
              {uploadProgress}
            </div>
          </div>
        )}

        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by file name..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <label className="relative cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
            {isUploading ? 'Reviewing...' : 'Upload File'}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileUpload}
              disabled={isUploading}
              accept="image/*,video/*"
            />
          </label>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">File Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Upload Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Preview</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFiles.map(file => (
                <tr key={file.id}>
                  <td className="px-6 py-4">{file.originalName}</td>
                  <td className="px-6 py-4">{new Date(file.uploadedAt).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <a
                      href={file.url}
                      download
                      className="text-blue-600 hover:underline"
                    >
                      Download
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    {role === 'admin' && (
                      <button
                        onClick={() => handleDelete(file.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}