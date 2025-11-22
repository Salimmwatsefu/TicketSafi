import React, { useEffect, useState, useRef } from 'react';
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Loader2, RotateCcw } from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const ScannerPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [scanResult, setScanResult] = useState<{ status: 'success' | 'error' | 'loading', message: string, data?: any } | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    if (user && !['ORGANIZER', 'SCANNER'].includes(user.role || '')) {
        alert("Access Denied.");
        navigate('/');
        return;
    }

    if (scannerRef.current) return;

    const onScanSuccess = async (decodedText: string) => {
        if (isPaused) return;
        
        setIsPaused(true);
        scannerRef.current?.pause(true); 
        setScanResult({ status: 'loading', message: 'Verifying...' });

        try {
            const res = await api.post('/api/scanner/verify/', { qr_hash: decodedText });
            setScanResult({
                status: 'success',
                message: 'VALID TICKET',
                data: res.data
            });
        } catch (err: any) {
            console.error(err);
            const errorMsg = err.response?.data?.error || "Invalid Ticket";
            setScanResult({
                status: 'error',
                message: errorMsg,
                data: err.response?.data
            });
        }
    };

    const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        supportedScanTypes: [0],
        formatsToSupport: [ Html5QrcodeSupportedFormats.QR_CODE ]
    };

    const scanner = new Html5QrcodeScanner("reader", config, false);
    scanner.render(onScanSuccess, () => {});
    scannerRef.current = scanner;

    return () => {
        try { scanner.clear(); } catch (e) { console.error(e); }
    };
  }, [user, navigate]);

  const resetScanner = () => {
      setScanResult(null);
      setIsPaused(false);
      scannerRef.current?.resume();
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
        <div className="p-4 flex items-center justify-between bg-zinc-900/80 backdrop-blur-md border-b border-white/10 z-10 fixed top-0 w-full">
            <button onClick={() => navigate('/organizer')} className="p-2 rounded-full bg-white/10">
                <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="font-heading font-bold text-lg">Gate Scanner</h1>
            <div className="w-10"></div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center pt-20 relative px-4">
            {scanResult && (
                <div className={`absolute inset-0 z-20 flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-300 ${
                    scanResult.status === 'success' ? 'bg-green-600' : 
                    scanResult.status === 'error' ? 'bg-red-600' : 'bg-black/90'
                }`}>
                    {scanResult.status === 'loading' && <Loader2 className="w-20 h-20 animate-spin text-white mb-4" />}
                    {scanResult.status === 'success' && <CheckCircle className="w-24 h-24 text-white mb-4 drop-shadow-lg" />}
                    {scanResult.status === 'error' && <XCircle className="w-24 h-24 text-white mb-4 drop-shadow-lg" />}
                    
                    <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">{scanResult.message}</h2>
                    
                    {scanResult.data && (
                        <div className="bg-black/20 p-4 rounded-xl w-full max-w-xs backdrop-blur-sm mt-4">
                            <p className="text-sm font-bold opacity-70 uppercase">Attendee</p>
                            <p className="text-xl font-medium mb-2">{scanResult.data.attendee_name || 'Guest'}</p>
                            <p className="text-sm font-bold opacity-70 uppercase">Tier</p>
                            <p className="text-lg font-mono">{scanResult.data.tier_name}</p>
                        </div>
                    )}

                    <button onClick={resetScanner} className="mt-10 px-8 py-4 bg-white text-black font-bold rounded-full text-lg shadow-xl flex items-center hover:scale-105 transition-transform">
                        <RotateCcw className="w-6 h-6 mr-2" /> Scan Next
                    </button>
                </div>
            )}

            <div id="reader" className="w-full max-w-md overflow-hidden rounded-3xl shadow-2xl border-4 border-zinc-800 bg-black"></div>
            {!scanResult && <p className="mt-8 text-zinc-500 text-sm animate-pulse">Point camera at ticket</p>}
        </div>
    </div>
  );
};

export default ScannerPage;