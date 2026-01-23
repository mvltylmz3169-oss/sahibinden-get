'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Delete, Download } from '@mui/icons-material';

export default function UploadsPage() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/check-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        fetchFiles();
      } else {
        setError('Yanlış şifre!');
      }
    } catch (error) {
      console.error('Şifre kontrolü sırasında hata oluştu:', error);
      setError('Bir hata oluştu, lütfen tekrar deneyin.');
    }
  };

  const fetchFiles = async () => {
    try {
      const response = await fetch('/api/uploads');
      const data = await response.json();
      setFiles(data.files);
    } catch (error) {
      console.error('Dosyalar yüklenirken hata oluştu:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchFiles();
    }
  }, [isAuthenticated]);

  const handleDelete = async (fileName) => {
    if (!confirm('Bu dosyayı silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch('/api/uploads', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          fileName,
          password: process.env.UPLOADS_PASS 
        }),
      });

      if (response.ok) {
        setFiles(files.filter(file => file.name !== fileName));
      } else {
        const data = await response.json();
        alert(data.error || 'Dosya silinirken bir hata oluştu');
      }
    } catch (error) {
      console.error('Dosya silinirken hata oluştu:', error);
      alert('Dosya silinirken bir hata oluştu');
    }
  };

  const handleDownload = (fileName) => {
    window.open(`/uploads/${fileName}`, '_blank');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-96">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Şifre Gerekli</h2>
          <form onSubmit={handlePasswordSubmit}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mb-4 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-blue-500"
              placeholder="Şifreyi girin"
            />
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition-colors"
            >
              Giriş Yap
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="p-4 bg-black text-white">Yükleniyor...</div>;
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Yüklenen Dosyalar</h1>
          <Link 
            href="/" 
            className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2"
          >
            <span>←</span>
            <span>Ana Sayfaya Dön</span>
          </Link>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {files.map((file) => (
            <div 
              key={file.name} 
              className="bg-gray-900 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              <div className="relative aspect-[3/4] group">
                {file.type.startsWith('image/') ? (
                  <Image
                    src={`/uploads/${file.name}`}
                    alt={file.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <span className="text-gray-400">PDF veya diğer dosya</span>
                  </div>
                )}
                
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleDownload(file.name)}
                    className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                    title="Dosyayı İndir"
                  >
                    <Download fontSize="small" />
                  </button>
                  
                  <button
                    onClick={() => handleDelete(file.name)}
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    title="Dosyayı Sil"
                  >
                    <Delete fontSize="small" />
                  </button>
                </div>
              </div>

              <div className="p-3">
                <p className="text-sm font-medium text-white truncate">
                  {file.name}
                </p>
                <p className="text-xs text-gray-400">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
                <a
                  href={`/uploads/${file.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-400 hover:text-blue-300 mt-1 block"
                >
                  Görüntüle
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 