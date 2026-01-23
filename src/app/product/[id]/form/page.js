'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import Image from "next/image";
import secure from "../../../assets/shlogo2.png"
import kamyon from "../../../assets/kamyon2.png"
import iade from "../../../assets/iade.png"
import akbank from "../../../assets/akbank.png"
import { productData } from "../../../data/productData"
import { useParams } from 'next/navigation';

// Dynamically import MUI components with no SSR
const Stepper = dynamic(() => import('@mui/material/Stepper'), { ssr: false });
const Step = dynamic(() => import('@mui/material/Step'), { ssr: false });
const StepLabel = dynamic(() => import('@mui/material/StepLabel'), { ssr: false });
const Button = dynamic(() => import('@mui/material/Button'), { ssr: false });
const IconButton = dynamic(() => import('@mui/material/IconButton'), { ssr: false });
const ArrowBack = dynamic(() => import('@mui/icons-material/ArrowBack'), { ssr: false });
const ContentCopyIcon = dynamic(() => import('@mui/icons-material/ContentCopy'), { ssr: false });
const CheckCircleIcon = dynamic(() => import('@mui/icons-material/CheckCircle'), { ssr: false });

// Create a styled component using MUI's styled API
const StyledStepper = ({ children, ...props }) => {
  const [mounted, setMounted] = useState(false);
  const [StyledComponent, setStyledComponent] = useState(null);

  useEffect(() => {
    const createStyledComponent = async () => {
      const { styled } = await import('@mui/material/styles');
      const component = styled(Stepper)`
        & .MuiStepConnector-line {
          border-color: #e0e0e0;
          transition: all 0.5s ease-in-out;
        }

        & .MuiStepConnector-root.Mui-active .MuiStepConnector-line {
          border-color: #009285;
          transition: all 0.5s ease-in-out;
        }

        & .MuiStepConnector-root.Mui-completed .MuiStepConnector-line {
          border-color: #009285;
          transition: all 0.5s ease-in-out;
        }

        & .MuiStepLabel-iconContainer {
          transform: scale(1);
          transition: all 0.3s ease-in-out;
        }

        & .MuiStepIcon-root {
          width: 24px;
          height: 24px;
          transition: all 0.3s ease-in-out;
        }

        & .MuiStepIcon-root.Mui-active {
          color: #009285;
          transform: scale(1);
          filter: drop-shadow(0 0 8px rgba(0, 146, 133, 0.3));
        }

        & .MuiStepIcon-root.Mui-completed {
          color: #009285;
          transform: scale(1);
        }

        & .MuiStepIcon-text {
          fill: white;
          font-size: 12px;
        }

        & .MuiStepLabel-label {
          transition: all 0.3s ease-in-out;
          font-size: 0.85rem;
        }

        & .MuiStepLabel-label.Mui-active {
          color: #009285;
          transform: scale(1);
          font-weight: 600;
        }

        & .MuiStepLabel-label.Mui-completed {
          color: #009285;
        }
      `;
      setStyledComponent(component);
      setMounted(true);
    };

    createStyledComponent();
  }, []);

  if (!mounted || !StyledComponent) {
    return null;
  }

  return <StyledComponent {...props}>{children}</StyledComponent>;
};

// formatPhoneNumber fonksiyonunu component dışında veya içinde tanımlayın
const formatPhoneNumber = (value) => {
  // Sadece rakamları al
  const numbers = value.replace(/\D/g, '');
  
  // Eğer hiç rakam yoksa boş string döndür
  if (numbers.length === 0) return '';
  
  // Maksimum 10 rakam al (başındaki 0'ı atmak için)
  const trimmed = numbers.slice(0, 10);
  
  let formatted = '';
  
  if (trimmed.length > 0) {
    formatted += '(';
    formatted += trimmed.slice(0, 3);
    if (trimmed.length > 3) {
      formatted += ') ';
      formatted += trimmed.slice(3, 6);
      if (trimmed.length > 6) {
        formatted += ' ';
        formatted += trimmed.slice(6, 8);
        if (trimmed.length > 8) {
          formatted += ' ';
          formatted += trimmed.slice(8, 10);
        }
      }
    }
  }
  
  return formatted;
};

