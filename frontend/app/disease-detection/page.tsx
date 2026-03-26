"use client";

import { useState, useRef, useEffect } from 'react';
import { Upload, Camera, X, Loader2, AlertCircle, CheckCircle, Leaf, Activity, Droplets, Video, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CursorEffect from '@/components/CursorEffect';

export default function DiseaseDetection() {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [showCamera, setShowCamera] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const nativeCameraRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    // Properly initialize camera video when element becomes available
    useEffect(() => {
        if (showCamera && stream && videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(err => console.error("Error playing video:", err));
        }
    }, [showCamera, stream]);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
            setResult(null);
            setError(null);
        }
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const file = event.dataTransfer.files?.[0];
        if (file) {
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
            setResult(null);
            setError(null);
        }
    };

    const startCamera = async () => {
        setLoading(true);
        setError(null);
        try {
            const constraints = [
                { video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } },
                { video: { facingMode: 'environment' } },
                { video: true }
            ];

            let activeStream: MediaStream | null = null;
            let lastError: any = null;

            for (const constraint of constraints) {
                try {
                    activeStream = await navigator.mediaDevices.getUserMedia(constraint);
                    if (activeStream) break;
                } catch (err) {
                    lastError = err;
                }
            }

            if (!activeStream) throw lastError || new Error('Access denied');

            setStream(activeStream);
            streamRef.current = activeStream;
            setShowCamera(true);
            setResult(null);
        } catch (err: any) {
            console.error('Camera Error:', err);
            setError('Camera access denied. Please allow permissions and use HTTPS.');
        } finally {
            setLoading(false);
        }
    };

    const [isFlashing, setIsFlashing] = useState(false);

    const capturePhoto = () => {
        if (!videoRef.current || !canvasRef.current) {
            console.error("Video or Canvas ref not found");
            return;
        }
        
        const video = videoRef.current;
        const canvas = canvasRef.current;
        
        // Ensure video has dimensions
        if (video.videoWidth === 0 || video.videoHeight === 0) {
            console.warn("Video dimensions are not yet available");
            return;
        }

        // Visual flash effect
        setIsFlashing(true);
        setTimeout(() => setIsFlashing(false), 150);

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        ctx.drawImage(video, 0, 0);
        
        try {
            const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
            setPreviewUrl(dataUrl);
            
            // Convert to file for the backend
            canvas.toBlob((blob) => {
                if (blob) {
                    const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
                    setSelectedImage(file);
                    stopCamera();
                }
            }, 'image/jpeg', 0.9);
        } catch (err) {
            console.error("Capture error:", err);
            setError("Failed to capture photo. Please try again.");
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setStream(null);
        setShowCamera(false);
    };

    const handleAnalyze = async () => {
        if (!selectedImage) return;
        setLoading(true);
        setError(null);
        const formData = new FormData();
        formData.append('image', selectedImage);

        try {
            const res = await fetch('/api/disease-detection', {
                method: 'POST',
                body: formData,
            });
            if (!res.ok) throw new Error('Analysis failed');
            const data = await res.json();
            setResult(data);
        } catch (err) {
            console.error(err);
            setError('Failed to analyze image. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const clearImage = () => {
        setSelectedImage(null);
        setPreviewUrl(null);
        setResult(null);
        setError(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
            <CursorEffect />
            <div className="text-center mb-16 space-y-4">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 border border-green-100 text-green-700 text-sm font-medium mb-4">
                    <Leaf className="w-4 h-4" /> AI-Powered Plant Health
                </motion.div>
                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight">
                    Identify Plant Diseases <br /><span className="text-gradient">In Seconds</span>
                </motion.h1>
                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Upload a photo or use your camera to instantly identify diseases, get confidence scores, and receive expert remedies.
                </motion.p>
            </div>

            <div className="grid lg:grid-cols-1 gap-12 max-w-4xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-3xl p-8 md:p-10 relative overflow-hidden">
                    
                    {/* Camera View */}
                    {showCamera && (
                        <div className="space-y-4">
                            <div className="relative rounded-2xl overflow-hidden bg-black aspect-[3/4] md:aspect-video flex items-center justify-center border-4 border-green-500/30">
                                <video 
                                    ref={videoRef} 
                                    autoPlay 
                                    playsInline 
                                    muted 
                                    className="w-full h-full object-cover" 
                                />
                                
                                <div className="absolute inset-0 pointer-events-none">
                                    <motion.div 
                                        initial={{ top: '0%' }}
                                        animate={{ top: '100%' }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                        className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent shadow-[0_0_15px_rgba(74,222,128,0.8)] z-10"
                                    />
                                    <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-green-500 rounded-tl-lg" />
                                    <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-green-500 rounded-tr-lg" />
                                    <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-green-500 rounded-bl-lg" />
                                    <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-green-500 rounded-br-lg" />
                                </div>

                                <button onClick={stopCamera} className="absolute top-4 right-4 bg-black/50 backdrop-blur p-2.5 rounded-full hover:bg-black/70 text-white z-20">
                                    <XCircle className="h-5 w-5" />
                                </button>

                                {/* Flash Effect */}
                                <AnimatePresence>
                                    {isFlashing && (
                                        <motion.div 
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 bg-white z-30"
                                        />
                                    )}
                                </AnimatePresence>
                            </div>
                            <div className="flex justify-center">
                                <button onClick={capturePhoto} className="bg-green-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-green-700 shadow-xl flex items-center gap-3">
                                    <Camera className="h-6 w-6" /> Capture Photo
                                </button>
                            </div>
                            <canvas ref={canvasRef} className="hidden" />
                        </div>
                    )}

                    {/* Upload / Preview */}
                    {!showCamera && !previewUrl && (
                        <div className="space-y-6">
                            <div
                                className="border-3 border-dashed border-green-200/50 rounded-2xl p-12 text-center hover:bg-green-50/50 hover:border-green-300 transition-all duration-300 cursor-pointer group"
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                                    <Upload className="h-10 w-10 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Upload an Image</h3>
                                <p className="text-gray-500 mb-8 max-w-sm mx-auto">Drag and drop your plant leaf image here, or click to browse from your device</p>
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileSelect} />
                                <input type="file" ref={nativeCameraRef} className="hidden" accept="image/*" capture="environment" onChange={handleFileSelect} />
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <button 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 transition-all shadow-lg"
                                    >
                                        Select from Gallery
                                    </button>
                                    <button 
                                        onClick={() => nativeCameraRef.current?.click()}
                                        className="bg-white text-green-700 px-8 py-3 rounded-full font-semibold border-2 border-green-600 hover:bg-green-50 transition-all"
                                    >
                                        Use System Camera
                                    </button>
                                </div>
                            </div>
                            
                            <div className="flex justify-center">
                                <button
                                    onClick={startCamera}
                                    className="flex items-center gap-3 px-8 py-3 rounded-full font-semibold border-2 border-green-600 text-green-700 hover:bg-green-50 transition-all"
                                >
                                    <Camera className="h-5 w-5" />
                                    Use Real-Time Scanner
                                </button>
                            </div>
                        </div>
                    )}

                    {!showCamera && previewUrl && (
                        <div className="space-y-8">
                            <div className="relative rounded-2xl overflow-hidden bg-gray-50 aspect-[3/4] md:aspect-video flex items-center justify-center shadow-inner border-4 border-green-500/30">
                                <img src={previewUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
                                
                                {/* Photo Processing/Scanner Overlay */}
                                {!result && (
                                    <div className="absolute inset-0 pointer-events-none">
                                        {/* Scanning Line */}
                                        <motion.div 
                                            initial={{ top: '0%' }}
                                            animate={{ top: '100%' }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent shadow-[0_0_15px_rgba(74,222,128,0.8)] z-10"
                                        />
                                        
                                        {/* Corner Accents */}
                                        <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-green-500 rounded-tl-lg" />
                                        <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-green-500 rounded-tr-lg" />
                                        <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-green-500 rounded-bl-lg" />
                                        <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-green-500 rounded-br-lg" />
                                    </div>
                                )}

                                <button onClick={clearImage} className="absolute top-4 right-4 bg-white/90 backdrop-blur p-2.5 rounded-full hover:bg-white text-gray-700 transition-all shadow-sm hover:shadow-md z-20">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            {!result && (
                                <div className="flex justify-center">
                                    <button onClick={handleAnalyze} disabled={loading} className="bg-green-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-green-700 transition-all shadow-xl hover:shadow-green-200 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-3 min-w-[200px] justify-center">
                                        {loading ? (<><Loader2 className="h-6 w-6 animate-spin" /> Analyzing...</>) : (<><Camera className="h-6 w-6" /> Analyze Image</>)}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </motion.div>

                {/* Results */}
                <AnimatePresence>
                    {error && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-start gap-4 shadow-sm">
                            <div className="bg-red-100 p-2 rounded-full"><AlertCircle className="h-6 w-6 text-red-600" /></div>
                            <div><h4 className="font-semibold text-red-900 mb-1">Analysis Failed</h4><p className="text-red-700">{error}</p></div>
                        </motion.div>
                    )}

                    {result && (
                        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-3xl overflow-hidden border-0 shadow-2xl ring-1 ring-black/5">
                            <div className={`p-8 ${result.confidence < 0.1 ? 'bg-gradient-to-r from-red-50 to-red-100/50' : result.confidence < 0.5 ? 'bg-gradient-to-r from-orange-50 to-orange-100/50' : 'bg-gradient-to-r from-green-50 to-emerald-100/50'}`}>
                                <div className="flex items-center gap-4 mb-2">
                                    <div className={`p-3 rounded-full ${result.confidence < 0.1 ? 'bg-red-100 text-red-600' : result.confidence < 0.5 ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                                        <CheckCircle className="h-8 w-8" />
                                    </div>
                                    <div><h2 className="text-2xl font-bold text-gray-900">Analysis Complete</h2><p className="text-gray-600">Here are the findings from your image</p></div>
                                </div>
                            </div>
                            <div className="p-8 md:p-10 grid md:grid-cols-2 gap-10">
                                <div className="space-y-8">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2 text-gray-500 font-medium text-sm uppercase tracking-wider"><Activity className="w-4 h-4" /> Detected Condition</div>
                                        <p className="text-3xl font-bold text-gray-900 leading-tight">{result.confidence > 0.5 ? "No Disease Detected" : result.disease}</p>
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-gray-500 font-medium text-sm uppercase tracking-wider">Confidence Score</span>
                                            <span className="font-bold text-gray-900">{(result.confidence * 100).toFixed(1)}%</span>
                                        </div>
                                        <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                                            <motion.div initial={{ width: 0 }} animate={{ width: `${result.confidence * 100}%` }} transition={{ duration: 1, ease: "easeOut" }} className={`h-full rounded-full ${result.confidence < 0.1 ? 'bg-red-500' : result.confidence < 0.5 ? 'bg-orange-500' : 'bg-green-500'}`} />
                                        </div>
                                        <p className="mt-3 text-sm text-gray-500">
                                            {result.confidence < 0.1 ? 'Low confidence. Results may be inaccurate.' : result.confidence < 0.5 ? 'Moderate confidence. Please verify with an expert.' : 'High confidence. Results are likely accurate.'}
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-100">
                                    <div className="flex items-center gap-2 mb-4 text-gray-500 font-medium text-sm uppercase tracking-wider"><Droplets className="w-4 h-4" /> Recommended Remedy</div>
                                    <div className="prose prose-green max-w-none"><p className="text-gray-700 leading-relaxed text-lg">{result.remedy}</p></div>
                                    {result.confidence <= 0.5 && (
                                        <div className="mt-6 pt-6 border-t border-gray-200">
                                            <div className="flex items-start gap-3 text-orange-700 bg-orange-50 p-4 rounded-xl text-sm">
                                                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                                <p>Since the confidence is not high, we recommend consulting a local agricultural expert before applying chemical treatments.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
