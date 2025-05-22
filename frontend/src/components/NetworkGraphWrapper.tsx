import React, { useState, useEffect } from 'react';
import NetworkGraph from './NetworkGraph';
import NetworkGraphMobile from './NetworkGraphMobile';

const NetworkGraphWrapper: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      // Use a higher breakpoint to ensure mobile version is used on tablets too
      setIsMobile(window.innerWidth <= 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Render the appropriate component based on screen size
  if (isMobile) {
    return <NetworkGraphMobile />;
  }
  
  return <NetworkGraph />;
};

export default NetworkGraphWrapper; 