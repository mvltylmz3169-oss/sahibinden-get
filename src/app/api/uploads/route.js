import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export async function GET() {
  try {
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    
    // Uploads klasörünün varlığını kontrol et
    try {
      await fs.access(uploadsDir);
    } catch {
      // Klasör yoksa oluştur
      await fs.mkdir(uploadsDir, { recursive: true });
      return NextResponse.json({ files: [] });
    }

    // Dosyaları oku
    const files = await fs.readdir(uploadsDir);
    
    // Her dosya için detaylı bilgi al
    const fileDetails = await Promise.all(
      files.map(async (fileName) => {
        const filePath = path.join(uploadsDir, fileName);
        const stats = await fs.stat(filePath);
        return {
          name: fileName,
          size: stats.size,
          type: fileName.endsWith('.pdf') ? 'application/pdf' : 
                fileName.match(/\.(jpg|jpeg|png|gif)$/i) ? 'image/' + fileName.split('.').pop().toLowerCase() : 
                'application/octet-stream'
        };
      })
    );
    

    return NextResponse.json({ files: fileDetails });
  } catch (error) {
    console.error('Dosyalar listelenirken hata oluştu:', error);
    return NextResponse.json({ error: 'Dosyalar listelenemedi' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { fileName, password } = await request.json();
    
    // Şifre kontrolü
    if (password !== process.env.UPLOADS_PASS) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);

    // Dosyanın varlığını kontrol et
    try {
      await fs.access(filePath);
    } catch {
      return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 404 });
    }

    // Dosyayı sil
    await fs.unlink(filePath);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Dosya silinirken hata oluştu:', error);
    return NextResponse.json({ error: 'Dosya silinemedi' }, { status: 500 });
  }
} 