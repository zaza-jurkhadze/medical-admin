import React from 'react';
const MessengerButton = () => {
  return (
    <a
      href="https://m.me/WRCommt"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: 'fixed',
        bottom: '80px',
        right: '20px',
        width: '55px',
        height: '55px',
        borderRadius: '50%',
        backgroundColor: '#0084FF', // Messenger-ის ლურჯი ფერი
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
        cursor: 'pointer',
        zIndex: 2000,
        textDecoration: 'none'
      }}
      aria-label="Messenger Chat"
    >
      {/* Facebook Messenger SVG Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="30"
        height="30"
        fill="white"
      >
        <path d="M12 2C6.477 2 2 6.075 2 11.495c0 3.308 2.08 6.152 5.106 7.514v3.006l3.022-1.668c.508.136 1.046.21 1.607.21 5.523 0 10-4.075 10-9.495S17.523 2 12 2zm1.945 13.474l-2.59-2.776-5.088 2.776 6.215-6.635 2.593 2.776 5.08-2.776-6.21 6.635z" />
      </svg>
    </a>
  );
};

export default MessengerButton;