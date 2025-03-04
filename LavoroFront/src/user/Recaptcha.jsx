import React, { useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";

function Recaptcha({ onChange }) {
    const recaptchaRef = useRef(null);

    const handleExpired = () => {
        onChange(null);
    };

    return ( 
        <div>
             <ReCAPTCHA 
                 ref={recaptchaRef}
                 sitekey="6LeQYtgqAAAAAFGCH68E2ZixGjw4KraKpfRwJ6us" 
                 onChange={onChange}
                 onExpired={handleExpired}
             />
        </div>
     );
}

export default Recaptcha;