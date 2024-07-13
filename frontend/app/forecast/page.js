import React from 'react';
import styles from '../styles.css'; // If using CSS modules
import { Grid, GridItem, Button } from '@chakra-ui/react'
import Link from 'next/link';

import { ChakraProvider } from '@chakra-ui/react'
import ForecastGraph from '../components/Forecast';

export default function forecast() {
    return (
        <ChakraProvider>
            <Grid
            templateAreas={`"welcome header"
                            "import main"
                            "edit main"
                            "forecast main"
                            "rerun main"`}
            gridTemplateRows={'50px'}
            gridTemplateColumns={'150px'}
            h='790px'
            gap='1'
            color='blackAlpha.700'
            fontWeight='bold'
            >
            <GridItem p={2} bg='blackAlpha.800' textColor='white' area={'welcome'}>
                Welcome User!
            </GridItem>
            <GridItem p={2} bg='blackAlpha.800' textColor='white' area={'header'}>
                Product Data
            </GridItem>
            <GridItem bg='orange.200' p={2} area={'import'}>
                <Link href='/import'>
                    <Button bg='orange.100' variant='outline' h='100%' w='100%' >Import</Button>
                </Link> 
            </GridItem>
            <GridItem bg='orange.200' p={2} area={'edit'}>
                <Link href='/products'>
                    <Button bg='orange.100' variant='outline' h='100%' w='100%' >Edit Panel</Button>
                </Link>
            </GridItem>
            <GridItem bg='orange.200' p={2} area={'forecast'}>
                <Link href='/forecast'>
                    <Button bg='orange.100' variant='outline' h='100%' w='100%' >Forecast Graph</Button>
                </Link>
            </GridItem>
            <GridItem bg='orange.200' p={2} area={'rerun'}>
                <Link href='/rerun'>
                    <Button bg='orange.100' variant='outline' h='100%' w='100%' >Re-Run</Button>
                </Link>
            </GridItem>
            <GridItem pl='2' bg='orange.200' area={'main'}>
                <ForecastGraph></ForecastGraph>
            </GridItem>
            </Grid>
        </ChakraProvider>
    );
};

    
