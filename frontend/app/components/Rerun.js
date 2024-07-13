import React, { useState, useEffect } from 'react';
import { Select, Box, Button, Container, Spinner } from '@chakra-ui/react';
import { Checkbox, CheckboxGroup, Stack } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

const Rerun = ({}) => {
    const router = useRouter();
    const storedData = localStorage.getItem('ids');
    const data = JSON.parse(storedData)
    const keys = Object.keys(data)
    const [selectedOption, setSelectedOption] = useState(new Array(keys.length).fill(false));
    const [isLoading, setIsLoading] = useState(false);

    const getIds = () => {
        let result = {}
        selectedOption.map((value, idx) => {
            if(value == true){
                let product_id = data[keys[idx]]
                result[product_id] = JSON.parse(localStorage.getItem(product_id))
            }
        })
        return result;
     };

     const handleRedirect = () => {
        router.push('/forecast');
     };

    const handleSubmit = async () => {
        setIsLoading(true)
        const product_id_data = getIds()
        try {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify(product_id_data),
                redirect: 'follow'
              };

            const response = await fetch('http://127.0.0.1:5000/forecast', requestOptions).then(function(response) {
                // The response is a Response instance.
                // You parse the data into a useable format using `.json()`
                return response.json();
              }).then(function(data) {
                // `data` is the parsed version of the JSON returned from the above endpoint.
                Object.keys(data).forEach(function(key) {
                    localStorage.setItem("forecast_" + key, JSON.stringify(data[key]));
                    console.log("Forecast is saved in local storage with key forecast_" + key)
                  })
              });
            
    
            } catch (error) {
                console.error('Fail', error.message);
            }
        setIsLoading(false)
        handleRedirect();
     };

    return (
        <Container>
            <Stack spacing={5} direction='column'>
                {keys.map((option, index) => (
                    <Checkbox key={index}
                        onChange={(e) => {
                            let oldArr = [...selectedOption];
                            oldArr[index] = e.target.checked
                            setSelectedOption(oldArr)
                        }}
                    >{option}</Checkbox>
                ))}
            </Stack>
            <Button onClick={handleSubmit} type="submit">Run Forecast</Button>
            {isLoading && <Spinner />}
        </Container>
    );
};

export default Rerun;