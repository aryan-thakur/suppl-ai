"use client"; 

import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Center, Container, Flex, Select } from '@chakra-ui/react';
import 'chartjs-adapter-moment';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    Tooltip,
    PointElement,
    LineElement,
    TimeScale
  } from "chart.js";
  import { Line } from "react-chartjs-2";
import ProductDropdown from './ProductDropDown';

const ForecastGraph = ({}) => {

    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Tooltip,
        TimeScale
    );

    const storedData = localStorage.getItem('ids');
    const data = JSON.parse(storedData)
    const keys = Object.keys(data)
    const [selectedId, setSelectedId] = useState(data[keys[0]]);
    const [selectedKey, setSelectedKey] = useState(keys[0]);

    const [filterSpike, setFilterSpike] = useState(false);
    
    const [graphData, setGraphData] = useState(localStorage.getItem("forecast_" + selectedId));

    const handleChange = (event) => {
        const val = event.target.value;
        setSelectedId(data[val]);
        setSelectedKey(val)
    };

    useEffect(() => {
        setGraphData(localStorage.getItem("forecast_" + selectedId))
      }, [selectedId]);

    return (
        <Container>
            <Flex padding={"0.5%"}>
                    <Center>
                        Forecast:
                    </Center>
                    <Box p='4'>
                        <Button onClick={()=>{setFilterSpike(true)}} type="submit">Without Spikes</Button>
                    </Box>
                    <Box marginLeft={"0.5%"} p='4'>
                        <Button onClick={()=>{setFilterSpike(false)}} type="submit">With Spikes</Button>
                    </Box>
                </Flex>
             <Box>
                <Select p={4} bg='blackAlpha.800' textColor='white' value={selectedKey} onChange={handleChange}>
                    {keys.map((option, index) => (
                    <option key={index} value={option}>
                    {option}
                    </option>
            ))}
                </Select>
            </Box>
            <Line
            options={{
                scales: {
                    x: {
                        type: 'time',
                        gridLines: {
                            lineWidth: 2
                        },
                        time: {
                            unit: 'day',
                            unitStepSize: 1000,
                            displayFormats: {
                                day: 'MMM DD YYYY',
                            }
                        }}}
            }}
            data={{
            datasets: [
                {
                data: JSON.parse(graphData) ? (filterSpike? JSON.parse(graphData)["without_spike"] : JSON.parse(graphData)["with_spike"]) : null,
                backgroundColor: "purple",
                },
            ],
            }}
      />
        </Container>
    );
};

export default ForecastGraph;