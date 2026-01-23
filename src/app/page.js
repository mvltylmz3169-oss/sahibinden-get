'use client';

import Image from "next/image";
import iphone from "./assets/iphone.jpg"
import year from "./assets/shlogo.png"
import secure from "./assets/shlogo2.png"
import secure3 from "./assets/secure3.png"
import kamyon from "./assets/kamyon.png"
import onaylı2 from "./assets/onaylı3.png"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { productData } from './data/productData';

const styles = {
  '.no-scrollbar::-webkit-scrollbar': {
    display: 'none',
  },
  '.no-scrollbar': {
    '-ms-overflow-style': 'none',
    'scrollbar-width': 'none',
  }
};

export default function Home() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [isButtonFixed, setIsButtonFixed] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  
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
    router.push('/form');
  };

  const explanationCards = [
    {
      title: "S - Param Güvende Nedir ?",
      description: "S - Param Güvende ile bireysel satıcıdan satın aldığınız ürün için, size ulaştıktan sonra 2 gün içerisinde iade talebinde bulunabilirsiniz. İade talebinde bulunduğunuz ürünü 3 iş günü içinde kargoya teslim etmelisiniz. Kurumsal satıcıdan aldığınız ürün ise size ulaştıktan sonra 14 gün içinde iade edilebilir. S - Param Güvende hizmetinden faydalanabilmeniz için ürün iadesinde anlaşmalı kargo firmalarını kullanmalısınız."
    },
    {
      title: "Ürün tutari saticinin hesabina ne zaman gönderilir?",
      description: "Alıcı ürünü onayladıktan sonra ürün tutarı satıcı hesabına gönderilir. Tutarın hesaba yansıması, bankaya bağlı olarak 1-5 iş gününü bulabilir."
    },
    {
      title: "Alici ürünü onaylamazsa ne olur?",
      description: "Alıcı ürünü onaylamaz ya da iade talebinde bulunmazsa, 2 gün sonunda işlem otomatik olarak onaylanır ve ürün tutarı satıcıya aktarılır."
    },
    {
      title: "S - Param Güvende hizmet bedeli kim tarafindan ödenir?",
      description: "S - Param Güvende hizmet bedeli, satın alma esnasında alıcı tarafından ödenir. Hizmet bedeli, aldığınız ürünün fiyatına göre belirlenir."
    },
  
  ]

  const handleScroll = (e) => {
    const scrollPosition = e.target.scrollLeft;
    const imageWidth = e.target.offsetWidth;
    const newActiveImage = Math.round(scrollPosition / imageWidth);
    setActiveImage(newActiveImage);
  };

  return (
    <div className="flex flex-col items-center  bg-white  w-screen pb-10 ">
        


       <main className="w-screen none h-full border-blue-200"></main>

       <footer className="w-full none h-30 border-green-200"></footer>
    
    </div>
  );
}
