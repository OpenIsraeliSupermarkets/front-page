import React, { useMemo } from 'react';

const UptimeGraph = ({ timeRange }) => {
  const blocks = useMemo(() => {
    const totalBlocks = 100; // Adjust this number for desired granularity
    const blockWidth = 100 / totalBlocks; // Make each block equal width
    
    return Array(totalBlocks).fill(null).map((_, index) => {
      const timeForBlock = getTimeForBlock(timeRange, index, totalBlocks);
      const dataPoint = findDataPointForTime(timeForBlock);
      
      return {
        width: `${blockWidth}%`,
        backgroundColor: dataPoint 
          ? (dataPoint.status === 'up' ? '#4CAF50' : '#FF5252')
          : '#E0E0E0', // Gray color for no data
      };
    });
  }, [timeRange]);

  return (
    <div className="uptimeGraph" style={{ width: '100%', display: 'flex' }}>
      {blocks.map((block, i) => (
        <div
          key={i}
          style={{
            height: '8px',
            width: block.width,
            backgroundColor: block.backgroundColor,
          }}
        />
      ))}
    </div>
  );
};

export default UptimeGraph; 