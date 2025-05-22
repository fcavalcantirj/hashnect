import React, { useState, useEffect } from 'react';
import NetworkGraph from './NetworkGraph';
import NetworkGraphMobile from './NetworkGraphMobile';

const NetworkGraphWrapper: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile ? <NetworkGraphMobile /> : <NetworkGraph />;
};

export default NetworkGraphWrapper; 