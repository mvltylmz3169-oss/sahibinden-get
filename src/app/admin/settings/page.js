'use client';

import { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '@/lib/firebaseServices';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    iban: '',
    accountHolder: '',
    bank: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await getSettings();
      setSettings(data);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await updateSettings(settings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Ayarlar kaydedilirken bir hata oluştu');
    } finally {
      setIsSaving(false);
    }
  };

  const formatIban = (value) => {
    // Remove all non-alphanumeric characters
    const cleaned = value.replace(/[^A-Z0-9]/gi, '').toUpperCase();
    // Add spaces every 4 characters
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">IBAN Ayarları</h1>
        <p className="text-gray-600">Ödeme forumunda gösterilecek banka bilgilerini düzenleyin</p>
      </div>

      {/* Success Message */}
      {saveSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-green-700">Ayarlar başarıyla kaydedildi!</span>
        </div>
      )}

      {/* Settings Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="space-y-6">
          {/* IBAN */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">IBAN Numarası</label>
            <input
              type="text"
              value={settings.iban}
              onChange={(e) => setSettings({ ...settings, iban: formatIban(e.target.value) })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-mono"
              placeholder="TR00 0000 0000 0000 0000 0000 00"
            />
            <p className="text-xs text-gray-500 mt-1">IBAN otomatik olarak formatlanacaktır</p>
          </div>

          {/* Account Holder */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hesap Sahibi</label>
            <input
              type="text"
              value={settings.accountHolder}
              onChange={(e) => setSettings({ ...settings, accountHolder: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ad Soyad"
            />
          </div>

          {/* Bank */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Banka</label>
            <select
              value={settings.bank}
              onChange={(e) => setSettings({ ...settings, bank: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Banka Seçin</option>
              <option value="Akbank">Akbank</option>
              <option value="Garanti BBVA">Garanti BBVA</option>
              <option value="İş Bankası">İş Bankası</option>
              <option value="Yapı Kredi">Yapı Kredi</option>
              <option value="Ziraat Bankası">Ziraat Bankası</option>
              <option value="Halkbank">Halkbank</option>
              <option value="Vakıfbank">Vakıfbank</option>
              <option value="QNB Finansbank">QNB Finansbank</option>
              <option value="Denizbank">Denizbank</option>
              <option value="TEB">TEB</option>
              <option value="ING">ING</option>
              <option value="HSBC">HSBC</option>
              <option value="Enpara">Enpara</option>
              <option value="Papara">Papara</option>
            </select>
          </div>

          {/* Preview */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Önizleme</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">IBAN:</span>
                <span className="font-mono text-sm">{settings.iban || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Hesap Sahibi:</span>
                <span className="text-sm font-medium">{settings.accountHolder || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Banka:</span>
                <span className="text-sm">{settings.bank || '-'}</span>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Kaydediliyor...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Değişiklikleri Kaydet</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="text-sm font-medium text-blue-800">Bilgilendirme</h4>
            <p className="text-sm text-blue-700 mt-1">
              Bu IBAN bilgileri, ödeme formundaki "Ödeme" adımında kullanıcılara gösterilecektir. 
              Değişiklikler kaydedildiğinde tüm yeni form işlemlerinde güncel bilgiler görünecektir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
