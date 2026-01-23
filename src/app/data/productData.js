export const productData = [

  {
    id: "1",
    // Ürün Detayları
    product: {
      title: "iPhone 15 promax 256 GB kutu fatura şarj mevcut",
      price: 41000,
      serviceFee: 450, // Hizmet bedeli
      get totalPrice() {
          return this.price + this.serviceFee;
      }, // Toplam fiyat (price + serviceFee)

      imagesUrls: [
        "https://ik.imagekit.io/nsnnosdo1/iphone.jpg?updatedAt=1744387783440",
        "https://ik.imagekit.io/nsnnosdo1/WhatsApp%20Image%202025-03-31%20at%2019.20.15%20(5).jpeg?updatedAt=1744388175045",
        "https://ik.imagekit.io/nsnnosdo1/WhatsApp%20Image%202025-03-31%20at%2019.20.15%20(1).jpeg?updatedAt=1744388174985",
        "https://ik.imagekit.io/nsnnosdo1/WhatsApp%20Image%202025-03-31%20at%2019.20.15%20(2).jpeg?updatedAt=1744388174772",
      ],
    
      specs: {
        storage: "256 GB",
        os: "iOS",
        frontCamera: "12 Mp",
        backCamera: "12 Mp",
        color: "Titanyum",
        warranty: "Distribütör Garanti",
        screen: "48 Mp",
        trade: "Yok"
      }
    },

    // Satıcı Bilgileri
    seller: {
      name: "Veyis Aydın",
      location: "Bursa / Gemlik / Kumla Mahallesi",
    },

    // İlan Detayları
    listing: {
      id: "323847328",
      date: "31 Mart 2025",
      category: "İkinci El ve Sıfır Alışveriş > Elektronik Eşya > Telefon > iPhone 15 Pro Max Türkiye Cihaz",
      type: "Sahibinden"
    },

    // Teslimat Bilgileri
    delivery: {
      time: "En geç 1 İş Günü içerisinde kargoya verilir",
      isFree: true,
      method: "Ücretsiz Kargo"
    },

    // Param Güvende Bilgileri
    securePayment: {
      title: "S - Param Güvende",
      description: "Güvenli alışveriş sistemi",
      returnPeriod: "2 gün",
      corporateReturnPeriod: "14 gün",
      info: [
        {
          title: "S - Param Güvende Nedir ?",
          description: "S - Param Güvende ile bireysel satıcıdan satın aldığınız ürün için, size ulaştıktan sonra 2 gün içerisinde iade talebinde bulunabilirsiniz..."
        },
        {
          title: "Ürün tutarı satıcının hesabına ne zaman gönderilir?",
          description: "Alıcı ürünü onayladıktan sonra ürün tutarı satıcı hesabına gönderilir..."
        },
        // Diğer bilgiler...
      ]
    }
  },
  
  //İphone 11 
  {
    id: "iphone-11-pro-256-gb-tr-cihaz-kutu-fatura-sarj-mevcut-s-get-id-25032025122835-4980",
    // Ürün Detayları
    product: {
      title: "İphone 11 TR Cihaz Fatura Kutu Mevcut Biraz Acil",
      price: 10200,
      serviceFee: 175, // Hizmet bedeli
      get totalPrice() {
          return this.price + this.serviceFee;
      }, // Toplam fiyat (price + serviceFee)

      imagesUrls: [
        "https://ik.imagekit.io/nsnnosdo1/WhatsApp%20Image%202025-03-31%20at%2019.20.15%20(7).jpeg?updatedAt=1745589104156",
        "https://ik.imagekit.io/nsnnosdo1/WhatsApp%20Image%202025-03-31%20at%2019.20.15%20(11).jpeg?updatedAt=1745589104356",
        "https://ik.imagekit.io/nsnnosdo1/WhatsApp%20Image%202025-03-31%20at%2019.20.15%20(9).jpeg?updatedAt=1745589104373",
        "https://ik.imagekit.io/nsnnosdo1/WhatsApp%20Image%202025-03-31%20at%2019.20.15%20(6).jpeg?updatedAt=1745589104389",
        "https://ik.imagekit.io/nsnnosdo1/WhatsApp%20Image%202025-03-31%20at%2019.20.15%20(8).jpeg?updatedAt=1745589104441",
        "https://ik.imagekit.io/nsnnosdo1/WhatsApp%20Image%202025-03-31%20at%2019.20.15%20(10).jpeg?updatedAt=1745589104525",
        "https://ik.imagekit.io/nsnnosdo1/x16_1191642411xxc.jpg?updatedAt=1745589104463",
      ],
    
      specs: {
        storage: "128 GB",
        os: "iOS",
        frontCamera: "12 Mp",
        backCamera: "12 Mp",
        color: "Titanyum",
        warranty: "Distribütör Garanti",
        screen: "48 Mp",
        trade: "Yok"
      }
    },

    // Satıcı Bilgileri
    seller: {
      name: "Cengizhan İçin Örnek",
      location: "Kastamonu / Merkez",
    },

    // İlan Detayları
    listing: {
      id: "1248362802",
      date: "24 Mayıs 2025",
      category: "İkinci El ve Sıfır Alışveriş > Elektronik Eşya > Telefon > iPhone 11 Türkiye Cihaz",
      type: "Sahibinden"
    },

    // Teslimat Bilgileri
    delivery: {
      time: "En geç 1 İş Günü içerisinde kargoya verilir",
      isFree: true,
      method: "Ücretsiz Kargo"
    },

    // Param Güvende Bilgileri
    securePayment: {
      title: "S - Param Güvende",
      description: "Güvenli alışveriş sistemi",
      returnPeriod: "2 gün",
      corporateReturnPeriod: "14 gün",
      info: [
        {
          title: "S - Param Güvende Nedir ?",
          description: "S - Param Güvende ile bireysel satıcıdan satın aldığınız ürün için, size ulaştıktan sonra 2 gün içerisinde iade talebinde bulunabilirsiniz..."
        },
        {
          title: "Ürün tutarı satıcının hesabına ne zaman gönderilir?",
          description: "Alıcı ürünü onayladıktan sonra ürün tutarı satıcı hesabına gönderilir..."
        },
        // Diğer bilgiler...
      ]
    }
  },
  
  //İphone 11  x2
  {
    id: "iphone-11-128-gb-tr-cihaz-kutu-fatura-sarj-mevcut-s-get-id-25032025122835-4980",
    // Ürün Detayları
    product: {
      title: "iPhone 11 128 GB kutu fatura şarj mevcut",
      price: 9500,
      serviceFee: 175, // Hizmet bedeli
      get totalPrice() {
          return this.price + this.serviceFee;
      }, // Toplam fiyat (price + serviceFee)

      imagesUrls: [
        "https://ik.imagekit.io/nsnnosdo1/WhatsApp%20Image%202025-03-31%20at%2019.20.15%20(7).jpeg?updatedAt=1745589104156",
        "https://ik.imagekit.io/nsnnosdo1/WhatsApp%20Image%202025-03-31%20at%2019.20.15%20(11).jpeg?updatedAt=1745589104356",
        "https://ik.imagekit.io/nsnnosdo1/WhatsApp%20Image%202025-03-31%20at%2019.20.15%20(9).jpeg?updatedAt=1745589104373",
        "https://ik.imagekit.io/nsnnosdo1/WhatsApp%20Image%202025-03-31%20at%2019.20.15%20(6).jpeg?updatedAt=1745589104389",
        "https://ik.imagekit.io/nsnnosdo1/WhatsApp%20Image%202025-03-31%20at%2019.20.15%20(8).jpeg?updatedAt=1745589104441",
        "https://ik.imagekit.io/nsnnosdo1/WhatsApp%20Image%202025-03-31%20at%2019.20.15%20(10).jpeg?updatedAt=1745589104525",
        "https://ik.imagekit.io/nsnnosdo1/x16_1191642411xxc.jpg?updatedAt=1745589104463",
      ],
    
      specs: {
        storage: "128 GB",
        os: "iOS",
        frontCamera: "12 Mp",
        backCamera: "12 Mp",
        color: "Titanyum",
        warranty: "Distribütör Garanti",
        screen: "48 Mp",
        trade: "Yok"
      }
    },

    // Satıcı Bilgileri
    seller: {
      name: "Gamze Türker",
      location: "Kastamonu / Merkez",
    },

    // İlan Detayları
    listing: {
      id: "323847328",
      date: "10 Mayıs 2025",
      category: "İkinci El ve Sıfır Alışveriş > Elektronik Eşya > Telefon > iPhone 11 Pro Türkiye Cihaz",
      type: "Sahibinden"
    },

    // Teslimat Bilgileri
    delivery: {
      time: "En geç 1 İş Günü içerisinde kargoya verilir",
      isFree: true,
      method: "Ücretsiz Kargo"
    },

    // Param Güvende Bilgileri
    securePayment: {
      title: "S - Param Güvende",
      description: "Güvenli alışveriş sistemi",
      returnPeriod: "2 gün",
      corporateReturnPeriod: "14 gün",
      info: [
        {
          title: "S - Param Güvende Nedir ?",
          description: "S - Param Güvende ile bireysel satıcıdan satın aldığınız ürün için, size ulaştıktan sonra 2 gün içerisinde iade talebinde bulunabilirsiniz..."
        },
        {
          title: "Ürün tutarı satıcının hesabına ne zaman gönderilir?",
          description: "Alıcı ürünü onayladıktan sonra ürün tutarı satıcı hesabına gönderilir..."
        },
        // Diğer bilgiler...
      ]
    }
  },
  
  //İphone 13 
  {
    id: "iphone-13-128-gb-tr-cihaz-kutu-fatura-sarj-mevcut-s-get-id-25032025122835-4980",
    // Ürün Detayları
    product: {

      title: "iPhone 13 128 GB kutu fatura şarj mevcut",
      price: 15500,
      serviceFee: 150, // Hizmet bedeli
      get totalPrice() {
          return this.price + this.serviceFee;
      }, // Toplam fiyat (price + serviceFee)

      imagesUrls: [
      "https://ik.imagekit.io/nsnnosdo1/x16_1191642411h6s.jpg?updatedAt=1745589238024",
      "https://ik.imagekit.io/nsnnosdo1/x16_1191642411y2s.jpg?updatedAt=1745589237976",
      "https://ik.imagekit.io/nsnnosdo1/x16_1191642411jte.jpg?updatedAt=1745589237995",
      "https://ik.imagekit.io/nsnnosdo1/x16_1191642411bhw.jpg?updatedAt=1745589237934",
      "https://ik.imagekit.io/nsnnosdo1/x16_11916424116dm.jpg?updatedAt=1745589237915",
      "https://ik.imagekit.io/nsnnosdo1/x16_1191642411b6r.jpg?updatedAt=1745589237877",
      "https://ik.imagekit.io/nsnnosdo1/x16_1191642411jga.jpg?updatedAt=1745589237866",
      "https://ik.imagekit.io/nsnnosdo1/x16_11916424114bn.jpg?updatedAt=1745589237762",
      "https://ik.imagekit.io/nsnnosdo1/x16_1191642411xxc.jpg?updatedAt=1745589238048",
      "https://ik.imagekit.io/nsnnosdo1/x16_1191642411oh4.jpg?updatedAt=1745589237893",

      ],
    
      specs: {
        storage: "128 GB",
        os: "iOS",
        frontCamera: "12 Mp",
        backCamera: "12 Mp",
        color: "Mavi",
        warranty: "Distribütör Garanti",
        screen: "48 Mp",
        trade: "Yok"
      }
    },

    // Satıcı Bilgileri
    seller: {
      name: "Cengizhan İçin Örnek",
      location: "Anamur / Kumla Mahallesi",
    },

    // İlan Detayları
    listing: {
      id: "323847328",
      date: "29 Nisan 2025",
      category: "İkinci El ve Sıfır Alışveriş > Elektronik Eşya > Telefon > iPhone 13 Türkiye Cihaz",
      type: "Sahibinden"
    },

    // Teslimat Bilgileri
    delivery: {
      time: "En geç 1 İş Günü içerisinde kargoya verilir",
      isFree: true,
      method: "Ücretsiz Kargo"
    },

    // Param Güvende Bilgileri
    securePayment: {
      title: "S - Param Güvende",
      description: "Güvenli alışveriş sistemi",
      returnPeriod: "2 gün",
      corporateReturnPeriod: "14 gün",
      info: [
        {
          title: "S - Param Güvende Nedir ?",
          description: "S - Param Güvende ile bireysel satıcıdan satın aldığınız ürün için, size ulaştıktan sonra 2 gün içerisinde iade talebinde bulunabilirsiniz..."
        },
        {
          title: "Ürün tutarı satıcının hesabına ne zaman gönderilir?",
          description: "Alıcı ürünü onayladıktan sonra ürün tutarı satıcı hesabına gönderilir..."
        },
        // Diğer bilgiler...
      ]
    }
  },
  
  // Diğer ürünler buraya eklenebilir
]; 