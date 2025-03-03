import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const isRequestSent = useRef(false);


  useEffect(() => {
    if (!token || isRequestSent.current) return;

    const verifyEmail = async () => {
      isRequestSent.current = true;
      try {
        console.log('Verification token:', token);
        const response = await axios.get(`http://localhost:3000/users/verify-email?token=${token}`);
        console.log('Backend response:', response.data);

        if (response.status === 200) {
            navigate('/auth');
        }
      } catch (error) {
        console.error('Error verifying email:', error);
        
          navigate('/auth');
      }
    };

    verifyEmail();
  }, [token, navigate]);

    
    return (
    <>
     
    </>
  );
}


export default VerifyEmail;
