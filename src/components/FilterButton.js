import React, { useState } from 'react';
import '../styles/FilterButton.css';

const RAINBOW_COLORS = [
    "#F94144", "#F9844A", "#43AA8B", "#277DA1",
    "#F9C74F", "#90BE6D", "#4D908E", "#F8961E",
    "#F3722C", "#577590"
  ];

const FilterButton = ({ data, onFilterClick }) => {

  
    // Aggregate data to get counts per category
    const categoryCounts = data.reduce((acc, item) => {
      acc[item] = (acc[item] || 0) + 1;
      return acc;
    }, {});
  


    // Function to determine size based on count
    const getSizeForCount = (count) => {
        return 100 + (count * 2); // Base size + size increment based on count
    };
  
    // Render filter items
    return (
      <div className="bubble-container">
        {Object.entries(categoryCounts).map(([category, count], index) => (
          <div>
            <button
                key={category}
                style={{
                backgroundColor: RAINBOW_COLORS[index % RAINBOW_COLORS.length],
                // opacity: selectedFilter && selectedFilter !== category ? 0.5 : 1,
                width: `${getSizeForCount(count)}px`,
                height: `${getSizeForCount(count)}px`,
                borderRadius: '50%', // Makes the button round
                }}
                onClick={() => onFilterClick(category)}
            >
                {category} ({count})
            </button>
          </div>
        ))}
      </div>
    );
  };

  
  export default FilterButton;