import React from 'react';
import '../styles/FilterButton.css';
import { Flex } from 'antd';

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
        return 150 + (count * 10); // Base size + size increment based on count
    };

    const PFP = () => {
      return (
        <>
          <img
              src={"/pfp/woman_1.png"} 
              style={{
                  position: 'absolute',
                  width: '30%', 
                  height: '30%', 
                  top: '20%',
                  left: '25%',
                  transform: 'translate(-50%, -50%)'
              }}
          />
          <img
              src={"/pfp/woman_2.png"} 
              style={{position: 'absolute',
                  width: '20%', 
                  height: '20%', 
                  top: '15%',
                  left: '60%',
                  transform: 'translate(-50%, -50%)'
              }}
          />
          <img
              src={"/pfp/man.png"} 
              style={{
                  position: 'absolute',
                  width: '25%', 
                  height: '25%', 
                  top: '90%',
                  left: '80%',
                  transform: 'translate(-50%, -50%)'
              }}
          />
        </>
      )
    }
  
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
                  fontSize: 18,
                  position: 'relative'
                }}
                onClick={() => onFilterClick(category)}
            >
              {index == 0 && <PFP />}
                {category}
            </button>
          </div>
        ))}
      </div>
    );
  };

  
  export default FilterButton;