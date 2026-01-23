'use client';

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter, usePathname, useParams } from "next/navigation";
import { productData } from '../../data/productData';

// Import assets from the correct path
import year from "../../assets/shlogo.png";
import secure from "../../assets/shlogo2.png";
import secure3 from "../../assets/secure3.png";
import kamyon from "../../assets/kamyon.png";
import onaylı2 from "../../assets/onaylı3.png";

const styles = {
  '.no-scrollbar::-webkit-scrollbar': {
    display: 'none',
  },
  '.no-scrollbar': {
    '-ms-overflow-style': 'none',
    'scrollbar-width': 'none',
  }
};

export default function ProductPage() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const { id } = params;
  
  const [activeTab, setActiveTab] = useState(0);
  const [isButtonFixed, setIsButtonFixed] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  
  // Find the product with matching id
  const currentProduct = productData.find(item => item.id === id);

  if (!currentProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Ürün bulunamadı</p>
      </div>
    );
  }

  useEffect(() => {
    const handleScroll = () => {
      const buyButton = document.getElementById('buyButton');
      if (buyButton) {
        const rect = buyButton.getBoundingClientRect();
        const isVisible = rect.top <= (window.innerHeight * 1.35);
        
        if (isVisible && !hasBeenVisible) {
          setHasBeenVisible(true);
          setIsButtonFixed(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasBeenVisible]);

  const handleBuyClick = () => {
    router.push(`${pathname}/form`);
  };

  const explanationCards = [
    {
      title: "S - Param Güvende Nedir ?",
      description: "S - Param Güvende ile bireysel satıcıdan satın aldığınız ürün için, size ulaştıktan sonra 2 gün içerisinde iade talebinde bulunabilirsiniz. İade talebinde bulunduğunuz ürünü 3 iş günü içinde kargoya teslim etmelisiniz. Kurumsal satıcıdan aldığınız ürün ise size ulaştıktan sonra 14 gün içinde iade edilebilir. S - Param Güvende hizmetinden faydalanabilmeniz için ürün iadesinde anlaşmalı kargo firmalarını kullanmalısınız."
    },
    {
      title: "Ürün tutarı satıcının hesabına ne zaman gönderilir?",
      description: "Alıcı ürünü onayladıktan sonra ürün tutarı satıcı hesabına gönderilir. Tutarın hesaba yansıması, bankaya bağlı olarak 1-5 iş gününü bulabilir."
    },
    {
      title: "Alıcı ürünü onaylamazsa ne olur?",
      description: "Alıcı ürünü onaylamaz ya da iade talebinde bulunmazsa, 2 gün sonunda işlem otomatik olarak onaylanır ve ürün tutarı satıcıya aktarılır."
    },
    {
      title: "S - Param Güvende hizmet bedeli kim tarafından ödenir?",
      description: "S - Param Güvende hizmet bedeli, satın alma esnasında alıcı tarafından ödenir. Hizmet bedeli, aldığınız ürünün fiyatına göre belirlenir."
    },
  ];

  const handleScroll = (e) => {
    const scrollPosition = e.target.scrollLeft;
    const imageWidth = e.target.offsetWidth;
    const newActiveImage = Math.round(scrollPosition / imageWidth);
    setActiveImage(newActiveImage);
  };

  return (
    <div className="flex flex-col items-center  bg-white  w-screen pb-10 ">
        
       {/* Navigation Bar */}
       <nav className="flex flex-col items-center justify-center bg-[#3E6189] w-full h-18 border-bottom border-black shadow-md ">
           <p className="text-white font-bold text-[18px] tracking-wider">www.sahibinden.com</p>
           <p className="text-gray-300 text-xs tracking-wider">S - Param Güvende Güvenli Satış İşlemleri</p>
       </nav>
        
       {/* Product Name */}
       <div className=" w-full px-4 bg-[#F7F7F7] py-1 text-center"> 
        <p className="text-sm">{currentProduct.product.title}</p> 
        </div> 

       {/* Product Image  */}
        <div className="w-full relative">
          <div className="absolute flex items-center gap-1 bg-[#009285]/60 left-3 top-0 text-white px-4 py-1 rounded-full z-10">
            <Image src={secure3} alt="profile" className="w-5 h-5 rounded-full" />  
            <p className="text-sm">Param Güvende</p>
          </div>
          
          {/* Image Carousel */}
          <div 
            className="overflow-x-auto scroll-smooth snap-x snap-mandatory" 
            style={{
              WebkitOverflowScrolling: 'touch',
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': {
                display: 'none'
              }
            }}
            onScroll={handleScroll}
          >
            <div className="flex w-full">
              {currentProduct.product.imagesUrls.map((imageUrl, index) => (
                <div 
                  key={index} 
                  className="flex-shrink-0 w-full flex justify-center snap-center"
                >
                  <Image 
                    src={imageUrl}
                    alt={`iphone-${index + 1}`} 
                    className="w-[54%] mt-1 h-auto"
                    draggable="false"
                    width={100}
                    height={100}
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-2 mb-4">
            {currentProduct.product.imagesUrls.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  activeImage === index ? 'bg-gray-800' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      
       {/* Seller Name & Features */}
       <div className="w-full flex flex-row items-center justify-between px-2 h-30 border border-gray-200 bg-[#F7F7F7] py-1 text-center"> 
        
        <Image src={onaylı2} alt="profile" className="w-20 cover bg-cover " />
      
        <div className="flex flex-row items-center gap-1 mr-4"> 
          <p className="text-sm text-[#039]"> {currentProduct.seller.name}</p>
          <Image src={secure} alt="profile" className="w-5 h-5 rounded-full" />  
        </div>
      
        <Image src={year} alt="profile" className="w-10 h-10 rounded-full" />

        
       </div> 

       {/* Product Pattern / addres */}
       <div className="bg-[#F7F7F7] border-b-2 border-amber-300 flex flex-col gap-2 w-full px-2 pt-3"> 
         <p className="text-xs text-[#039] text-center">{currentProduct.listing.category}</p>
         <p className="text-xs text-center text-gray-600">{currentProduct.seller.location}</p>

         <div className="w-full h-[36px] flex gap-1 items-center px-1 justify-between">
          <div 
            onClick={() => setActiveTab(0)} 
            className={`flex items-center justify-center w-1/3 h-full border-t-2 border-l-2 border-r-2 border-gray-200 transition-all duration-300 ease-in-out cursor-pointer ${activeTab === 0 ? 'bg-amber-300' : 'bg-white hover:bg-amber-50'}`}
          > 
            <p className="text-xs">İlan Bilgileri</p> 
          </div>
          <div 
            onClick={() => setActiveTab(1)} 
            className={`flex items-center justify-center w-1/3 h-full border-t-2 border-l-2 border-r-2 border-gray-200 transition-all duration-300 ease-in-out cursor-pointer ${activeTab === 1 ? 'bg-amber-300' : 'bg-white hover:bg-amber-50'}`}
          > 
            <p className="text-xs">Açıklama</p> 
          </div>
          <div 
            onClick={() => setActiveTab(2)} 
            className={`flex items-center justify-center w-1/3 h-full border-t-2 border-l-2 border-r-2 border-gray-200 transition-all duration-300 ease-in-out cursor-pointer ${activeTab === 2 ? 'bg-amber-300' : 'bg-white hover:bg-amber-50'}`}
          > 
            <p className="text-xs">Konumu</p> 
          </div>
        </div>
      
      
      
       </div>

     
        <div className="w-full ">
        
        {/* İlan Bilgileri */}
        {activeTab === 0 &&
        <div className="w-full h-full flex flex-col  "> 
         
         {/* Product Information */}
         <div className="w-full h-full flex flex-col  px-4 mt-1">
           
           <div className="w-full py-2 flex items-center justify-between border-b border-gray-200">
            <p className="text-[12px] text-gray-700">Fiyat</p>
            <p className="text-[12px] text-[#039] font-bold">{currentProduct.product.price} TL</p>
           </div>

           <div className="w-full py-2 flex items-center justify-between border-b border-gray-200">
            <p className="text-[12px] text-gray-700">İlan Tarihi</p>
            <p className="text-[12px] text-gray-700 ">{currentProduct.listing.date}</p>
           </div>

           <div className="w-full py-2 flex items-center justify-between border-b border-gray-200">
            <p className="text-[12px] text-gray-700">İlan No</p>
            <p className="text-[12px]  text-[#039] ">{currentProduct.listing.id}</p>
           </div>

           <div className="w-full py-2 flex items-center justify-between border-b border-gray-200">
            <p className="text-[12px] text-gray-700">Kimden</p>
            <p className="text-[12px]  text-red-800 ">{currentProduct.listing.type}</p>
           </div>

           <div className="w-full py-2 flex items-center justify-between border-b border-gray-200">
            <p className="text-[12px] text-gray-700">Dahili Hafıza</p>
            <p className="text-[12px] text-gray-700">{currentProduct.product.specs.storage}</p>
           </div>

           <div className="w-full py-2 flex items-center justify-between border-b border-gray-200">
            <p className="text-[12px] text-gray-700">İşletim Sistemi</p>
            <p className="text-[12px] text-gray-700">{currentProduct.product.specs.os}</p>
           </div>

           <div className="w-full py-2 flex items-center justify-between border-b border-gray-200">
            <p className="text-[12px] text-gray-700">Ön Kamera</p>
            <p className="text-[12px] text-gray-700">{currentProduct.product.specs.frontCamera}</p>
           </div>

           <div className="w-full py-2 flex items-center justify-between border-b border-gray-200">
            <p className="text-[12px] text-gray-700">Arka Kamera</p>
            <p className="text-[12px] text-gray-700">{currentProduct.product.specs.backCamera}</p>
           </div>

           <div className="w-full py-2 flex items-center justify-between border-b border-gray-200">
            <p className="text-[12px] text-gray-700">Renk</p>
            <p className="text-[12px] text-gray-700">{currentProduct.product.specs.color}</p>
           </div>

           <div className="w-full py-2 flex items-center justify-between border-b border-gray-200">
            <p className="text-[12px] text-gray-700">Garanti</p>
            <p className="text-[12px] text-gray-700">{currentProduct.product.specs.warranty}</p>
           </div>

           <div className="w-full py-2 flex items-center justify-between border-b border-gray-200">
            <p className="text-[12px] text-gray-700">Ekran</p>
            <p className="text-[12px] text-gray-700">{currentProduct.product.specs.screen}</p>
           </div>

           <div className="w-full py-2 flex items-center justify-between border-b border-gray-200">
            <p className="text-[12px] text-gray-700">Takas</p>
            <p className="text-[12px] text-gray-700">{currentProduct.product.specs.trade}</p>
           </div>

          
           
          
          
         </div>

         {/* Delivery Information */}
         <div className="flex flex-col gap-1 items-center justify-center w-full h-20 bg-[#3E6189] "> 
          <p className="text-white text-sm">{currentProduct.delivery.time}</p>
          <div className="flex flex-row items-center gap-1"> <Image src={kamyon} alt="kamyon" className="w-6 bg-cover bg-center" /> <p className="text-xs text-gray-400">{currentProduct.delivery.method}</p> </div>  
         </div>
        
         {/* Buy Button */}
         <button 
           onClick={handleBuyClick}
           className="w-full px-4 py-4 flex flex-col items-center justify-center" 
           id="buyButton"
         > 
           <div className={`self-center px-10 py-3 bg-[#009285] rounded-full flex flex-row items-center justify-center gap-2 min-h-[40px] transition-all duration-800 ease-in-out ${isButtonFixed ? 'fixed bottom-4 left-1/2 transform -translate-x-1/2 translate-y-0 z-50 opacity-100' : 'fixed bottom-4 left-1/2 transform -translate-x-1/2 translate-y-4 z-50 opacity-0'}`}>
            <Image src={secure3} alt="kamyon" className="w-6 h-6" />
            <p className="text-white text-xs whitespace-nowrap">Param Güvende ile Satın Almak İstiyorum</p>
          </div>
         </button>
           
           {/*  Explanation of Param Güvende */}
          <div className="bg-[#F7F7F7] flex flex-col gap-5 w-full pt-10 pb-12 px-3 "> 

           {explanationCards.map((card, index) => (
            <div key={index} className="w-full flex flex-col gap-4 bg-white p-6 rounded-2xl shadow-sm "> 
                <p className="text-[#039] text-md">{card.title}</p>
                <div className="w-full h-[1px] bg-gray-200"> </div>
                <p className="text-sm text-gray-600">{card.description}</p>
            </div>
           ))}


           <p className="self-center text-gray-500 text-sm text-center">*Güvenli Hesap: sahibinden.com çözüm ortağı olan ödeme kuruluşunun hesabıdır.</p>



          </div>

          
         

        
        
        </div>
         }
       



        {activeTab === 1 && <div className="w-full h-full flex flex-col  px-2 py-3 text-sm">Türkiye cihaz Kutu fatura mevcut Değişen yok tamir görmedi 
Garanti  devam ediyor
Takas yapmıyorum
</div>}
      
      
        {activeTab === 2 && (
          <div className="w-full h-[400px] relative">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d192698.6296252689!2d29.01986565!3d41.0055005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2str!4v1710399485099!5m2!1sen!2str"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        )}
       </div>

        {/* Product Information */}
      

  
      
      






       <main className="w-screen none h-full border-blue-200"></main>

       <footer className="w-full none h-30 border-green-200"></footer>
    
    </div>
  );
}
