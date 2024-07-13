import React, { useEffect, useState } from 'react';
import { Box, Input, Grid, GridItem, Button, Modal, ModalFooter, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, useDisclosure, Flex, Center, Select } from '@chakra-ui/react';
import FileUpload from './FileUpload';

const Product = ({item}) => {
    const [gridData, setGridData] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const finalRef = React.useRef(null)
    const [filterSpikes, setFilterSpike] = useState(false);
    const [filterChanges, setFilterChanges] = useState(false);
    const [formula, setFormula] = useState(1);
    
    const [localStorageChanged, setLocalStorageChanged] = useState(false)

    useEffect(() => {
    const storedData = localStorage.getItem('ids');
    const id = JSON.parse(storedData)
    let productID = id[item];

    if (productID) {
        let data = localStorage.getItem(productID)
        const parsedData = JSON.parse(data);
        setGridData(parsedData);
        }
    }, [item]);

    const handleInputChange = (event) => {
        setInputValue(event.target.value)
    };

    const findSpikes = async (value = null) => {
        const ids_json = JSON.parse(localStorage.getItem("ids"));
        let input_data = {}
        Object.keys(ids_json).forEach(function(key) {
          input_data[ids_json[key]] = JSON.parse(localStorage.getItem(ids_json[key]))
          if(value != null){
              input_data['formula'] = value
          }
          else{
              input_data['formula'] = formula
          }
        })
        
        try {
          var myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");
    
          var requestOptions = {
              method: 'POST',
              headers: myHeaders,
              body: JSON.stringify(input_data),
              redirect: 'follow'
            };
    
          const response = await fetch('http://127.0.0.1:5000/spike', requestOptions).then(function(response) {
              // The response is a Response instance.
              // You parse the data into a useable format using `.json()`
              return response.json();
            }).then(function(data) {
              // `data` is the parsed version of the JSON returned from the above endpoint.
            for (const key in data){
                    if(data.hasOwnProperty(key)){
                    localStorage.setItem(key, data[key]);  
                    }
                    setLocalStorageChanged(!localStorageChanged)
            }
            });
          
    
          } catch (error) {
              console.error('Fail', error.message);
          }
      }

    const commitChange = () => {
        let editedRow = {...gridData[currentIndex]};
        const floatValue = parseFloat(inputValue);

        if (isNaN(floatValue)) {
         throw new Error('Invalid numeric value');
        }

       editedRow['Quantity_Sold'] = floatValue;

       const storedData = localStorage.getItem('ids');
       const id = JSON.parse(storedData)
       let productID = id[item];

       if(!productID){
        throw new Error('Product does not exist');
       }

       setGridData(prevGridData => {
        const newGridData = prevGridData.map((item, index) => (index === currentIndex ? editedRow : item))
        const productDataString = JSON.stringify(newGridData);
        localStorage.setItem(productID, productDataString);
        findSpikes();
        return newGridData;
       });

       onClose();
    }

    const reloadGridData = () => {
        const storedData = localStorage.getItem('ids');
        const id = JSON.parse(storedData)
        let productID = id[item];

        if (productID) {
        let data = localStorage.getItem(productID)
        const parsedData = JSON.parse(data);
        setGridData(parsedData);
        }
    }
    
    if(gridData.length > 0){
        return (
            <Box bg='orange.200'>
                <Flex padding={"0.5%"}>
                    <Center marginLeft={"4%"}>
                        Filters:
                    </Center>
                    <Box p='4'>
                        <Select backgroundColor={"white"} onChange={async (e)=>{
                            setFormula(e.target.value)
                            await findSpikes(e.target.value);
                            reloadGridData()
                            }}>
                            <option value={1}>Mean Absolute Difference</option>
                            <option value={2}>Interquartile Range</option>
                            <option value={3}>Z-score</option>
                        </Select>
                    </Box>
                    <Box p='4'>
                        <Button backgroundColor={"white"} onClick={async ()=>{
                            setFilterChanges(false); 
                            setFilterSpike(true);
                            }} type="submit">Spikes</Button>
                    </Box>
                    <Box marginLeft={"5px"} p='4'>
                        <Button backgroundColor={"white"} onClick={()=>{
                          setFilterSpike(false); 
                          setFilterChanges(true)
                        }} type="submit">Changes</Button>
                    </Box>
                    <Box marginLeft={"0.5%"} p='4'>
                        <Button backgroundColor={"white"} 
                        onClick={()=>{
                          setFilterSpike(false); 
                          setFilterChanges(false)
                        }} type="submit">Reset</Button>
                    </Box>
                </Flex>
                <Box ref={finalRef} p={8}>
                <Grid templateAreas={`"Name Date Quantity_Sold Quantity_Sold_Raw Price_per_Unit Spike Edit"`}
                color='blackAlpha.700'
                h = '100px'
                fontWeight='bold'
                templateRows="repeat(1, minmax(0, 1fr))"
                gap={3}
                p = {4}>
                    <GridItem h='50px' w='150px' textColor='white' bg="blackAlpha.800" p={4} borderRadius="md" area={'Name'}>
                        Product Name
                    </GridItem>
                    <GridItem h='50px' w='150px' textColor='white' bg="blackAlpha.800" p={4} borderRadius="md" area={'Date'}>
                        Date
                    </GridItem>
                    <GridItem h='50px' w='150px' textColor='white' bg="blackAlpha.800" p={4} borderRadius="md" area={'Quantity_Sold'}>
                        Quantity Sold
                    </GridItem>
                    <GridItem h='50px' w='200px' textColor='white' bg="blackAlpha.800" p={4} borderRadius="md" area={'Quantity_Sold_Raw'}>
                        Quantity Sold Raw
                    </GridItem>
                    <GridItem h='50px' w='175px' textColor='white' bg="blackAlpha.800" p={4} borderRadius="md" area={'Price_per_Unit'}>
                        Price per Unit
                    </GridItem>
                    <GridItem h='50px' w='150px' textColor='white' bg="blackAlpha.800" p={4} borderRadius="md" area={'Spike'}>
                        Spike
                    </GridItem>
                    <GridItem h='50px' w='150px' textColor='white' bg="blackAlpha.800" p={4} borderRadius="md" area={'Edit'}>
                        Options
                    </GridItem>
                </Grid>
                {gridData.map((item, index) => {
                    if((!filterSpikes && !filterChanges)|| (filterSpikes && item.Spike == true) || (filterChanges && (item.Quantity_Sold != item.Quantity_Sold_Raw))){
                        //if both filters off, will display everything
                        return (
                            <Grid 
                            templateAreas={`"name date quantity_sold quantity_sold_raw price_per_unit spike edit"`}
                            color='blackAlpha.700'
                            fontWeight='bold'
                            gap={4}
                            p={4}
                            templateRows="repeat(1, minmax(0, 1fr))" key={index}>
                            <GridItem h='50px' w='150px' bg="orange.50" p={4} borderRadius="md" area={'name'}>
                                {item.Name}
                            </GridItem>
                            <GridItem h='50px' w='150px' bg="orange.50" p={4} borderRadius="md" area={'date'}>
                                {item.Date}
                            </GridItem>
                            {item.Quantity_Sold == item.Quantity_Sold_Raw ? 
                            (<GridItem h='50px' w='150px' bg="orange.50" p={4} borderRadius="md" area={'quantity_sold'}>
                                {item.Quantity_Sold}
                            </GridItem>) : 
                            (<GridItem h='50px' w='150px' bg="red.100" p={4} borderRadius="md" area={'quantity_sold'}>
                                {item.Quantity_Sold}
                            </GridItem>)}
                            <GridItem h='50px' w='200px' bg="gray.100" cursor={"not-allowed"} p={4} borderRadius="md" area={'quantity_sold_raw'}>
                                {item.Quantity_Sold_Raw}
                            </GridItem>
                            <GridItem h='50px' w='175px' bg="orange.50" p={4} borderRadius="md" area={'price_per_unit'}>
                                {String(parseFloat(item.Price_per_Unit).toFixed(3))}
                            </GridItem>
                            <GridItem h='50px' w='150px' bg="orange.50" p={4} borderRadius="md" area={'spike'}>
                                {JSON.stringify(item.Spike)} 
                            </GridItem>
                            <GridItem h='50px' w='150px' bg="orange.100" p={2} borderRadius="md" area={'edit'}>
                                <Button onClick={() => {onOpen(); setCurrentIndex(index)}} textColor='white' bg='blackAlpha.800' variant='outline' h='100%' w='100%' >Edit</Button>
                            </GridItem>
                        </Grid>
                    );}else{
                        return null
                    }
                })}
            </Box>
            <div>
                <Modal finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                    <ModalHeader>Edit Quantity</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Input placeholder="Enter new Quantity" onChange={handleInputChange} size='md' />
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='orange' mr={3} onClick={() => {commitChange()}}>
                            Update
                        </Button>
                    </ModalFooter>
                    </ModalContent>
                </Modal>
            </div>
        </Box>
        );
    } else {
        return null;
    }
};

export default Product;