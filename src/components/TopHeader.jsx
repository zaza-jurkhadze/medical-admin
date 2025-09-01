import React from 'react';

const TopHeader = () => {
  return (
    <div className="top-header">
      <div className="top-left">
        <span><i className="fas fa-map-marker-alt"></i>ქუთაისი ფოთის ქუჩა 40</span>
        <span><i className="fas fa-phone-alt"></i> 0431 23 78 78 </span>
        <span><i className="fas fa-envelope"></i> info@wrcclinic.ge</span>
      </div>
      <div className="top-right">
        <a href="https://www.facebook.com/WRCommt" target="_blank" rel="noreferrer"><i className="fab fa-facebook-f"></i></a>
        <a href="https://www.instagram.com/modern_medical_tecnologies?igsh=MXhkZXltY3o4bGswbw== "><i className="fab fa-instagram"></i></a>
        <a href="#"><i className="fab fa-youtube"></i></a>
        <a href="https://linkedin.com/in/wrc-clinic" target="_blank" rel="noreferrer"><i className="fab fa-linkedin-in"></i></a>
      </div>
    </div>
  );
};

export default TopHeader;
