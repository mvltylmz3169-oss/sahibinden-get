'use client';

import { useState, useEffect } from 'react';
import { getFormSubmissions, updateFormSubmissionStatus, deleteFormSubmission } from '@/lib/firebaseServices';

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      const data = await getFormSubmissions();
      setSubmissions(data);
    } catch (error) {
      console.error('Error loading submissions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateFormSubmissionStatus(id, newStatus);
      setSubmissions(submissions.map(s => 
        s.id === id ? { ...s, status: newStatus } : s
      ));
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Durum güncellenirken bir hata oluştu');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteFormSubmission(id);
      setSubmissions(submissions.filter(s => s.id !== id));
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting submission:', error);
      alert('Silme işlemi başarısız oldu');
    }
  };

  const filteredSubmissions = filterStatus === 'all' 
    ? submissions 
    : submissions.filter(s => s.status === filterStatus);

  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Bekliyor' },
      reviewed: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'İncelendi' },
      completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Tamamlandı' }
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
          <h1 className="text-2xl font-bold text-gray-900">Form Gönderileri</h1>
          <p className="text-gray-600">Kullanıcıların doldurduğu formları görüntüle</p>
        </div>
        
        {/* Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Filtre:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Tümü ({submissions.length})</option>
            <option value="pending">Bekliyor ({submissions.filter(s => s.status === 'pending').length})</option>
            <option value="reviewed">İncelendi ({submissions.filter(s => s.status === 'reviewed').length})</option>
            <option value="completed">Tamamlandı ({submissions.filter(s => s.status === 'completed').length})</option>
          </select>
        </div>
      </div>

      {/* Submissions List */}
      {filteredSubmissions.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900">Form gönderisi bulunamadı</h3>
          <p className="text-gray-500 mt-1">Henüz form gönderisi yok veya filtreyle eşleşen sonuç yok.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Ad Soyad</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Telefon</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Ürün</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Tarih</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Durum</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredSubmissions.map((submission) => (
                  <tr key={submission.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{submission.name} {submission.surname}</p>
                      <p className="text-sm text-gray-500">{submission.address}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{submission.phone}</td>
                    <td className="px-4 py-3">
                      <p className="text-gray-900 line-clamp-1">{submission.productTitle || '-'}</p>
                      <p className="text-sm text-gray-500">{submission.productPrice?.toLocaleString('tr-TR')} TL</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{formatDate(submission.createdAt)}</td>
                    <td className="px-4 py-3">{getStatusBadge(submission.status)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedSubmission(submission)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Detay"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(submission.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Sil"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Form Detayı</h2>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Ad</p>
                  <p className="font-medium">{selectedSubmission.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Soyad</p>
                  <p className="font-medium">{selectedSubmission.surname}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Telefon</p>
                  <p className="font-medium">{selectedSubmission.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">İl / İlçe</p>
                  <p className="font-medium">{selectedSubmission.province} / {selectedSubmission.district}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Açık Adres</p>
                <p className="font-medium">{selectedSubmission.address}</p>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <p className="text-sm text-gray-500">Ürün</p>
                <p className="font-medium">{selectedSubmission.productTitle}</p>
                <p className="text-blue-600 font-semibold">{selectedSubmission.productPrice?.toLocaleString('tr-TR')} TL</p>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <p className="text-sm text-gray-500 mb-2">Durum</p>
                <select
                  value={selectedSubmission.status}
                  onChange={(e) => {
                    handleStatusChange(selectedSubmission.id, e.target.value);
                    setSelectedSubmission({ ...selectedSubmission, status: e.target.value });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="pending">Bekliyor</option>
                  <option value="reviewed">İncelendi</option>
                  <option value="completed">Tamamlandı</option>
                </select>
              </div>

              <div className="border-t border-gray-100 pt-4 text-sm text-gray-500">
                Gönderim Tarihi: {formatDate(selectedSubmission.createdAt)}
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
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Formu Sil</h3>
            <p className="text-gray-600 text-center mb-6">Bu form gönderisini silmek istediğinizden emin misiniz?</p>
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
