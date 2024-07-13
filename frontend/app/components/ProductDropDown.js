import React, { useState, useEffect } from 'react';
import { Select, Box } from '@chakra-ui/react';
import Product from './Product';

const ProductDropdown = ({}) => {
    const storedData = localStorage.getItem('ids');
    const data = JSON.parse(storedData)
    const keys = Object.keys(data)
    const [selectedOption, setSelectedOption] = useState(keys[0]);

    const handleChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedOption(selectedValue);
    };

    return (
        <Box>
            <Select p={4} bg='blackAlpha.800' textColor='white' value={selectedOption} onChange={handleChange}>
                {keys.map((option, index) => (
                <option key={index} value={option}>
                {option}
                </option>
        ))}
            </Select>
            <Product item={selectedOption}/>
        </Box>
    );
};

export default ProductDropdown;