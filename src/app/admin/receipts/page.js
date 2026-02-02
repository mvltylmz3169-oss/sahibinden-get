'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getReceipts, updateReceiptStatus, deleteReceipt } from '@/lib/firebaseServices';

export default function ReceiptsPage() {
  const [receipts, setReceipts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadReceipts();
  }, []);

  const loadReceipts = async () => {
    try {
      const data = await getReceipts();
      setReceipts(data);
    } catch (error) {
      console.error('Error loading receipts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateReceiptStatus(id, newStatus);
      setReceipts(receipts.map(r => 
        r.id === id ? { ...r, status: newStatus } : r
      ));
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Durum güncellenirken bir hata oluştu');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteReceipt(id);
      setReceipts(receipts.filter(r => r.id !== id));
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting receipt:', error);
      alert('Silme işlemi başarısız oldu');
    }
  };

  const filteredReceipts = filterStatus === 'all' 
    ? receipts 
    : receipts.filter(r => r.status === filterStatus);

  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Bekliyor' },
      approved: { bg: 'bg-green-100', text: 'text-green-700', label: 'Onaylandı' },
      rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Reddedildi' }
    };
    const badge = badges[status] || badges.pending;
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '-';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isImageFile = (fileName) => {
    if (!fileName) return false;
    const ext = fileName.toLowerCase().split('.').pop();
    return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dekontlar</h1>
          <p className="text-gray-600">Yüklenen ödeme dekontlarını görüntüle ve yönet</p>
        </div>
        
        {/* Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Filtre:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Tümü ({receipts.length})</option>
            <option value="pending">Bekliyor ({receipts.filter(r => r.status === 'pending').length})</option>
            <option value="approved">Onaylandı ({receipts.filter(r => r.status === 'approved').length})</option>
            <option value="rejected">Reddedildi ({receipts.filter(r => r.status === 'rejected').length})</option>
          </select>
        </div>
      </div>

      {/* Receipts Grid */}
      {filteredReceipts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900">Dekont bulunamadı</h3>
          <p className="text-gray-500 mt-1">Henüz yüklenmiş dekont yok veya filtreyle eşleşen sonuç yok.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredReceipts.map((receipt) => (
            <div key={receipt.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Preview */}
              <div 
                className="relative h-48 bg-gray-100 cursor-pointer"
                onClick={() => setSelectedReceipt(receipt)}
              >
                {isImageFile(receipt.fileName) && receipt.fileUrl ? (
                  <Image
                    src={receipt.fileUrl}
                    alt={receipt.fileName}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm text-gray-500 mt-2">PDF Dosyası</span>
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  {getStatusBadge(receipt.status)}
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <p className="font-medium text-gray-900 truncate mb-1">{receipt.fileName || 'Dekont'}</p>
                <p className="text-sm text-gray-500 mb-2">{receipt.userName || 'Bilinmeyen Kullanıcı'}</p>
                <p className="text-xs text-gray-400 mb-3">{formatDate(receipt.createdAt)}</p>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <select
                    value={receipt.status}
                    onChange={(e) => handleStatusChange(receipt.id, e.target.value)}
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="pending">Bekliyor</option>
                    <option value="approved">Onayla</option>
                    <option value="rejected">Reddet</option>
                  </select>
                  <button
                    onClick={() => setSelectedReceipt(receipt)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="Görüntüle"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(receipt.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    title="Sil"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-gray-900">{selectedReceipt.fileName || 'Dekont'}</h2>
                <p className="text-sm text-gray-500">{selectedReceipt.userName} - {formatDate(selectedReceipt.createdAt)}</p>
              </div>
              <div className="flex items-center gap-2">
                {selectedReceipt.fileUrl && (
                  <a
                    href={selectedReceipt.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    İndir / Aç
                  </a>
                )}
                <button
                  onClick={() => setSelectedReceipt(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-4 overflow-auto max-h-[calc(90vh-120px)]">
              {isImageFile(selectedReceipt.fileName) && selectedReceipt.fileUrl ? (
                <div className="relative w-full" style={{ minHeight: '400px' }}>
                  <Image
                    src={selectedReceipt.fileUrl}
                    alt={selectedReceipt.fileName}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <svg className="w-24 h-24 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-500 mb-4">PDF önizlemesi desteklenmiyor</p>
                  {selectedReceipt.fileUrl && (
                    <a
                      href={selectedReceipt.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      PDF'i Aç
                    </a>
                  )}
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-gray-500 mr-2">Durum:</span>
                  {getStatusBadge(selectedReceipt.status)}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      handleStatusChange(selectedReceipt.id, 'approved');
                      setSelectedReceipt({ ...selectedReceipt, status: 'approved' });
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Onayla
                  </button>
                  <button
                    onClick={() => {
                      handleStatusChange(selectedReceipt.id, 'rejected');
                      setSelectedReceipt({ ...selectedReceipt, status: 'rejected' });
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Reddet
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Dekontu Sil</h3>
            <p className="text-gray-600 text-center mb-6">Bu dekontu silmek istediğinizden emin misiniz?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
