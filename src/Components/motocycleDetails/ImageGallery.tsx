import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageGalleryProps {
  images: string[];
  title: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const defaultImage = "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800";
  const imageList = images && images.length > 0 ? images : [defaultImage];

  return (
    <div>
      <div className="relative w-full aspect-video md:aspect-[4/3] rounded-lg overflow-hidden border border-gray-200">
        <AnimatePresence>
          <motion.img
            key={selectedImage}
            src={imageList[selectedImage]}
            alt={`${title} - image ${selectedImage + 1}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>
      </div>
      {imageList.length > 1 && (
        <div className="flex gap-2 mt-3">
          {imageList.map((img, index) => (
            <div
              key={index}
              className={`w-24 h-24 rounded-md cursor-pointer overflow-hidden border-2 transition-all ${
                selectedImage === index ? 'border-red-600' : 'border-transparent'
              }`}
              onClick={() => setSelectedImage(index)}
            >
              <img
                src={img}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}