// ImageCropper.tsx
import React, { useState, useRef, useEffect } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import styles from './ImageCropper.module.css';
import imageCompression from 'browser-image-compression';

interface ImageCropperProps {
    imageFile: File | null; // 外部から受け取る画像ファイル
    onImageCropped: (croppedImageUrl: string, croppedImageFile: File) => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({ imageFile, onImageCropped }) => {
  const [upImg, setUpImg] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: "px",
    width: 100,
    height: 100,
    x: 0,
    y: 0,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);

  // imageFileが変更されたら画像を読み込む
  useEffect(() => {
    if (imageFile) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setUpImg(reader.result as string);
      });
      reader.readAsDataURL(imageFile);
    } else {
      setUpImg(null); // imageFileがnullの場合はupImgをリセット
    }
  }, [imageFile]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setUpImg(reader.result as string);
        e.target.value = ''; // ファイル入力をリセット、同じファイルでも再選択できるようにする
        setCrop({
            unit: "px",
            width: 100,
            height: 100,
            x: 0,
            y: 0,
        })
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    imgRef.current = event.currentTarget;
    const image = event.currentTarget as HTMLImageElement;

    // 画像の中央にクロップ位置を設定
    const centerX = (image.width - 100) / 2;
    const centerY = (image.height - 100) / 2;

    setCrop(prevCrop => ({
        ...prevCrop,
        x: centerX,
        y: centerY,
    }));
  };
  

  const getCroppedImg = async (): Promise<{ url: string; file: File } | null> => {
    if (completedCrop && imgRef.current) {
      const image = imgRef.current;
      const canvas = document.createElement('canvas');
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      canvas.width = completedCrop.width;
      canvas.height = completedCrop.height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        return null;
      }

      ctx.drawImage(
        image,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        completedCrop.width,
        completedCrop.height
      );

      // canvas.toBlobをPromiseに変換
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((blob) => resolve(blob), 'image/jpeg');
      });

      if (!blob) {
        console.error('Canvas is empty');
        alert('クロップ処理に失敗しました。再試行してください。');
        return null;
      }

      // BlobをFileに変換
      const file = new File([blob], 'cropped.jpg', { type: 'image/jpeg' });

      // 画像を圧縮
      const compressedBlob = await imageCompression(file, {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 200,
        useWebWorker: true,
      });

      const compressedFile = new File([compressedBlob], 'cropped.jpg', { type: 'image/jpeg' });

      const croppedImageUrl = URL.createObjectURL(compressedBlob);
      return { url: croppedImageUrl, file: compressedFile };
    }
    return null;
  };

  const handleCropComplete = async () => {
    try {
      const result = await getCroppedImg();
      if (result) {
        const { url, file } = result;
        onImageCropped(url, file);
        setUpImg(null); // クロップエリアを非表示にする
      }
    } catch (error) {
      console.error('クロップ画像の取得に失敗しました:', error);
      alert('画像の処理に失敗しました。再試行してください。');
    }
  };

  return (
    <div className={styles.cropperContainer}>
      {/* 画像が選択されたらクロップエリアを表示 */}
      {upImg && (
        <div className={styles.cropArea}>
          <ReactCrop
            crop={crop}
            onChange={(newCrop) => setCrop(newCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={1} // アスペクト比を1に設定（正方形）
            circularCrop={true}
            style={{ maxWidth: '100%', maxHeight: '80vh', minWidth: 200, minHeight: 200 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={upImg} onLoad={onLoad} alt="Crop me" />
          </ReactCrop>
          <button className={styles.cropButton} onClick={handleCropComplete}>
            画像を適用
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageCropper;
