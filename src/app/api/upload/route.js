import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 400 });
    }

    // Dosya adını benzersiz yap
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name}`;
    const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);

    // Dosyayı kaydet
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await fs.writeFile(filePath, buffer);

    return NextResponse.json({ 
      success: true, 
      fileName: fileName,
      path: `/uploads/${fileName}`
    });
  } catch (error) {
    console.error('Dosya yükleme hatası:', error);
    return NextResponse.json({ error: 'Dosya yükleme başarısız oldu' }, { status: 500 });
  }
} 