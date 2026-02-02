'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { getProductById, updateProduct, uploadProductImage } from '@/lib/firebaseServices';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    slug: '',
    product: {
      title: '',
      price: 0,
      serviceFee: 0,
      imagesUrls: [],
      specs: {}
    },
    seller: {
      name: '',
      location: ''
    },
    listing: {
      id: '',
      date: '',
      category: '',
      type: 'Sahibinden'
    },
    delivery: {
      time: 'En geç 1 İş Günü içerisinde kargoya verilir',
      isFree: true,
      method: 'Ücretsiz Kargo'
    },
    securePayment: {
      title: 'S - Param Güvende',
      description: 'Güvenli alışveriş sistemi',
      returnPeriod: '2 gün',
      corporateReturnPeriod: '14 gün'
    }
  });

  const [newSpec, setNewSpec] = useState({ key: '', value: '' });

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const product = await getProductById(id);
      if (product) {
        setFormData({
          slug: product.slug || product.id,
          product: {
            title: product.product?.title || '',
            price: product.product?.price || 0,
            serviceFee: product.product?.serviceFee || 0,
            imagesUrls: product.product?.imagesUrls || [],
            specs: product.product?.specs || {}
          },
          seller: {
            name: product.seller?.name || '',
            location: product.seller?.location || ''
          },
          listing: {
            id: product.listing?.id || '',
            date: product.listing?.date || '',
            category: product.listing?.category || '',
            type: product.listing?.type || 'Sahibinden'
          },
          delivery: product.delivery || {
            time: 'En geç 1 İş Günü içerisinde kargoya verilir',
            isFree: true,
            method: 'Ücretsiz Kargo'
          },
          securePayment: product.securePayment || {
            title: 'S - Param Güvende',
            description: 'Güvenli alışveriş sistemi',
            returnPeriod: '2 gün',
            corporateReturnPeriod: '14 gün'
          }
        });
      } else {
        alert('Ürün bulunamadı');
        router.push('/admin/products');
      }
    } catch (error) {
      console.error('Error loading product:', error);
      alert('Ürün yüklenirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // Yaygın özellik önerileri (Türkçe)
  const commonSpecs = [
    { key: 'Depolama', placeholder: '128 GB' },
    { key: 'Renk', placeholder: 'Siyah' },
    { key: 'Garanti', placeholder: '2 Yıl' },
    { key: 'Durum', placeholder: 'Sıfır / İkinci El' },
    { key: 'Ekran', placeholder: '6.1 inç' },
    { key: 'İşletim Sistemi', placeholder: 'iOS / Android' },
    { key: 'Ön Kamera', placeholder: '12 MP' },
    { key: 'Arka Kamera', placeholder: '48 MP' },
    { key: 'RAM', placeholder: '8 GB' },
    { key: 'İşlemci', placeholder: 'Apple A16' },
    { key: 'Pil', placeholder: '5000 mAh' },
    { key: 'Versiyon', placeholder: 'Pro Max' },
    { key: 'Aksesuar', placeholder: 'Kutu, Şarj, Kablo' },
    { key: 'Takas', placeholder: 'Var / Yok' },
  ];

  const handleSpecChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      product: {
        ...prev.product,
        specs: {
          ...prev.product.specs,
          [key]: value
        }
      }
    }));
  };

  const handleSpecKeyChange = (oldKey, newKey) => {
    if (oldKey === newKey) return;
    const newSpecs = { ...formData.product.specs };
    const value = newSpecs[oldKey];
    delete newSpecs[oldKey];
    newSpecs[newKey] = value;
    setFormData(prev => ({
      ...prev,
      product: {
        ...prev.product,
        specs: newSpecs
      }
    }));
  };

  const handleAddSpec = () => {
    if (newSpec.key && newSpec.value) {
      handleSpecChange(newSpec.key, newSpec.value);
      setNewSpec({ key: '', value: '' });
    }
  };

  const handleRemoveSpec = (key) => {
    const newSpecs = { ...formData.product.specs };
    delete newSpecs[key];
    setFormData(prev => ({
      ...prev,
      product: {
        ...prev.product,
        specs: newSpecs
      }
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setImageUploading(true);
    try {
      const uploadPromises = files.map(file => uploadProductImage(file, id));
      const urls = await Promise.all(uploadPromises);
      
      setFormData(prev => ({
        ...prev,
        product: {
          ...prev.product,
          imagesUrls: [...prev.product.imagesUrls, ...urls]
        }
      }));
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Resim yüklenirken bir hata oluştu');
    } finally {
      setImageUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      product: {
        ...prev.product,
        imagesUrls: prev.product.imagesUrls.filter((_, i) => i !== index)
      }
    }));
  };

  const handleAddImageUrl = () => {
    const url = prompt('Resim URL\'si girin:');
    if (url) {
      setFormData(prev => ({
        ...prev,
        product: {
          ...prev.product,
          imagesUrls: [...prev.product.imagesUrls, url]
        }
      }));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProduct(id, formData);
      alert('Ürün başarıyla güncellendi');
      router.push('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Ürün kaydedilirken bir hata oluştu');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ürün Düzenle</h1>
          <p className="text-gray-600">Ürün bilgilerini güncelleyin</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => router.push('/admin/products')}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            İptal
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </div>

      {/* Product Images */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Ürün Fotoğrafları</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
          {formData.product.imagesUrls.map((url, index) => (
            <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
              <Image
                src={url}
                alt={`Ürün ${index + 1}`}
                fill
                className="object-cover"
                unoptimized
              />
              <button
                onClick={() => handleRemoveImage(index)}
                className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          
          {/* Upload Button */}
          <label className="aspect-square bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
            {imageUploading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            ) : (
              <>
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-sm text-gray-500 mt-2">Fotoğraf Ekle</span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>
        
        <button
          onClick={handleAddImageUrl}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          + URL ile fotoğraf ekle
        </button>
      </div>

      {/* Product Details */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Ürün Bilgileri</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ürün Başlığı</label>
            <input
              type="text"
              value={formData.product.title}
              onChange={(e) => handleInputChange('product', 'title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fiyat (TL)</label>
              <input
                type="number"
                value={formData.product.price}
                onChange={(e) => handleInputChange('product', 'price', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hizmet Bedeli (TL)</label>
              <input
                type="number"
                value={formData.product.serviceFee}
                onChange={(e) => handleInputChange('product', 'serviceFee', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="urun-adi-slug"
            />
            <p className="text-xs text-gray-500 mt-1">URL'de kullanılacak benzersiz tanımlayıcı</p>
          </div>
        </div>
      </div>

      {/* Product Specs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Ürün Özellikleri</h2>
        
        {Object.keys(formData.product.specs).length === 0 ? (
          <div className="text-center py-6 bg-gray-50 rounded-lg mb-4">
            <svg className="w-10 h-10 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-sm text-gray-500">Henüz özellik eklenmedi</p>
            <p className="text-xs text-gray-400 mt-1">Aşağıdan yeni özellik ekleyebilirsiniz</p>
          </div>
        ) : (
          <div className="space-y-3 mb-4">
            <div className="grid grid-cols-[1fr,1fr,auto] gap-3 text-xs text-gray-500 font-medium px-1">
              <span>Özellik Adı</span>
              <span>Değer</span>
              <span className="w-10"></span>
            </div>
            {Object.entries(formData.product.specs).map(([key, value]) => (
              <div key={key} className="flex items-center gap-3">
                <input
                  type="text"
                  value={key}
                  onChange={(e) => handleSpecKeyChange(key, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Özellik adı"
                />
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleSpecChange(key, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Değer"
                />
                <button
                  onClick={() => handleRemoveSpec(key)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  title="Özelliği sil"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add New Spec */}
        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-3">Yeni Özellik Ekle</p>
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                list="spec-suggestions"
                placeholder="Özellik adı (örn: Renk)"
                value={newSpec.key}
                onChange={(e) => setNewSpec(prev => ({ ...prev, key: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <datalist id="spec-suggestions">
                {commonSpecs.map(spec => (
                  <option key={spec.key} value={spec.key} />
                ))}
              </datalist>
            </div>
            <input
              type="text"
              placeholder="Değer (örn: Siyah)"
              value={newSpec.value}
              onChange={(e) => setNewSpec(prev => ({ ...prev, value: e.target.value }))}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={handleAddSpec}
              disabled={!newSpec.key || !newSpec.value}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Ekle
            </button>
          </div>
          
          {/* Quick Add Buttons */}
          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-2">Hızlı ekle:</p>
            <div className="flex flex-wrap gap-2">
              {commonSpecs.slice(0, 8).map(spec => (
                <button
                  key={spec.key}
                  onClick={() => setNewSpec({ key: spec.key, value: '' })}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
                >
                  + {spec.key}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Seller Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Satıcı Bilgileri</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Satıcı Adı</label>
            <input
              type="text"
              value={formData.seller.name}
              onChange={(e) => handleInputChange('seller', 'name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Konum</label>
            <input
              type="text"
              value={formData.seller.location}
              onChange={(e) => handleInputChange('seller', 'location', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Şehir / İlçe / Mahalle"
            />
          </div>
        </div>
      </div>

      {/* Listing Details */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">İlan Detayları</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">İlan No</label>
            <input
              type="text"
              value={formData.listing.id}
              onChange={(e) => handleInputChange('listing', 'id', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">İlan Tarihi</label>
            <input
              type="text"
              value={formData.listing.date}
              onChange={(e) => handleInputChange('listing', 'date', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="01 Şubat 2026"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
            <input
              type="text"
              value={formData.listing.category}
              onChange={(e) => handleInputChange('listing', 'category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="İkinci El ve Sıfır Alışveriş > Elektronik Eşya > ..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
            <select
              value={formData.listing.type}
              onChange={(e) => handleInputChange('listing', 'type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Sahibinden">Sahibinden</option>
              <option value="Letgo">Letgo</option>
            </select>
          </div>
        </div>
      </div>

      {/* Save Button (Bottom) */}
      <div className="flex justify-end gap-3 pb-6">
        <button
          onClick={() => router.push('/admin/products')}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          İptal
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isSaving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
        </button>
      </div>
    </div>
  );
}
