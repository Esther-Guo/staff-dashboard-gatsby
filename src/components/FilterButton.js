import React from 'react';
import '../styles/FilterButton.css';
import { Flex } from 'antd';
import { motion } from "framer-motion"

const RAINBOW_COLORS = [
    "#C7C4E2", "#FFCB66", "#BEDC8F", "#99CCFF",
    "#F4A7B9", "#FFE082", "#A3E4D7", "#D3B8AE",
    "#B5A3C9", "#E0BBE4", "#FFABAB", "#FAD1D1", "#B2DFDB"
  ];

const RAINBOW_COLORS_GRADIENT = [
  "#675FAD", "#CC9933", "#8BA661", "#6699CC",
  "#C37386", "#CCAD33", "#70B2A8", "#A38879",
  "#846792", "#B08EAD", "#CC7A7A", "#C4A1A1", "#80ABA8"
];

  const container = {
    hidden: { opacity: 1, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.3
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

const FilterButton = ({ data, onFilterClick }) => {

  
    // Aggregate data to get counts per category
    const categoryCounts = data.reduce((acc, item) => {
      acc[item] = (acc[item] || 0) + 1;
      return acc;
    }, {});
  


    // Function to determine size based on count
    const getSizeForCount = (count) => {
        return 250 + (count * 30); // Base size + size increment based on count
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
                  transform: 'translate(-50%, -50%)',
                  boxShadow: '0 18px 39px #00000033',
                  borderRadius: '50%'
              }}
          />
          <img
              src={"/pfp/woman_2.png"} 
              style={{position: 'absolute',
                  width: '20%', 
                  height: '20%', 
                  top: '15%',
                  left: '60%',
                  transform: 'translate(-50%, -50%)',
                  boxShadow: '0 18px 39px #00000033',
                  borderRadius: '50%'
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
                  transform: 'translate(-50%, -50%)',
                  boxShadow: '0 18px 39px #00000033',
                  borderRadius: '50%'
              }}
          />
        </>
      )
    }
  
    // Render filter items
    return (
      <motion.ul className="bubble-container container" variants={container}
      initial="hidden"
      animate="visible">
        {Object.entries(categoryCounts).map(([category, count], index) => (
          <motion.li key={index} className="item" variants={item}>
            <button
                key={category}
                style={{
                  background: `radial-gradient(circle, ${RAINBOW_COLORS[index % RAINBOW_COLORS.length]} 11%, ${RAINBOW_COLORS_GRADIENT[index % RAINBOW_COLORS_GRADIENT.length]} 100%)`,
                  // opacity: selectedFilter && selectedFilter !== category ? 0.5 : 1,
                  width: `${getSizeForCount(count)}px`,
                  height: `${getSizeForCount(count)}px`,
                  borderRadius: '50%', // Makes the button round
                  fontSize: 26,
                  textShadow: '1px 1px 2px gray',
                  position: 'relative'
                }}
                onClick={() => onFilterClick(category)}
            >
              {index == 0 && <PFP />}
                {category}
            </button>
          </motion.li>
        ))}
      </motion.ul>
    );
  };

  
  export default FilterButton;