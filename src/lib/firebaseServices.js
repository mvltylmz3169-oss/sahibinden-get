// Firebase Services - CRUD Operations
import { db, storage } from './firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  setDoc
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  listAll 
} from 'firebase/storage';

// ==================== PRODUCTS ====================

// Get all products
export const getProducts = async () => {
  try {
    const productsRef = collection(db, 'products');
    const q = query(productsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      // Calculate totalPrice
      product: {
        ...doc.data().product,
        get totalPrice() {
          return (this.price || 0) + (this.serviceFee || 0);
        }
      }
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

// Get single product by ID
export const getProductById = async (productId) => {
  try {
    const docRef = doc(db, 'products', productId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return { 
        id: docSnap.id, 
        ...data,
        product: {
          ...data.product,
          get totalPrice() {
            return (this.price || 0) + (this.serviceFee || 0);
          }
        }
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};

// Get product by slug (the URL-friendly ID)
export const getProductBySlug = async (slug) => {
  try {
    const productsRef = collection(db, 'products');
    const snapshot = await getDocs(productsRef);
    const product = snapshot.docs.find(doc => doc.data().slug === slug);
    if (product) {
      const data = product.data();
      return { 
        id: product.id, 
        ...data,
        product: {
          ...data.product,
          get totalPrice() {
            return (this.price || 0) + (this.serviceFee || 0);
          }
        }
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return null;
  }
};

// Add new product
export const addProduct = async (productData) => {
  try {
    const productsRef = collection(db, 'products');
    const docRef = await addDoc(productsRef, {
      ...productData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, ...productData };
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

// Update product
export const updateProduct = async (productId, productData) => {
  try {
    const docRef = doc(db, 'products', productId);
    await updateDoc(docRef, {
      ...productData,
      updatedAt: serverTimestamp()
    });
    return { id: productId, ...productData };
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// Delete product
export const deleteProduct = async (productId) => {
  try {
    const docRef = doc(db, 'products', productId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// ==================== FORM SUBMISSIONS ====================

// Get all form submissions
export const getFormSubmissions = async () => {
  try {
    const submissionsRef = collection(db, 'formSubmissions');
    const q = query(submissionsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching form submissions:', error);
    return [];
  }
};

// Add form submission
export const addFormSubmission = async (submissionData) => {
  try {
    const submissionsRef = collection(db, 'formSubmissions');
    const docRef = await addDoc(submissionsRef, {
      ...submissionData,
      createdAt: serverTimestamp(),
      status: 'pending' // pending, reviewed, completed
    });
    return { id: docRef.id, ...submissionData };
  } catch (error) {
    console.error('Error adding form submission:', error);
    throw error;
  }
};

// Update form submission status
export const updateFormSubmissionStatus = async (submissionId, status) => {
  try {
    const docRef = doc(db, 'formSubmissions', submissionId);
    await updateDoc(docRef, { status, updatedAt: serverTimestamp() });
    return true;
  } catch (error) {
    console.error('Error updating form submission:', error);
    throw error;
  }
};

// Delete form submission
export const deleteFormSubmission = async (submissionId) => {
  try {
    const docRef = doc(db, 'formSubmissions', submissionId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting form submission:', error);
    throw error;
  }
};

// ==================== RECEIPTS (DEKONT) ====================

// Get all receipts
export const getReceipts = async () => {
  try {
    const receiptsRef = collection(db, 'receipts');
    const q = query(receiptsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching receipts:', error);
    return [];
  }
};

// Add receipt
export const addReceipt = async (receiptData) => {
  try {
    const receiptsRef = collection(db, 'receipts');
    const docRef = await addDoc(receiptsRef, {
      ...receiptData,
      createdAt: serverTimestamp(),
      status: 'pending' // pending, approved, rejected
    });
    return { id: docRef.id, ...receiptData };
  } catch (error) {
    console.error('Error adding receipt:', error);
    throw error;
  }
};

// Update receipt status
export const updateReceiptStatus = async (receiptId, status) => {
  try {
    const docRef = doc(db, 'receipts', receiptId);
    await updateDoc(docRef, { status, updatedAt: serverTimestamp() });
    return true;
  } catch (error) {
    console.error('Error updating receipt:', error);
    throw error;
  }
};

// Delete receipt
export const deleteReceipt = async (receiptId) => {
  try {
    const docRef = doc(db, 'receipts', receiptId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting receipt:', error);
    throw error;
  }
};

// ==================== SETTINGS (IBAN) ====================

// Get settings
export const getSettings = async () => {
  try {
    const docRef = doc(db, 'settings', 'general');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    // Default settings
    return {
      iban: 'TR 0004 6012 7788 8000 0658 94',
      accountHolder: 'Yasin Mercan',
      bank: 'Akbank'
    };
  } catch (error) {
    console.error('Error fetching settings:', error);
    return {
      iban: 'TR 0004 6012 7788 8000 0658 94',
      accountHolder: 'Yasin Mercan',
      bank: 'Akbank'
    };
  }
};

// Update settings
export const updateSettings = async (settingsData) => {
  try {
    const docRef = doc(db, 'settings', 'general');
    await setDoc(docRef, {
      ...settingsData,
      updatedAt: serverTimestamp()
    }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error updating settings:', error);
    throw error;
  }
};

// ==================== STORAGE (Images) ====================

// Upload product image
export const uploadProductImage = async (file, productId) => {
  try {
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name}`;
    const storageRef = ref(storage, `products/${productId}/${fileName}`);
    
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Upload receipt file
export const uploadReceiptFile = async (file, submissionId) => {
  try {
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name}`;
    const storageRef = ref(storage, `receipts/${submissionId}/${fileName}`);
    
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading receipt:', error);
    throw error;
  }
};

// Delete file from storage
export const deleteStorageFile = async (fileUrl) => {
  try {
    const storageRef = ref(storage, fileUrl);
    await deleteObject(storageRef);
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

// Get all files in a folder
export const getStorageFiles = async (folderPath) => {
  try {
    const folderRef = ref(storage, folderPath);
    const result = await listAll(folderRef);
    
    const files = await Promise.all(
      result.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        return {
          name: itemRef.name,
          url,
          fullPath: itemRef.fullPath
        };
      })
    );
    
    return files;
  } catch (error) {
    console.error('Error listing files:', error);
    return [];
  }
};
