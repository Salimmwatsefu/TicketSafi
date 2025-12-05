import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import api from '../api/axios';

const PaymentCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('reference'); 
  const navigate = useNavigate();
  const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');
  
  // Use a ref to stop polling if component unmounts or succeeds
  const pollingActive = useRef(true);

  useEffect(() => {
    if (!reference) {
        navigate('/');
        return;
    }

    let attempts = 0;
    const maxAttempts = 40; // 40 * 3s = 2 minutes timeout

    const verifyPayment = async () => {
        if (!pollingActive.current) return;

        try {
            const res = await api.get(`/api/pay/verify/${reference}/`);
            const paymentStatus = res.data.status;

            if (paymentStatus === 'COMPLETED') {
                pollingActive.current = false;
                setStatus('success');
            } else if (paymentStatus === 'FAILED') {
                pollingActive.current = false;
                setStatus('failed');
            } else {
                // Still PENDING, keep polling
                attempts++;
                if (attempts >= maxAttempts) {
                    pollingActive.current = false;
                    setStatus('failed'); // Timeout
                } else {
                    setTimeout(verifyPayment, 3000); // Check again in 3s
                }
            }
        } catch (error) {
            console.error("Verification error", error);
            // Don't stop polling on network error, might be temporary
            attempts++;
            if (attempts >= maxAttempts) {
                pollingActive.current = false;
                setStatus('failed');
            } else {
                setTimeout(verifyPayment, 3000);
            }
        }
    };

    // Start the loop
    verifyPayment();

    return () => {
        pollingActive.current = false; // Cleanup
    };
  }, [reference, navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center p-6">
        {status === 'verifying' && (
            <>
                <Loader2 className="w-16 h-16 text-primary animate-spin mb-4" />
                <h2 className="text-2xl font-bold text-white">Verifying Payment...</h2>
                <p className="text-zinc-400 mt-2">Please wait while we confirm with the bank.</p>
            </>
        )}
        
        {status === 'success' && (
            <div className="animate-fade-in">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white">Payment Successful!</h2>
                <p className="text-zinc-400 mb-6">Your ticket has been emailed to you.</p>
                <button onClick={() => navigate('/my-tickets')} className="px-6 py-3 bg-white text-black rounded-xl font-bold hover:bg-zinc-200 transition-colors">
                    View My Wallet
                </button>
            </div>
        )}

        {status === 'failed' && (
            <div className="animate-fade-in">
                <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white">Verification Failed</h2>
                <p className="text-zinc-400 mb-6">We couldn't confirm your payment. If you were deducted, please contact support.</p>
                <button onClick={() => navigate('/')} className="px-6 py-3 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition-colors">
                    Return Home
                </button>
            </div>
        )}
    </div>
  );
};

export default PaymentCallbackPage;