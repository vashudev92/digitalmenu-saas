'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, X, ZoomIn, Move, Check, Loader2 } from 'lucide-react';
import { createPortal } from 'react-dom';

interface ImageCropperProps {
  label: string;
  aspectRatio: 'square' | 'banner'; // 'square' (1:1) or 'banner' (3:1)
  value: string;
  onChange: (base64: string) => void;
}

export default function ImageCropper({ label, aspectRatio, value, onChange }: ImageCropperProps) {
  const [mounted, setMounted] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset states when a new image is loaded
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setZoom(1);
      setPanX(0);
      setPanY(0);
      setIsModalOpen(true);
    };
    reader.readAsDataURL(file);
  };

  // Dragging / Panning handlers
  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    setDragStart({ x: clientX - panX, y: clientY - panY });
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    setPanX(clientX - dragStart.x);
    setPanY(clientY - dragStart.y);
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  // Crop calculation and canvas drawing
  const handleCrop = async () => {
    const img = imageRef.current;
    if (!img) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high resolution target sizes
    const targetWidth = aspectRatio === 'square' ? 500 : 1200;
    const targetHeight = aspectRatio === 'square' ? 500 : 400;

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    // Viewport dimensions in the browser
    const viewWidth = aspectRatio === 'square' ? 280 : 300;
    const viewHeight = aspectRatio === 'square' ? 280 : 100;

    // Image natural dimension vs rendered dimension
    const renderedWidth = img.width;
    const renderedHeight = img.height;
    const scaleFactor = img.naturalWidth / renderedWidth;

    // Calculate source rect from zoom & pan
    const viewLeftInRenderedImage = (renderedWidth * zoom - viewWidth) / 2 - panX;
    const viewTopInRenderedImage = (renderedHeight * zoom - viewHeight) / 2 - panY;

    const sX = (viewLeftInRenderedImage / zoom) * scaleFactor;
    const sY = (viewTopInRenderedImage / zoom) * scaleFactor;
    const sWidth = (viewWidth / zoom) * scaleFactor;
    const sHeight = (viewHeight / zoom) * scaleFactor;

    try {
      ctx.drawImage(
        img,
        sX,
        sY,
        sWidth,
        sHeight,
        0,
        0,
        targetWidth,
        targetHeight
      );

      const croppedBase64 = canvas.toDataURL('image/jpeg', 0.85);
      
      setUploading(true);
      setUploadError('');

      // Send to folder upload API
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ base64: croppedBase64 }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload image');
      }

      onChange(data.url);
      setIsModalOpen(false);
      setImageSrc(null);
      
      // Clear file input value to allow uploading same file again
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      console.error('Error drawing/uploading image:', err);
      setUploadError(err.message || 'Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3 w-full">
      <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
        {label}
      </span>
      
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Thumbnail Preview / Placeholder */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer overflow-hidden border border-dashed rounded-2xl flex flex-col items-center justify-center bg-[#0d0d0d] hover:bg-[#D4A437]/2 hover:border-[#D4A437]/40 transition-all ${
            aspectRatio === 'square' ? 'w-24 h-24' : 'w-full h-24'
          }`}
        >
          {value ? (
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="text-center p-3 text-gray-600 flex flex-col items-center">
              <Upload className="w-5 h-5 text-gray-500 mb-1" />
              <span className="text-[10px] font-medium uppercase tracking-wider">Upload</span>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2.5 rounded-xl border border-gray-800 hover:border-[#D4A437]/30 text-gray-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
        >
          Select Image
        </button>
      </div>

      {/* CROP MODAL OVERLAY */}
      {isModalOpen && imageSrc && mounted
        ? createPortal(
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
              <div className="w-full max-w-md glass-gold rounded-3xl p-6 relative flex flex-col">
                
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                    <Move className="w-4 h-4 text-[#D4A437]" /> Adjust Crop Frame
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setImageSrc(null);
                    }}
                    className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-900"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Viewport Cropper Container */}
                <div
                  ref={containerRef}
                  onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
                  onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
                  onMouseUp={handleEnd}
                  onMouseLeave={handleEnd}
                  onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
                  onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
                  onTouchEnd={handleEnd}
                  className="relative w-full h-[320px] bg-[#050505] overflow-hidden rounded-2xl flex items-center justify-center border border-gray-950 cursor-grab active:cursor-grabbing select-none"
                >
                  {/* Image under viewport */}
                  <img
                    ref={imageRef}
                    src={imageSrc}
                    alt="To Crop"
                    draggable={false}
                    style={{
                      transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
                      transformOrigin: 'center center',
                      maxHeight: '80%',
                      maxWidth: '80%',
                    }}
                    className="pointer-events-none transition-transform duration-75"
                  />

                  {/* Crop Box Frame Overlay Mask */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    {/* Upper Dark Mask */}
                    <div className="absolute inset-0 bg-black/60 z-10" />

                    {/* Viewport Cutout */}
                    <div
                      style={{
                        width: aspectRatio === 'square' ? '280px' : '300px',
                        height: aspectRatio === 'square' ? '280px' : '100px',
                      }}
                      className="border-2 border-[#D4A437] rounded-xl shadow-[0_0_0_9999px_rgba(10,10,10,0.65)] bg-transparent z-20 relative pointer-events-none"
                    />
                  </div>
                </div>

                {/* Sliders */}
                <div className="space-y-4 my-6">
                  {/* Zoom Slider */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-gray-400 font-semibold uppercase">
                      <span className="flex items-center gap-1"><ZoomIn className="w-3.5 h-3.5" /> Scale / Zoom</span>
                      <span>{zoom.toFixed(1)}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="3"
                      step="0.05"
                      value={zoom}
                      onChange={(e) => setZoom(Number(e.target.value))}
                      className="w-full accent-[#D4A437] bg-gray-800 rounded-lg appearance-none h-1.5 cursor-pointer"
                    />
                  </div>

                  {/* Offset adjustment indicators for touch help */}
                  <span className="block text-[10px] text-gray-500 text-center font-medium">
                    Drag the image directly or pinch to adjust crop offsets.
                  </span>
                </div>

                {/* Upload Error Message */}
                {uploadError && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/25 rounded-xl text-red-400 text-xs">
                    {uploadError}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    disabled={uploading}
                    onClick={() => {
                      if (uploading) return;
                      setIsModalOpen(false);
                      setImageSrc(null);
                      setUploadError('');
                    }}
                    className="w-1/2 py-3 rounded-xl border border-gray-800 hover:border-gray-700 text-gray-400 hover:text-white text-sm font-semibold transition-all disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={uploading}
                    onClick={handleCrop}
                    className="w-1/2 py-3 rounded-xl bg-gradient-to-r from-[#D4A437] to-[#B88E2F] text-black font-bold text-sm shadow-[0_0_10px_rgba(212,164,55,0.15)] flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Uploading...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" /> Crop & Save
                      </>
                    )}
                  </button>
                </div>

              </div>
            </div>,
            document.body
          )
        : null}
    </div>
  );
}