const page = () => {
  const params = useParams();
  const { id } = params;
  
  // Find the product with matching id
  const currentProduct = productData.find(item => item.id === id);

  if (!currentProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Ürün bulunamadı</p>
      </div>
    );
  }

  const [activeStep, setActiveStep] = useState(0);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    phone: '',
    addressName: '',
    address: ''
  });
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [copiedIban, setCopiedIban] = useState('');
  const [copiedAccountHolder, setCopiedAccountHolder] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isPaymentValid, setIsPaymentValid] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [notificationType, setNotificationType] = useState('');
  const steps = ['Ürün', 'Adres', 'Ödeme', 'Ödeme Al'];

  // İl listesi
  const provinces = [
    "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin", "Aydın", "Balıkesir",
    "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli",
    "Diyarbakır", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari",
    "Hatay", "Isparta", "Mersin", "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir",
    "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Muğla", "Muş", "Nevşehir",
    "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Tekirdağ", "Tokat",
    "Trabzon", "Tunceli", "Şanlıurfa", "Uşak", "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman",
    "Kırıkkale", "Batman", "Şırnak", "Bartın", "Ardahan", "Iğdır", "Yalova", "Karabük", "Kilis", "Osmaniye",
    "Düzce"
  ];

  // İlçe listesi
  const getDistricts = (province) => {
    const districtsByProvince = {
      "İstanbul": ["Adalar", "Arnavutköy", "Ataşehir", "Avcılar", "Bağcılar", "Bahçelievler", "Bakırköy", "Başakşehir", "Bayrampaşa", "Beşiktaş", "Beykoz", "Beylikdüzü", "Beyoğlu", "Büyükçekmece", "Çatalca", "Çekmeköy", "Esenler", "Esenyurt", "Eyüp", "Fatih", "Gaziosmanpaşa", "Güngören", "Kadıköy", "Kağıthane", "Kartal", "Küçükçekmece", "Maltepe", "Pendik", "Sancaktepe", "Sarıyer", "Silivri", "Sultanbeyli", "Sultangazi", "Şile", "Şişli", "Tuzla", "Ümraniye", "Üsküdar", "Zeytinburnu"],
      "Ankara": ["Akyurt", "Altındağ", "Ayaş", "Bala", "Beypazarı", "Çamlıdere", "Çankaya", "Çubuk", "Elmadağ", "Etimesgut", "Evren", "Gölbaşı", "Güdül", "Haymana", "Kalecik", "Kazan", "Keçiören", "Kızılcahamam", "Mamak", "Nallıhan", "Polatlı", "Pursaklar", "Sincan", "Şereflikoçhisar", "Yenimahalle"],
      "İzmir": ["Aliağa", "Balçova", "Bayındır", "Bayraklı", "Bergama", "Beydağ", "Bornova", "Buca", "Çeşme", "Çiğli", "Dikili", "Foça", "Gaziemir", "Güzelbahçe", "Karabağlar", "Karaburun", "Karşıyaka", "Kemalpaşa", "Kınık", "Kiraz", "Konak", "Menderes", "Menemen", "Narlıdere", "Ödemiş", "Seferihisar", "Selçuk", "Tire", "Torbalı", "Urla"],
      "Bursa": ["Büyükorhan", "Gemlik", "Gürsu", "Harmancık", "İnegöl", "İznik", "Karacabey", "Keles", "Kestel", "Mudanya", "Mustafakemalpaşa", "Nilüfer", "Orhaneli", "Orhangazi", "Osmangazi", "Yenişehir", "Yıldırım"],
      "Antalya": ["Akseki", "Aksu", "Alanya", "Demre", "Döşemealtı", "Elmalı", "Finike", "Gazipaşa", "Gündoğmuş", "İbradı", "Kaş", "Kemer", "Kepez", "Konyaaltı", "Korkuteli", "Kumluca", "Manavgat", "Muratpaşa", "Serik"],
      "Adana": ["Aladağ", "Ceyhan", "Çukurova", "Feke", "İmamoğlu", "Karaisalı", "Karataş", "Kozan", "Pozantı", "Saimbeyli", "Sarıçam", "Seyhan", "Tufanbeyli", "Yumurtalık", "Yüreğir"],
      "Konya": ["Ahırlı", "Akören", "Akşehir", "Altınekin", "Beyşehir", "Bozkır", "Çeltik", "Cihanbeyli", "Çumra", "Derbent", "Derebucak", "Doğanhisar", "Emirgazi", "Ereğli", "Güneysınır", "Hadim", "Halkapınar", "Hüyük", "Ilgın", "Kadınhanı", "Karapınar", "Karatay", "Kulu", "Meram", "Sarayönü", "Selçuklu", "Seydişehir", "Taşkent", "Tuzlukçu", "Yalıhüyük", "Yunak"],
      "Gaziantep": ["Araban", "İslahiye", "Karkamış", "Nizip", "Nurdağı", "Oğuzeli", "Şahinbey", "Şehitkamil", "Yavuzeli"],
      "Şanlıurfa": ["Akçakale", "Birecik", "Bozova", "Ceylanpınar", "Eyyübiye", "Halfeti", "Haliliye", "Harran", "Hilvan", "Karaköprü", "Siverek", "Suruç", "Viranşehir"],
      "Kocaeli": ["Başiskele", "Çayırova", "Darıca", "Derince", "Dilovası", "Gebze", "Gölcük", "İzmit", "Kandıra", "Karamürsel", "Kartepe", "Körfez"],
      "Mersin": ["Akdeniz", "Anamur", "Aydıncık", "Bozyazı", "Çamlıyayla", "Erdemli", "Gülnar", "Mezitli", "Mut", "Silifke", "Tarsus", "Toroslar", "Yenişehir"],
      "Diyarbakır": ["Bağlar", "Bismil", "Çermik", "Çınar", "Çüngüş", "Dicle", "Eğil", "Ergani", "Hani", "Hazro", "Kayapınar", "Kocaköy", "Kulp", "Lice", "Silvan", "Sur", "Yenişehir"],
      "Hatay": ["Altınözü", "Antakya", "Arsuz", "Belen", "Defne", "Dörtyol", "Erzin", "Hassa", "İskenderun", "Kırıkhan", "Kumlu", "Payas", "Reyhanlı", "Samandağ", "Yayladağı"],
      "Manisa": ["Ahmetli", "Akhisar", "Alaşehir", "Demirci", "Gölmarmara", "Gördes", "Kırkağaç", "Köprübaşı", "Kula", "Salihli", "Sarıgöl", "Saruhanlı", "Selendi", "Soma", "Şehzadeler", "Turgutlu", "Yunusemre"],
      "Kayseri": ["Akkışla", "Bünyan", "Develi", "Felahiye", "Hacılar", "İncesu", "Kocasinan", "Melikgazi", "Özvatan", "Pınarbaşı", "Sarıoğlan", "Sarız", "Talas", "Tomarza", "Yahyalı", "Yeşilhisar"],
      "Samsun": ["Alaçam", "Asarcık", "Atakum", "Ayvacık", "Canik", "Çarşamba", "Havza", "İlkadım", "Kavak", "Ladik", "Ondokuzmayıs", "Salıpazarı", "Tekkeköy", "Terme", "Vezirköprü", "Yakakent"],
      "Balıkesir": ["Altıeylül", "Ayvalık", "Balya", "Bandırma", "Bigadiç", "Burhaniye", "Dursunbey", "Edremit", "Erdek", "Gömeç", "Gönen", "Havran", "İvrindi", "Karesi", "Kepsut", "Manyas", "Marmara", "Savaştepe", "Sındırgı", "Susurluk"],
      "Van": ["Bahçesaray", "Başkale", "Çaldıran", "Çatak", "Edremit", "Erciş", "Gevaş", "Gürpınar", "İpekyolu", "Muradiye", "Özalp", "Saray", "Tuşba"],
      "Aydın": ["Bozdoğan", "Buharkent", "Çine", "Didim", "Efeler", "Germencik", "İncirliova", "Karacasu", "Karpuzlu", "Koçarlı", "Köşk", "Kuşadası", "Kuyucak", "Nazilli", "Söke", "Sultanhisar", "Yenipazar"],
      "Denizli": ["Acıpayam", "Babadağ", "Baklan", "Bekilli", "Beyağaç", "Bozkurt", "Buldan", "Çal", "Çameli", "Çardak", "Çivril", "Güney", "Honaz", "Kale", "Merkezefendi", "Pamukkale", "Sarayköy", "Serinhisar", "Tavas"],
      "Sakarya": ["Adapazarı", "Akyazı", "Arifiye", "Erenler", "Ferizli", "Geyve", "Hendek", "Karapürçek", "Karasu", "Kaynarca", "Kocaali", "Pamukova", "Sapanca", "Serdivan", "Söğütlü", "Taraklı"],
      "Tekirdağ": ["Çerkezköy", "Çorlu", "Ergene", "Hayrabolu", "Kapaklı", "Malkara", "Marmaraereğlisi", "Muratlı", "Saray", "Süleymanpaşa", "Şarköy"],
      "Muğla": ["Bodrum", "Dalaman", "Datça", "Fethiye", "Kavaklıdere", "Köyceğiz", "Marmaris", "Menteşe", "Milas", "Ortaca", "Seydikemer", "Ula", "Yatağan"],
      "Eskişehir": ["Alpu", "Beylikova", "Çifteler", "Günyüzü", "Han", "İnönü", "Mahmudiye", "Mihalgazi", "Mihalıççık", "Odunpazarı", "Sarıcakaya", "Seyitgazi", "Sivrihisar", "Tepebaşı"],
      "Malatya": ["Akçadağ", "Arapgir", "Arguvan", "Battalgazi", "Darende", "Doğanşehir", "Doğanyol", "Hekimhan", "Kale", "Kuluncak", "Pütürge", "Yazıhan", "Yeşilyurt"],
      "Trabzon": ["Akçaabat", "Araklı", "Arsin", "Beşikdüzü", "Çarşıbaşı", "Çaykara", "Dernekpazarı", "Düzköy", "Hayrat", "Köprübaşı", "Maçka", "Of", "Ortahisar", "Sürmene", "Şalpazarı", "Tonya", "Vakfıkebir", "Yomra"],
      "Erzurum": ["Aşkale", "Aziziye", "Çat", "Hınıs", "Horasan", "İspir", "Karaçoban", "Karayazı", "Köprüköy", "Narman", "Oltu", "Olur", "Palandöken", "Pasinler", "Pazaryolu", "Şenkaya", "Tekman", "Tortum", "Uzundere", "Yakutiye"],
      "Rize": ["Ardeşen", "Çamlıhemşin", "Çıldır", "Derepazarı", "Fındıklı", "Güneysu", "Hemşin", "İkizdere", "İyidere", "Kalkandere", "Merkez", "Pazar"],
      "Afyonkarahisar": ["Başmakçı", "Bayat", "Bolvadin", "Çay", "Çobanlar", "Dazkırı", "Dinar", "Emirdağ", "Evciler", "Hocalar", "İhsaniye", "İscehisar", "Kızılören", "Merkez", "Sandıklı", "Sinanpaşa", "Sultandağı", "Şuhut"],
      "Isparta": ["Aksu", "Atabey", "Eğirdir", "Gelendost", "Gönen", "Keçiborlu", "Merkez", "Senirkent", "Sütçüler", "Şarkikaraağaç", "Uluborlu", "Yalvaç", "Yenişarbademli"],
      "Çanakkale": ["Ayvacık", "Bayramiç", "Biga", "Bozcaada", "Çan", "Eceabat", "Ezine", "Gelibolu", "Gökçeada", "Lapseki", "Merkez", "Yenice"],
      "Bolu": ["Dörtdivan", "Gerede", "Göynük", "Kıbrıscık", "Mengen", "Merkez", "Mudurnu", "Seben", "Yeniçağa"],
      "Çorum": ["Alaca", "Bayat", "Boğazkale", "Dodurga", "İskilip", "Kargı", "Laçin", "Mecitözü", "Merkez", "Oğuzlar", "Ortaköy", "Osmancık", "Sungurlu", "Uğurludağ"],
      "Giresun": ["Alucra", "Bulancak", "Çamoluk", "Çanakçı", "Dereli", "Doğankent", "Espiye", "Eynesil", "Görele", "Güce", "Keşap", "Merkez", "Piraziz", "Şebinkarahisar", "Tirebolu", "Yağlıdere"],
      "Kastamonu": ["Abana", "Ağlı", "Araç", "Azdavay", "Bozkurt", "Cide", "Çatalzeytin", "Daday", "Devrekani", "Doğanyurt", "Hanönü", "İhsangazi", "İnebolu", "Küre", "Merkez", "Pınarbaşı", "Seydiler", "Şenpazar", "Taşköprü", "Tosya"],
      "Yozgat": ["Akdağmadeni", "Aydıncık", "Boğazlıyan", "Çandır", "Çayıralan", "Çekerek", "Kadışehri", "Merkez", "Saraykent", "Sarıkaya", "Şefaatli", "Sorgun", "Yenifakılı", "Yerköy"],
      "Elazığ": ["Ağın", "Alacakaya", "Arıcak", "Baskil", "Karakoçan", "Keban", "Kovancılar", "Maden", "Merkez", "Palu", "Sivrice"],
      "Tokat": ["Almus", "Artova", "Başçiftlik", "Erbaa", "Merkez", "Niksar", "Pazar", "Reşadiye", "Sulusaray", "Turhal", "Yeşilyurt", "Zile"],
      "Çankırı": ["Atkaracalar", "Bayramören", "Çerkeş", "Eldivan", "Ilgaz", "Kızılırmak", "Korgun", "Kurşunlu", "Merkez", "Orta", "Şabanözü", "Yapraklı"],
      "Karaman": ["Ayrancı", "Başyayla", "Ermenek", "Kazımkarabekir", "Merkez", "Sarıveliler"],
      "Nevşehir": ["Acıgöl", "Avanos", "Derinkuyu", "Gülşehir", "Hacıbektaş", "Kozaklı", "Merkez", "Ürgüp"],
      "Niğde": ["Altunhisar", "Bor", "Çamardı", "Çiftlik", "Merkez", "Ulukışla"],
      "Kırşehir": ["Akçakent", "Akpınar", "Boztepe", "Çiçekdağı", "Kaman", "Merkez", "Mucur"],
      "Aksaray": ["Ağaçören", "Eskil", "Gülağaç", "Güzelyurt", "Merkez", "Ortaköy", "Sarıyahşi", "Sultanhanı"],
      "Kırıkkale": ["Bahşılı", "Balışeyh", "Çelebi", "Delice", "Karakeçili", "Keskin", "Merkez", "Sulakyurt", "Yahşihan"],
      "Batman": ["Beşiri", "Gercüş", "Hasankeyf", "Kozluk", "Merkez", "Sason"],
      "Şırnak": ["Beytüşşebap", "Cizre", "Güçlükonak", "İdil", "Merkez", "Silopi", "Uludere"],
      "Bartın": ["Amasra", "Kurucaşile", "Merkez", "Ulus"],
      "Ardahan": ["Çıldır", "Damal", "Göle", "Hanak", "Merkez", "Posof"],
      "Iğdır": ["Aralık", "Karakoyunlu", "Merkez", "Tuzluca"],
      "Yalova": ["Altınova", "Armutlu", "Çınarcık", "Çiftlikköy", "Merkez", "Termal"],
      "Karabük": ["Eflani", "Eskipazar", "Merkez", "Ovacık", "Safranbolu", "Yenice"],
      "Kilis": ["Elbeyli", "Merkez", "Musabeyli", "Polateli"],
      "Osmaniye": ["Bahçe", "Düziçi", "Hasanbeyli", "Kadirli", "Merkez", "Sumbas", "Toprakkale"],
      "Düzce": ["Akçakoca", "Cumayeri", "Çilimli", "Gölyaka", "Gümüşova", "Kaynaşlı", "Merkez", "Yığılca"]
    };
    
    return districtsByProvince[province] || [];
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Ad alanı zorunludur';
    if (!formData.surname) newErrors.surname = 'Soyad alanı zorunludur';
    if (!formData.phone) newErrors.phone = 'Telefon alanı zorunludur';
    if (!formData.addressName) newErrors.addressName = 'Adres adı zorunludur';
    if (!selectedProvince) newErrors.province = 'İl seçimi zorunludur';
    if (!selectedDistrict) newErrors.district = 'İlçe seçimi zorunludur';
    if (!formData.address) newErrors.address = 'Açık adres zorunludur';
    
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    setIsFormValid(isValid);
    return isValid;
  };

  // handleInputChange fonksiyonunu güncelleyin
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      // Telefon numarası için özel işlem
      const formattedNumber = formatPhoneNumber(value);
      setFormData(prev => ({
        ...prev,
        [name]: formattedNumber
      }));
    } else {
      // Diğer inputlar için normal işlem
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Hata varsa temizle
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Form geçerliliğini kontrol et
    const newFormData = { ...formData, [name]: value };
    const newErrors = { ...errors };
    delete newErrors[name];
    setIsFormValid(Object.keys(newErrors).length === 0 && 
      newFormData.name && newFormData.surname && newFormData.phone && 
      newFormData.addressName && newFormData.address && 
      selectedProvince && selectedDistrict);
  };

  const handleProvinceChange = (event) => {
    setSelectedProvince(event.target.value);
    setSelectedDistrict('');
    // İl değiştiğinde form geçerliliğini güncelle
    setIsFormValid(false);
  };

  const handleDistrictChange = (event) => {
    setSelectedDistrict(event.target.value);
    // İlçe değiştiğinde form geçerliliğini güncelle
    const isValid = formData.name && formData.surname && formData.phone && 
      formData.addressName && formData.address && selectedProvince && event.target.value;
    setIsFormValid(isValid);
  };

  const handleNext = () => {
    if (activeStep === 1) {
      if (!validateForm()) {
        return;
      }
    }
    if (activeStep === steps.length - 1) {
      setShowSuccessPopup(true);
      return;
    }
    setActiveStep((prevStep) => prevStep + 1);
    // Ödeme Al adımına geçildiğinde isPaymentValid'ı false yap
    if (activeStep === 2) {
      setIsPaymentValid(false);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  

  const handleCopyIban = async () => {
    const iban = 'TR 0004 6012 7788 8000 0658 94';

    try {
      await navigator.clipboard.writeText(iban);
      setCopiedIban(iban);
      setNotificationType('iban');
      setShowNotification(true);
    } catch (err) {
      // Fallback for older browsers or when clipboard API fails
      const textArea = document.createElement('textarea');
      textArea.value = iban;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopiedIban(iban);
        setNotificationType('iban');
        setShowNotification(true);
      } catch (err) {
        console.error('Kopyalama başarısız oldu:', err);
      }
      document.body.removeChild(textArea);
    }
  };

  const handleCopyAccountHolder = async () => {
    const accountHolder = 'Yasin Mercan';
    try {
      await navigator.clipboard.writeText(accountHolder);
      setCopiedAccountHolder(accountHolder);
      setNotificationType('accountHolder');
      setShowNotification(true);
    } catch (err) {
      // Fallback for older browsers or when clipboard API fails
      const textArea = document.createElement('textarea');
      textArea.value = accountHolder;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopiedAccountHolder(accountHolder);
        setNotificationType('accountHolder');
        setShowNotification(true);
      } catch (err) {
        console.error('Kopyalama başarısız oldu:', err);
      }
      document.body.removeChild(textArea);
    }
  };

  const handleCloseNotification = () => {
    setShowNotification(false);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsUploading(true);
      setUploadProgress(0);
      setIsPaymentValid(true); // Set to true immediately when file is selected
      
      // Dosya bilgilerini sakla
      const fileInfo = {
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified
      };
      setUploadedFile(fileInfo);
      
      // Dosyayı FormData olarak hazırla
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        // Dosyayı API endpoint'e gönder
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        
        if (response.ok) {
          // Yükleme başarılı
          setIsUploading(false);
          setUploadProgress(100);
        } else {
          throw new Error('Dosya yükleme başarısız oldu');
        }
      } catch (error) {
        console.error('Dosya yükleme hatası:', error);
        setIsUploading(false);
      }
    }
  };

  const handleCloseSuccessPopup = () => {
    setShowSuccessPopup(false);
    window.location.href = 'https://www.sahibinden.com';
  };

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    if (activeStep === 2 || activeStep === 3 || activeStep === 1) {
      // Küçük bir gecikme ekleyerek DOM'un tamamen yüklenmesini bekleyelim
      setTimeout(() => {
        scrollToTop();
      }, 100);
    }
  }, [activeStep]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Stepper */}
      <div className="w-full px-4 pt-6 pb-4 bg-[#F7F7F7]">
        <StyledStepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </StyledStepper>
      </div>

      {/* Content Area */}
      <div className="flex-1 pb-16">
        {/* Step 1 Content - Ürün */}
        {activeStep === 0 && (
          <div className='w-full h-auto flex flex-col'> 
           <div className='flex flex-col w-full  bg-[#E8F6F4] border-t border-gray-300 px-3 pt-3'> 
            <div className='w-full flex gap-3 justify-between border-b border-[#b2d1cc] pb-6'> 
             <Image src={currentProduct.product.imagesUrls[0]} width={100} height={100} alt="iphone" className="w-[20%] rounded-sm mt-1  h-auto  bg-cover bg-center" />
             <div className='flex flex-col gap-4  py-1 w-full'> 
               <p className='text-sm text-gray-700'>{currentProduct.product.title}</p>
               <span className='self-end text-lg text-gray-700 '>{currentProduct.product.price} TL</span>
             </div>
            </div>

            <div className='w-full flex gap-3 items-center justify-between border-b border-[#b2d1cc] py-3'> 
               <p className='text-sm text-gray-700'>S - Param Güvende Hizmet Bedeli</p>
               <span className='self-end text-lg text-gray-700 '>{currentProduct.product.serviceFee} TL</span>
            </div>

            <div className='w-full flex gap-3 items-center justify-between  py-3'> 
               <p className='text-sm text-gray-700 font-bold'>Toplam</p>
               <span className='self-end text-lg text-gray-700  font-bold'>{currentProduct.product.totalPrice} TL</span>
            </div>
           </div>

           <p className='p-3 text-sm text-gray-600'>Satıcı 3 iş günü içinde kargolar.</p>

           <div className='w-full h-full flex flex-col bg-[#F7F7F7] py-4'> 
             
             <div className='flex flex-col gap-4 bg-white w-full h-auto border-t  border-gray-300 pt-7 pb-2 px-4' >

                <div className='flex gap-4 '>
                  <Image src={secure} alt="iphone" className="w-14 h-14  rounded-sm mt-1    bg-cover bg-center" />
                  <div className='flex flex-col gap-2  py-1 w-full'> 
                    <p className='text-xl font-bold opacity-80'>Paranız Güvende</p>
                    <p className='text-xs text-gray-500 '> Ödemeniz siz ürünü teslim alıp onayladıktan sonra satıcıya aktarılır.  </p>
                  </div>
                </div>

                <div className='flex gap-4 '>
                  <Image src={kamyon} alt="iphone" className="w-16 h-12 mt-1   rounded-sm    bg-cover bg-center" />
                  <div className='flex flex-col gap-2  py-1 w-full'> 
                    <p className='text-xl font-bold opacity-80'>Ücretsiz Kargo</p>
                    <p className='text-xs text-gray-500 '> Ödemeniz siz ürünü teslim alıp onayladıktan sonra satıcıya aktarılır.  </p>
                  </div>
                </div>

                <div className='flex gap-4 '>
                  <Image src={iade} alt="iphone" className="w-14 h-14   rounded-sm mt-1   bg-cover bg-center" />
                  <div className='flex flex-col gap-2  py-1 w-full'> 
                    <p className='text-xl font-bold opacity-80'>Kolay İade</p>
                    <p className='text-xs text-gray-500 '> Ödemeniz siz ürünü teslim alıp onayladıktan sonra satıcıya aktarılır.  </p>
                  </div>
                </div>

             </div>

             {/* Yeni Eklenen Bilgi Bölümü */}
             <div className='flex flex-col gap-2 bg-white w-full h-auto border-t border-gray-300 pt-3 pb-2 px-4 mt-3'>
               <p className='text-xs text-gray-600'>S - PARAM GÜVENDE HİZMET SÖZLEŞMESİ</p>
               <p className='text-xs font-bold underline text-gray-600'>ÖN BİLGİLENDİRME FORMU</p>
               <p className='text-xs font-bold text-gray-600'>Hizmet verenin bilgileri</p>
               
               <div className='h-32 overflow-y-auto border border-gray-200 rounded-md p-2 mt-1'>
                 <p className='text-[10px] text-gray-600 leading-relaxed'>
                   Bu sözleşme, sahibinden.com ("Platform") üzerinden gerçekleştirilen alışverişlerde kullanılan S - Param Güvende hizmetine ilişkin olarak, hizmeti kullanan alıcı ("Kullanıcı") ile Platform arasında akdedilmiştir. S - Param Güvende hizmeti, Platform üzerinden gerçekleştirilen alışverişlerde ödemenin güvenli bir şekilde yapılmasını ve ürünün teslim alınmasından sonra satıcıya aktarılmasını sağlayan bir hizmettir.

                   Hizmetin Kullanımı:
                   1. Kullanıcı, Platform üzerinden bir ürün satın almak istediğinde S - Param Güvende hizmetini seçebilir.
                   2. Kullanıcı, ödemeyi Platform'un belirlediği yöntemlerle gerçekleştirir.
                   3. Ödeme, Platform tarafından güvence altına alınır.
                   4. Ürün, Kullanıcı'ya teslim edilir.
                   5. Kullanıcı ürünü kontrol eder ve onaylar.
                   6. Onay sonrası ödeme satıcıya aktarılır.

                   Hizmet Bedeli:
                   S - Param Güvende hizmeti için Platform, işlem tutarının %1.9'u oranında hizmet bedeli tahsil eder. Bu bedel, işlem tutarına dahil edilir ve Kullanıcı tarafından ödenir.

                   Sorumluluklar:
                   1. Platform, ödemenin güvenli bir şekilde saklanmasından ve ürün teslim alındıktan sonra satıcıya aktarılmasından sorumludur.
                   2. Kullanıcı, ürünü dikkatlice kontrol etmek ve herhangi bir sorun varsa Platform'u bilgilendirmekle yükümlüdür.
                   3. Satıcı, ürünün sözleşmede belirtilen özelliklere uygun olmasından sorumludur.

                   İade ve İptal:
                   1. Kullanıcı, ürünü teslim aldıktan sonra 14 gün içinde herhangi bir gerekçe göstermeden iade edebilir.
                   2. İade durumunda, ödeme Kullanıcı'ya iade edilir.
                   3. Platform, iade işlemlerinin hızlı ve sorunsuz bir şekilde gerçekleştirilmesini sağlar.

                   Gizlilik:
                   Platform, Kullanıcı'nın kişisel ve finansal bilgilerini gizli tutar ve üçüncü taraflarla paylaşmaz. Bu bilgiler, sadece hizmetin sağlanması amacıyla kullanılır.

                   Sözleşmenin Değiştirilmesi:
                   Platform, bu sözleşmeyi önceden haber vermek kaydıyla değiştirme hakkını saklı tutar. Değişiklikler, Platform üzerinden duyurulur.

                   Uygulanacak Hukuk:
                   Bu sözleşme, Türkiye Cumhuriyeti kanunlarına tabidir. Taraflar arasında doğabilecek uyuşmazlıkların çözümünde İstanbul Mahkemeleri ve İcra Daireleri yetkilidir.
                 </p>
               </div>
             </div>
           </div>
          </div> 
        )}

        {/* Step 2 Content - Adres */}
        {activeStep === 1 && (
          <div className='flex flex-col w-full h-full pb-20 bg-[#F7F7F7]'> 
           
           <div className=' flex flex-col gap-2 w-full h-full border-t border-gray-300 p-3 bg-white'>
             <div className='flex gap-4'>
              <Image src={currentProduct.product.imagesUrls[0]} width={100} height={100} alt="iphone" className="w-16 h-16 border rounded-sm mt-1    bg-cover bg-center" />
              <p className='text-sm text-gray-700 mt-1'>{currentProduct.product.title}</p>
             </div> 

             <div className='flex justify-between'>
               <p className='text-sm text-gray-700 '>Ürün Tutarı</p>
               <span className='text-sm text-gray-700 '>{currentProduct.product.price} TL</span>
             </div> 

             <div className='flex justify-between'>
               <p className='text-sm text-gray-700 '>S - Param Güvende Hizmet Bedeli</p>
               <span className='text-sm text-gray-700 '>{currentProduct.product.serviceFee} TL</span>
             </div> 

             <div className='flex justify-between'>
               <p className='text-sm text-gray-700 font-bold '>Toplam</p>
               <span className='text-sm text-gray-700 font-bold '>{currentProduct.product.totalPrice} TL</span>
             </div> 
             
             
             
             
             
             
           </div>

           <div className='text-sm text-gray-700 font-bold p-3 bg-[#ebe9e9]'> YENİ TESLİMAT ADRESİ</div>
             
            {/* Form */}
            <div className='flex flex-col gap-4 px-3 py-3 bg-white'> 
              
               <div className='flex flex-col gap-[1px] '> 
                <p className='text-sm'>Ad</p>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full border ${errors.name ? 'border-red-500' : 'border-gray-400'} p-2 outline-none focus:border-[#009285] focus:ring-1 focus:ring-[#009285] transition-all duration-800`} 
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
               </div>

                <div className='flex flex-col gap-[1px] '> 
                  <p className='text-sm'>Soyad</p>
                  <input 
                    type="text" 
                    name="surname"
                    value={formData.surname}
                    onChange={handleInputChange}
                    className={`w-full border ${errors.surname ? 'border-red-500' : 'border-gray-400'} p-2 outline-none focus:border-[#009285] focus:ring-1 focus:ring-[#009285] transition-all duration-300`} 
                  />
                  {errors.surname && <p className="text-red-500 text-xs mt-1">{errors.surname}</p>}
                </div>

                <div className='flex flex-col gap-[1px]'> 
                  <p className='text-sm'>Telefon</p>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="(5XX) XXX XX XX" 
                    className={`w-full border ${errors.phone ? 'border-red-500' : 'border-gray-400'} p-2 outline-none focus:border-[#009285] focus:ring-1 focus:ring-[#009285] transition-all duration-300 placeholder:text-gray-400 placeholder:text-sm`}  
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>

                <div className='flex flex-col gap-[1px] '> 
                  <p className='text-sm'>Adres Adı</p>
                  <input 
                    type="text" 
                    name="addressName"
                    value={formData.addressName}
                    onChange={handleInputChange}
                    placeholder="Örn: Ev Adresi, İş Adresi" 
                    className={`w-full border ${errors.addressName ? 'border-red-500' : 'border-gray-400'} p-2 outline-none focus:border-[#009285] focus:ring-1 focus:ring-[#009285] transition-all duration-300 placeholder:text-gray-400 placeholder:text-sm`} 
                  />
                  {errors.addressName && <p className="text-red-500 text-xs mt-1">{errors.addressName}</p>}
                </div>

                <div className='flex flex-col gap-[1px] '> 
                  <p className='text-sm'>İl</p>
                  <div className="relative">
                    <select
                      value={selectedProvince}
                      onChange={handleProvinceChange}
                      className={`w-full border ${errors.province ? 'border-red-500' : 'border-gray-400'} p-2 outline-none focus:border-[#009285] focus:ring-1 focus:ring-[#009285] transition-all duration-300 text-sm rounded appearance-none pr-8`}
                    >
                      <option value="" disabled>Seçiniz</option>
                      {provinces.map((province) => (
                        <option key={province} value={province}>
                          {province}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>
                  {errors.province && <p className="text-red-500 text-xs mt-1">{errors.province}</p>}
                </div>

                <div className='flex flex-col gap-[1px] '> 
                  <p className='text-sm'>İlçe</p>
                  <div className="relative">
                    <select
                      value={selectedDistrict}
                      onChange={handleDistrictChange}
                      disabled={!selectedProvince}
                      className={`w-full border ${errors.district ? 'border-red-500' : 'border-gray-400'} p-2 outline-none focus:border-[#009285] focus:ring-1 focus:ring-[#009285] transition-all duration-300 text-sm rounded appearance-none pr-8`}
                    >
                      <option value="" disabled>Seçiniz</option>
                      {getDistricts(selectedProvince).map((district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>
                  {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district}</p>}
                </div>

                <div className='flex flex-col gap-[1px] '> 
                  <p className='text-sm'>Açık Adres</p>
                  <textarea 
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="İlçe, semt, cadde vb. bilgiler" 
                    className={`w-full border ${errors.address ? 'border-red-500' : 'border-gray-400'} p-2 outline-none focus:border-[#009285] focus:ring-1 focus:ring-[#009285] transition-all duration-300 placeholder:text-gray-400 placeholder:text-sm min-h-[100px] resize-y`}
                    rows="4"
                  ></textarea>
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                </div>
                

                

                

               


            </div>
          
          
          
           </div>

       
        )}

        {/* Step 3 Content - Ödeme */}
        {activeStep === 2 && (
         <div className='flex flex-col gap-4 border bg-white  pb-16'> 
            <div className='text-sm text-gray-700 font-bold p-3 bg-[#ebe9e9]'> PARAM GÜVENDE İLE ÖDEME</div>
            
            <div className='flex flex-col px-4 gap-4'> 
              
              <div className='text-red-500 text-xs  leading-4 font-bold border-y border-gray-300 py-3'> Aşağıdaki IBAN numaralarına Havale/EFT işlemini mesai saatleri dışında veya hafta sonu FAST yoluyla yaptıktan sonra "Ödemeyi Tamamla" butonuna basınız. Ekibimiz gerekli kontrolleri sağlayıp satıcıdan ürünün kargolanmasını talep edecektir.  </div>
             
              <div className='flex flex-col gap-1'> 
                <p className='text-sm text-black'>Ödenecek Tutar Detayları</p>
                
                <div className='flex w-full justify-between'>
                   <p className='text-sm text-gray-700'>Ürün Tutarı</p>
                   <span className='text-sm text-gray-700 font-bold opacity-95'>{currentProduct.product.price} TL</span>
                 </div>

                 <div className='flex w-full justify-between'>
                   <p className='text-sm text-gray-700'>S - Param Güvende Hizmet Bedeli</p>
                   <span className='text-sm text-gray-700 font-bold opacity-95'>{currentProduct.product.serviceFee} TL</span>
                 </div>

                 <div className='flex w-full justify-between'>
                   <p className='text-sm text-gray-700'>Ödenecek Tutar</p>
                   <span className='text-sm text-gray-700 font-bold opacity-95'>{currentProduct.product.totalPrice} TL</span>
                 </div>
              </div>

              <div className='flex flex-col gap-3  '> 
                <p className='text-sm bg-[#ffed48] px-3 py-1 rounded-sm w-fit'>Sahibinden Muhasebe Departmanı</p>

                <div className='flex flex-col py-3 justify-center border-l-4 border-[#ffed48] pl-3'> 
                  <div className="flex items-center gap-2">
                    <p className='text-sm text-gray-700 font-bold'>IBAN Numarası</p>
                    <IconButton 
                      onClick={handleCopyIban}
                      size="small"
                      sx={{ 
                        padding: '4px',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.04)'
                        }
                      }}
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </div>
                  <p className='text-sm text-gray-700 '>TR 0004 6012 7788 8000 0658 94
                  </p>
                </div>

                <div className='flex flex-col py-1 justify-center border-l-4 border-[#ffed48] pl-3'> 
                  <div className="flex items-center gap-2">
                    <p className='text-sm text-gray-700 font-bold'>Hesap Sahibi</p>
                    <IconButton 
                      onClick={handleCopyAccountHolder}
                      size="small"
                      sx={{ 
                        padding: '4px',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.04)'
                        }
                      }}
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </div>
                  <p className='text-sm text-gray-700 '>Yasin Mercan</p>
                </div>

                 <div className='flex gap-10  py-1  border-l-4 border-[#ffed48] pl-3'> 
                 
                  <div className="flex flex-col   ">
                    <p className='text-sm text-gray-700 font-bold'>Banka</p>
                    <p className='text-sm text-gray-700 '>Akbank</p>
                  </div>

                  <Image src={akbank} alt="iphone" className="w-32 rounded-sm mt-1    bg-cover bg-center" />
                </div>

                {/* Yeni Eklenen Ödeme Bilgisi */}
                <div className='mt-4'>
                  <p className='text-xs text-gray-600 leading-relaxed'>
                    * Toplam tutarını belirtilen IBAN'a havale veya EFT yoluyla gönderebilirsiniz. Ödemenizi yaptıktan sonra herhangi bir ek ücret daha talep edilmeyecektir. Siz ödemenizi yaptıktan sonra kargo işlemleri için satıcı taraf bilgilendirilecek, herhangi bir aksilik durumunda ödemeniz sahibinden.com güvencesiyle size yetkili hesaptan geri gönderilecektir. Belirtilmiş olan IBAN bilgisi sadece size özel olup, tamamen sahibinden.com'a aittir. Ürününüz size ulaşıp siz ürünü teyit edene kadar sahibinden.com güvencesiyle ödemeniz garanti altına alınmaktadır. Herhangi bir aksilik durumunda para iadeniz en kısada sürede yapılacak olup, tüm sorumluluk sahibinden.com'a aittir.
                  </p>
                </div>

                {/* Sözleşme Bölümü */}
                <div className='flex flex-col gap-1 bg-white w-full h-auto border-t border-gray-300 pt-3 pb-2 px-4 mt-3'>
                  <p className='text-xs text-gray-600'>S - PARAM GÜVENDE HİZMET SÖZLEŞMESİ</p>
                  <p className='text-xs font-bold underline text-gray-600'>ÖN BİLGİLENDİRME FORMU</p>
                  <p className='text-xs font-bold text-gray-600'>Hizmet verenin bilgileri:</p>
                  
                  <div className='h-32 overflow-y-auto border border-gray-200 rounded-md p-2 mt-1'>
                    <p className='text-[10px] text-gray-600 leading-relaxed'>
                      Bu sözleşme, sahibinden.com ("Platform") üzerinden gerçekleştirilen alışverişlerde kullanılan S - Param Güvende hizmetine ilişkin olarak, hizmeti kullanan alıcı ("Kullanıcı") ile Platform arasında akdedilmiştir. S - Param Güvende hizmeti, Platform üzerinden gerçekleştirilen alışverişlerde ödemenin güvenli bir şekilde yapılmasını ve ürünün teslim alınmasından sonra satıcıya aktarılmasını sağlayan bir hizmettir.

                      Hizmetin Kullanımı:
                      1. Kullanıcı, Platform üzerinden bir ürün satın almak istediğinde S - Param Güvende hizmetini seçebilir.
                      2. Kullanıcı, ödemeyi Platform'un belirlediği yöntemlerle gerçekleştirir.
                      3. Ödeme, Platform tarafından güvence altına alınır.
                      4. Ürün, Kullanıcı'ya teslim edilir.
                      5. Kullanıcı ürünü kontrol eder ve onaylar.
                      6. Onay sonrası ödeme satıcıya aktarılır.

                      Hizmet Bedeli:
                      S - Param Güvende hizmeti için Platform, işlem tutarının %1.9'u oranında hizmet bedeli tahsil eder. Bu bedel, işlem tutarına dahil edilir ve Kullanıcı tarafından ödenir.

                      Sorumluluklar:
                      1. Platform, ödemenin güvenli bir şekilde saklanmasından ve ürün teslim alındıktan sonra satıcıya aktarılmasından sorumludur.
                      2. Kullanıcı, ürünü dikkatlice kontrol etmek ve herhangi bir sorun varsa Platform'u bilgilendirmekle yükümlüdür.
                      3. Satıcı, ürünün sözleşmede belirtilen özelliklere uygun olmasından sorumludur.

                      İade ve İptal:
                      1. Kullanıcı, ürünü teslim aldıktan sonra 14 gün içinde herhangi bir gerekçe göstermeden iade edebilir.
                      2. İade durumunda, ödeme Kullanıcı'ya iade edilir.
                      3. Platform, iade işlemlerinin hızlı ve sorunsuz bir şekilde gerçekleştirilmesini sağlar.

                      Gizlilik:
                      Platform, Kullanıcı'nın kişisel ve finansal bilgilerini gizli tutar ve üçüncü taraflarla paylaşmaz. Bu bilgiler, sadece hizmetin sağlanması amacıyla kullanılır.

                      Sözleşmenin Değiştirilmesi:
                      Platform, bu sözleşmeyi önceden haber vermek kaydıyla değiştirme hakkını saklı tutar. Değişiklikler, Platform üzerinden duyurulur.

                      Uygulanacak Hukuk:
                      Bu sözleşme, Türkiye Cumhuriyeti kanunlarına tabidir. Taraflar arasında doğabilecek uyuşmazlıkların çözümünde İstanbul Mahkemeleri ve İcra Daireleri yetkilidir.
                    </p>
                  </div>
                  
             
                </div>

                {/* İkinci Sözleşme Bölümü */}
                <div className='flex flex-col gap-1 bg-white w-full h-auto border-t border-gray-300 pt-3 pb-2 px-4 mt-3'>
                  <p className='text-xs text-gray-600'>KİŞİSEL VERİLERİN KORUNMASI SÖZLEŞMESİ</p>
                  <p className='text-xs font-bold underline text-gray-600'>AYDINLATMA METNİ</p>
                  <p className='text-xs font-bold text-gray-600'>Veri Sorumlusu:</p>
                  
                  <div className='h-32 overflow-y-auto border border-gray-200 rounded-md p-2 mt-1'>
                    <p className='text-[10px] text-gray-600 leading-relaxed'>
                      Sahibinden.com ("Platform"), 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında veri sorumlusu olarak, kişisel verilerinizi aşağıda açıklanan amaçlar doğrultusunda işleyebilecektir.

                      İşlenen Kişisel Veriler:
                      1. Kimlik bilgileri (ad, soyad, TC kimlik no)
                      2. İletişim bilgileri (telefon, e-posta, adres)
                      3. Finansal bilgiler (banka hesap bilgileri)
                      4. İşlem bilgileri (ödeme geçmişi, sipariş bilgileri)

                      İşleme Amaçları:
                      1. Sözleşmenin kurulması ve ifası
                      2. Yasal yükümlülüklerin yerine getirilmesi
                      3. Hizmet kalitesinin artırılması
                      4. Müşteri memnuniyetinin sağlanması

                      Veri Güvenliği:
                      Platform, kişisel verilerinizi güvenli bir şekilde saklamak ve korumak için gerekli tüm teknik ve idari önlemleri almaktadır.

                      Veri Sahibinin Hakları:
                      1. Kişisel verilerinizin işlenip işlenmediğini öğrenme
                      2. Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme
                      3. Kişisel verilerinizin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme
                      4. Kişisel verilerinizin düzeltilmesini veya silinmesini isteme
                    </p>
                  </div>
                </div>

                {/* Üçüncü Sözleşme Bölümü */}
                <div className='flex flex-col gap-1 bg-white w-full h-auto border-t border-gray-300 pt-3 pb-2 px-4 mt-3'>
                  <p className='text-xs text-gray-600'>KARGO VE TESLİMAT SÖZLEŞMESİ</p>
                  <p className='text-xs font-bold underline text-gray-600'>TESLİMAT KOŞULLARI</p>
                  <p className='text-xs font-bold text-gray-600'>Teslimat Süreci:</p>
                  
                  <div className='h-32 overflow-y-auto border border-gray-200 rounded-md p-2 mt-1'>
                    <p className='text-[10px] text-gray-600 leading-relaxed'>
                      Teslimat Süresi:
                      1. Ürünler, ödemenin onaylanmasından sonra 3 iş günü içinde kargoya verilir.
                      2. Kargo teslimat süresi, adresin bulunduğu bölgeye göre 1-3 iş günüdür.
                      3. Hafta sonu ve resmi tatiller teslimat süresine dahil değildir.

                      Teslimat Adresi:
                      1. Ürün, formda belirtilen teslimat adresine gönderilir.
                      2. Adres bilgilerinin doğruluğundan müşteri sorumludur.
                      3. Yanlış adres bilgisi nedeniyle oluşan gecikmelerden Platform sorumlu değildir.

                      Teslimat Sırasında:
                      1. Ürün teslim alınırken kargo görevlisinin yanında kontrol edilmelidir.
                      2. Hasarlı ürün teslim alınmamalıdır.
                      3. Teslimat sırasında herhangi bir sorun yaşanırsa kargo görevlisine tutanak tutturulmalıdır.

                      İade ve Değişim:
                      1. Hasarlı veya hatalı ürünler için 14 gün içinde iade/değişim hakkı vardır.
                      2. İade/değişim talepleri müşteri hizmetleri üzerinden yapılmalıdır.
                      3. İade kargo ücreti Platform tarafından karşılanır.
                    </p>
                  </div>
                </div>
              </div>
            </div>
         </div>
        )}

        {/* Step 4 Content - Ödeme Al */}
        {activeStep === 3 && (
          <div className="w-full bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Ödeme Onayı</h2>
            <div className="space-y-4">
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  IBAN Ödeme Onayı Yükle
                </label>
                <label
                  htmlFor="file-upload"
                  className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-blue-500 transition-colors duration-200"
                  onClick={() => setIsPaymentValid(true)}
                >
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <span className="font-medium text-blue-600 hover:text-blue-500">
                        Dosya Yükle
                      </span>
                      <p className="pl-1">veya sürükleyip bırakın</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF, JPG, JPEG, PNG (max. 10MB)
                    </p>
                  </div>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                  />
                </label>

                {/* Upload Progress */}
                {isUploading && uploadedFile && (
                  <div className="mt-4">
                    <div className="flex items-center gap-3 mb-2">
                      {uploadedFile.type.startsWith('image/') ? (
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      ) : (
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      )}
                      <span className="text-sm font-medium text-gray-700 flex-1">
                        {uploadedFile.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {uploadProgress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-green-500 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Uploaded File Preview - Always show if file exists */}
                {uploadedFile && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {uploadedFile.type.startsWith('image/') ? (
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      ) : (
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {uploadedFile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(uploadedFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      {!isUploading && (
                        <div className="text-sm text-green-600 font-medium">
                          Yükleme Tamamlandı
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Kişisel Veriler Aydınlatma Metni */}
      {activeStep === 1 && (
        <div className="fixed bottom-20 left-0 right-0 px-4 pb-2 z-50">
          <div className="w-full border border-gray-300 p-3 bg-white">
            <p className="text-xs text-gray-600">
              Kişisel verilerin işlenmesine dair <span className="text-blue-600">aydınlatma</span>
            </p>
          </div>
        </div>
      )}

      {/* Fixed Bottom Buttons */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white z-50">
        <div className={`flex items-center gap-4 transition-all duration-500 ease-in-out ${activeStep === 0 ? 'justify-center' : 'justify-start'}`}>
          <div className={`transition-all duration-500 ease-in-out ${activeStep === 0 ? 'w-0 opacity-0 -translate-x-4' : 'w-auto opacity-100 translate-x-0'}`}>
            <IconButton 
              onClick={handleBack}
              disabled={activeStep === 0}
              sx={{ 
                backgroundColor: '#f5f5f5',
                '&:hover': {
                  backgroundColor: '#e0e0e0'
                },
                '&.Mui-disabled': {
                  backgroundColor: '#f7f7f7',
                  color: '#bdbdbd'
                },
                borderRadius: '9999px',
                padding: '12px',
                visibility: activeStep === 0 ? 'hidden' : 'visible'
              }}
            >
              <ArrowBack />
            </IconButton>
          </div>
          <Button 
            variant="contained" 
            fullWidth 
            onClick={handleNext}
            disabled={
              (activeStep === steps.length - 1 && !isPaymentValid) || 
              (activeStep === 1 && !isFormValid)
            }
            sx={{ 
              backgroundColor: '#2E62B6',
              '&:hover': {
                backgroundColor: '#2E62B6'
              },
              borderRadius: '9999px',
              padding: '10px 20px',
              transition: 'all 0.5s ease-in-out',
              width: activeStep === 0 ? '400px' : 'calc(100% - 60px)',
              margin: '0 auto',
              '&.Mui-disabled': {
                backgroundColor: '#e0e0e0',
                color: '#9e9e9e'
              }
            }}
          >
            {activeStep === 0 ? 'Teslimat Adresi Seç' : 
             activeStep === 1 ? 'Ödeme Yöntemi Seç' :
             activeStep === 2 ? 'Ödemeyi Tamamla' : 'Tamamla'}
          </Button>
        </div>
      </div>

      {/* Notification Overlay */}
      {showNotification && (
        <div className="fixed inset-0 backdrop-blur-[8px] bg-black/20 flex items-center justify-center z-50 animate-blurIn">
          <div className="bg-white/95 rounded-md py-6 px-12 flex flex-col items-center gap-4 animate-modalIn shadow-lg">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircleIcon className="text-green-500 text-4xl" />
            </div>
            <p className="text-xl font-semibold">
              {notificationType === 'iban' ? 'IBAN Kopyalandı' : 'Hesap Sahibi Kopyalandı'}
            </p>
            <p className="text-gray-600">{notificationType === 'iban' ? copiedIban : copiedAccountHolder}</p>
            <button
              onClick={handleCloseNotification}
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Tamam
            </button>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 backdrop-blur-[8px] bg-black/20 flex items-center justify-center z-50 animate-blurIn">
          <div className="bg-white/95 rounded-md py-6 px-4 w-[90%] max-w-md flex flex-col items-center gap-4 animate-modalIn shadow-lg">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircleIcon className="text-green-500 text-4xl" />
            </div>
            <p className="text-xl font-semibold text-center">
              Ödemeniz Başarıyla Alınmıştır
            </p>
            <p className="text-gray-600 text-center text-sm">
              Gerekli incelemeler yapıldıktan sonra formda doldurduğunuz telefon üzerinden sizle iletişime geçilecektir.
            </p>
            <button
              onClick={handleCloseSuccessPopup}
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Tamam
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default page;