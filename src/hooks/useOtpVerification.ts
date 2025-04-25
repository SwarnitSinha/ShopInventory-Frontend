import { useState } from 'react';
import { apiRequest } from '@/lib/queryClient';

export function useOtpVerification() {
  const [otp, setOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(true);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const sendOTP = async (email: string) => {
    setIsSendingOtp(true);
    return true;
    try {
      const res = await apiRequest("POST",'/api/auth/otp/send', { email });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send OTP');
      
      return true;
    } catch (error) {
      console.error('OTP send failed:', error);
      return false;
    } finally {
      setIsSendingOtp(false);
    }
  };

  const verifyOTP = async (email: string, otp: string) => {
    setIsVerifying(true);
    try {
      const response = await apiRequest('POST','/api/auth/otp/verify',{email, otp});
      
      const data = await response.json();
      console.log("VERIFY OTP RESPONSE", data);
      if (!response.ok) throw new Error(data.message || 'Failed to verify OTP');
      // if (!data.success) throw new Error(data.message);
      
      setOtpVerified(true);
      return true;
    } catch (error) {
      console.error('OTP verification failed:', error);
      setOtpVerified(false);
      return false;
    } finally {
      setIsVerifying(false);
    }
  };

  return {
    otp,
    setOtp,
    otpVerified,
    isSendingOtp,
    isVerifying,
    sendOTP,
    verifyOTP,
  };
}