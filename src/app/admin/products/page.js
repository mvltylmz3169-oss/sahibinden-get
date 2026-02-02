'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getProducts, deleteProduct, addProduct, translateAllProductsSpecs } from '@/lib/firebaseServices';
import { productData } from '@/app/data/productData';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMigrating, setIsMigrating] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const firebaseProducts = await getProducts();
      setProducts(firebaseProducts);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const migrateLocalProducts = async () => {
    setIsMigrating(true);
    try {
      for (const product of productData) {
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
          }
        };
        await addProduct(productForFirebase);
      }
      await loadProducts();
      alert(`${productData.length} ürün başarıyla Firebase'e yüklendi!`);
    } catch (error) {
      console.error('Migration error:', error);
      alert('Ürünler yüklenirken bir hata oluştu: ' + error.message);
    } finally {
      setIsMigrating(false);
    }
  };

  const translateSpecsToTurkish = async () => {
    if (!confirm('Tüm ürünlerin özellik adlarını Türkçe\'ye çevirmek istediğinize emin misiniz?')) {
      return;
    }
    
    setIsTranslating(true);
    try {
      const results = await translateAllProductsSpecs();
      await loadProducts();
      alert(`Çeviri tamamlandı!\n\nGüncellenen: ${results.updated}\nAtlanan (zaten Türkçe): ${results.skipped}\nHata: ${results.errors.length}`);
    } catch (error) {
      console.error('Translation error:', error);
      alert('Çeviri sırasında bir hata oluştu: ' + error.message);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await deleteProduct(productId);
      setProducts(products.filter(p => p.id !== productId));
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Ürün silinirken bir hata oluştu');
    }
  };

  const filteredProducts = products.filter(product =>
    product.product?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.listing?.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-2xl font-bold text-gray-900">Ürün Yönetimi</h1>
          <p className="text-gray-600">Tüm ürünleri görüntüle ve düzenle</p>
        </div>
        <div className="flex gap-2">
          {products.length > 0 && (
            <button 
              onClick={translateSpecsToTurkish}
              disabled={isTranslating}
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50"
              title="İngilizce özellik adlarını Türkçe'ye çevir"
            >
              {isTranslating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  Çevriliyor...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                  TR Çevir
                </>
              )}
            </button>
          )}
          <Link href="/admin/products/new">
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Yeni Ürün Ekle
            </button>
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Ürün ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900">Ürün bulunamadı</h3>
          <p className="text-gray-500 mt-1">Henüz ürün eklenmemiş veya arama kriterinize uygun ürün yok.</p>
          <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/admin/products/new">
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Yeni Ürün Ekle
              </button>
            </Link>
            {productData.length > 0 && (
              <button
                onClick={migrateLocalProducts}
                disabled={isMigrating}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isMigrating ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Yükleniyor...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <span>Local Ürünleri Yükle ({productData.length})</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              {/* Product Image */}
              <div className="relative h-48 bg-gray-100">
                {product.product?.imagesUrls?.[0] ? (
                  <Image
                    src={product.product.imagesUrls[0]}
                    alt={product.product.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
                  {product.product?.title || 'Başlıksız Ürün'}
                </h3>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-blue-600">
                    {product.product?.price?.toLocaleString('tr-TR')} TL
                  </span>
                  <span className="text-sm text-gray-500">
                    +{product.product?.serviceFee?.toLocaleString('tr-TR')} TL hizmet
                  </span>
                </div>

                <div className="text-sm text-gray-500 mb-3">
                  <p>Satıcı: {product.seller?.name || '-'}</p>
                  <p>Konum: {product.seller?.location || '-'}</p>
                </div>

                <div className="text-xs text-gray-400 mb-4">
                  İlan No: {product.listing?.id || '-'}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Link href={`/product/${product.slug || product.id}`} className="flex-1">
                    <button className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm flex items-center justify-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Ürüne Git
                    </button>
                  </Link>
                  <Link href={`/admin/products/${product.id}`} className="flex-1">
                    <button className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center justify-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Düzenle
                    </button>
                  </Link>
                  <button
                    onClick={() => setDeleteConfirm(product.id)}
                    className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
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
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Ürünü Sil</h3>
            <p className="text-gray-600 text-center mb-6">Bu ürünü silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.</p>
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
