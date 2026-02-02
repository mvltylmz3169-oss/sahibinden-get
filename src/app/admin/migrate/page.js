'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { productData } from '@/app/data/productData';

export default function MigratePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [results, setResults] = useState([]);

  const migrateProducts = async () => {
    setIsLoading(true);
    setStatus('Ürünler taşınıyor...');
    setResults([]);

    try {
      const productsRef = collection(db, 'products');
      
      // Check if products already exist
      const existingProducts = await getDocs(productsRef);
      if (existingProducts.size > 0) {
        const confirm = window.confirm(
          `Firestore'da zaten ${existingProducts.size} ürün var. Yine de devam etmek istiyor musunuz? (Mevcut ürünler silinmeyecek)`
        );
        if (!confirm) {
          setIsLoading(false);
          setStatus('İşlem iptal edildi.');
          return;
        }
      }

      const migrationResults = [];

      for (const product of productData) {
        try {
          // Prepare product data for Firebase (remove getter functions)
          const productForFirebase = {
            slug: product.id,
            product: {
              title: product.product.title,
              price: product.product.price,
              serviceFee: product.product.serviceFee,
              imagesUrls: product.product.imagesUrls,
              specs: product.product.specs || {}
            },
            seller: product.seller,
            listing: product.listing,
            delivery: product.delivery,
            securePayment: {
              title: product.securePayment.title,
              description: product.securePayment.description,
              returnPeriod: product.securePayment.returnPeriod,
              corporateReturnPeriod: product.securePayment.corporateReturnPeriod,
              info: product.securePayment.info || []
            },
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          };

          const docRef = await addDoc(productsRef, productForFirebase);
          
          migrationResults.push({
            success: true,
            title: product.product.title,
            id: docRef.id
          });
          
          setStatus(`${migrationResults.length}/${productData.length} ürün taşındı...`);
        } catch (error) {
          migrationResults.push({
            success: false,
            title: product.product.title,
            error: error.message
          });
        }
      }

      setResults(migrationResults);
      const successCount = migrationResults.filter(r => r.success).length;
      setStatus(`Tamamlandı! ${successCount}/${productData.length} ürün başarıyla taşındı.`);
    } catch (error) {
      setStatus(`Hata: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const initializeSettings = async () => {
    setIsLoading(true);
    setStatus('IBAN ayarları oluşturuluyor...');

    try {
      const { setDoc, doc } = await import('firebase/firestore');
      
      await setDoc(doc(db, 'settings', 'general'), {
        iban: 'TR 0004 6012 7788 8000 0658 94',
        accountHolder: 'Yasin Mercan',
        bank: 'Akbank',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      setStatus('IBAN ayarları başarıyla oluşturuldu!');
    } catch (error) {
      setStatus(`Hata: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Veri Taşıma</h1>
        <p className="text-gray-600">Mevcut verileri Firebase'e taşıyın</p>
      </div>

      {/* Warning Box */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex gap-3">
          <svg className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <h4 className="text-sm font-medium text-yellow-800">Dikkat</h4>
            <p className="text-sm text-yellow-700 mt-1">
              Bu işlem mevcut productData.js dosyasındaki ürünleri Firebase Firestore'a taşır.
              İşlem sadece bir kez yapılmalıdır. Tekrar çalıştırırsanız aynı ürünler tekrar eklenebilir.
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">İşlemler</h2>
        
        {/* Migrate Products */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900">Ürünleri Taşı</h3>
            <p className="text-sm text-gray-500">productData.js'den Firebase'e ({productData.length} ürün)</p>
          </div>
          <button
            onClick={migrateProducts}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'İşleniyor...' : 'Taşı'}
          </button>
        </div>

        {/* Initialize Settings */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="font-medium text-gray-900">IBAN Ayarlarını Oluştur</h3>
            <p className="text-sm text-gray-500">Varsayılan IBAN bilgilerini Firebase'e ekle</p>
          </div>
          <button
            onClick={initializeSettings}
            disabled={isLoading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {isLoading ? 'İşleniyor...' : 'Oluştur'}
          </button>
        </div>
      </div>

      {/* Status */}
      {status && (
        <div className={`p-4 rounded-lg ${
          status.includes('Hata') ? 'bg-red-50 text-red-700' :
          status.includes('Tamamlandı') || status.includes('başarıyla') ? 'bg-green-50 text-green-700' :
          'bg-blue-50 text-blue-700'
        }`}>
          {status}
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Sonuçlar</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {results.map((result, index) => (
              <div
                key={index}
                className={`flex items-center gap-2 p-2 rounded ${
                  result.success ? 'bg-green-50' : 'bg-red-50'
                }`}
              >
                {result.success ? (
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                <span className={`text-sm ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                  {result.title}
                  {result.error && ` - ${result.error}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
