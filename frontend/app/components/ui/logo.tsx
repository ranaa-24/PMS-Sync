import React from 'react';

interface LogoProps {
  className?: string;
  static?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = '', static: isStatic = false }) => {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div className={`relative ${isStatic ? '' : 'logo-container'}`}>
        <svg
          width="40"
          height="40"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="logo-svg"
        >
          <defs>
            <linearGradient id="primary-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1a1f36" />
              <stop offset="100%" stopColor="#00d4ff" />
            </linearGradient>
            
            <linearGradient id="secondary-gradient" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00d4ff" />
              <stop offset="50%" stopColor="#0099cc" />
              <stop offset="100%" stopColor="#1a1f36" />
            </linearGradient>
            
            <linearGradient id="accent-gradient" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#ff6b35" />
              <stop offset="100%" stopColor="#e55a2b" />
            </linearGradient>
            
            <linearGradient id="primary-hover" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2a2f46" />
              <stop offset="100%" stopColor="#33e4ff" />
            </linearGradient>
            
            <linearGradient id="secondary-hover" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#33e4ff" />
              <stop offset="50%" stopColor="#00b3dc" />
              <stop offset="100%" stopColor="#2a2f46" />
            </linearGradient>
            
            <linearGradient id="accent-hover" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#ff7b45" />
              <stop offset="100%" stopColor="#f56a3b" />
            </linearGradient>
            
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <circle 
            cx="32" 
            cy="32" 
            r="28" 
            fill="transparent" 
            className="glow-circle"
          />
          
          <g className="layer-1" transform-origin="32 32">
            <path
              d="M32 4 L50 28 L32 20 L14 28 Z"
              fill="url(#primary-gradient)"
              opacity="0.9"
            />
            <path
              d="M60 32 L36 50 L44 32 L36 14 Z"
              fill="url(#primary-gradient)"
              opacity="0.9"
            />
            <path
              d="M32 60 L14 36 L32 44 L50 36 Z"
              fill="url(#primary-gradient)"
              opacity="0.9"
            />
            <path
              d="M4 32 L28 14 L20 32 L28 50 Z"
              fill="url(#primary-gradient)"
              opacity="0.9"
            />
          </g>
          
          <g className="layer-2" transform-origin="32 32">
            <path
              d="M32 12 L44 32 L32 26 L20 32 Z"
              fill="url(#secondary-gradient)"
              opacity="0.85"
            />
            <path
              d="M52 32 L32 44 L38 32 L32 20 Z"
              fill="url(#secondary-gradient)"
              opacity="0.85"
            />
            <path
              d="M32 52 L20 32 L32 38 L44 32 Z"
              fill="url(#secondary-gradient)"
              opacity="0.85"
            />
            <path
              d="M12 32 L32 20 L26 32 L32 44 Z"
              fill="url(#secondary-gradient)"
              opacity="0.85"
            />
          </g>
          
          <g className="layer-3" transform-origin="32 32">
            <path
              d="M32 18 L40 32 L32 46 L24 32 Z"
              fill="url(#accent-gradient)"
              opacity="0.95"
            />
          </g>
          
          <g className="layer-4" transform-origin="32 32">
            <circle
              cx="32"
              cy="32"
              r="4"
              fill="#ffffff"
              opacity="0.8"
            />
          </g>
        </svg>
        
        <style>{`
          .logo-container {
            cursor: pointer;
            transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .logo-svg {
            transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .glow-circle {
            transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .layer-1, .layer-2, .layer-3, .layer-4 {
            transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          /* Hover states that maintain position */
          .logo-container:hover .logo-svg {
            transform: scale(1.05);
            filter: url(#glow) brightness(1.1) hue-rotate(10deg);
          }
          
          .logo-container:hover .glow-circle {
            fill: rgba(0, 212, 255, 0.1);
            stroke: rgba(0, 212, 255, 0.3);
            stroke-width: 1;
          }
          
          .logo-container:hover .layer-1 {
            transform: rotate(15deg);
          }
          
          .logo-container:hover .layer-2 {
            transform: rotate(-10deg);
          }
          
          .logo-container:hover .layer-3 {
            transform: rotate(20deg);
          }
          
          .logo-container:hover .layer-4 {
            transform: scale(1.2);
            opacity: 1;
          }
        `}</style>
      </div>
      
      <div className="logo-text">
        <h1 className={`text-2xl md:text-3xl hidden smaller:inline-block font-bold text-white tracking-wider ${isStatic ? '' : 'hover-text'} `}>
          Sync
        </h1>
        
        <style>{`
          .logo-text {
            font-family: 'Poppins', 'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif;
            user-select: none;
          }
          
          .hover-text {
            transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
          }
          
          .logo-container:hover + .logo-text .hover-text {
            text-shadow: 0 0 20px rgba(0, 212, 255, 0.3);
          }
          
          .hover-text:hover {
            
          }
        `}</style>
      </div>
    </div>
  );
};

export default Logo;