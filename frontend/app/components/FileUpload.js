import React from 'react';
import { useForm } from 'react-hook-form';
import { Box, Button, Input } from '@chakra-ui/react';
import Papa from 'papaparse';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
let ids = {}

const FileUpload = () => {
  const router = useRouter();
  const { register, handleSubmit } = useForm();

  if(localStorage.getItem('ids')){
    ids = JSON.parse(localStorage.getItem('ids'));
  }

  const findSpikes = async () => {
    const ids_json = JSON.parse(localStorage.getItem("ids"));
    let input_data = {}
    Object.keys(ids_json).forEach(function(key) {
      console.log('Key : ' + key + ', Value : ' + ids_json[key])

      input_data[ids_json[key]] = JSON.parse(localStorage.getItem(ids_json[key]))
      input_data['formula'] = 1
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
          Object.keys(data).forEach(function(key) {
              localStorage.setItem(key, data[key]);
              console.log("Forecast is saved in local storage with key " + key + data[key])
            })
        });
      

      } catch (error) {
          console.error('Fail', error.message);
      }

  }

  const onSubmit = async (data) => {
    const uniqueID = uuidv4();
    const file = data.file[0];
    if (file) {
      // Parse the CSV file
      const parsedData = await parseCSVFile(file);
      parsedData.forEach(row => {
         row["Quantity_Sold_Raw"] = row["Quantity_Sold"];
      });
      let key = parsedData[0]["Name"]

      // check if this product is already in the local storage
      let thisSession = JSON.parse(localStorage.getItem("ids"))
      if (!thisSession || !thisSession.hasOwnProperty(key)) {
        // Store the parsed data in localStorage
        localStorage.setItem(uniqueID.toString(), JSON.stringify(parsedData));
        ids[key] = uniqueID.toString();
        localStorage.setItem("ids", JSON.stringify(ids));
      }

      findSpikes()

      const formData = new FormData();
      formData.append('file', file);
      formData.append('uniqueID', uniqueID);
  
      // Make the POST request to your backend endpoint
      try {
        const response = await fetch('http://127.0.0.1:5000/upload', {
          method: 'POST',
          body: formData,
        });
  
        if (response.ok) {
          // File successfully uploaded
          console.log('File successfully uploaded');
          handleRedirect();
        } else {
          // Handle error response
          console.error('Failed to upload file:', response.statusText);
        }
        } catch (error) {
        console.error('Error uploading file:', error.message);
        }
      handleRedirect();
    }
  };

  const parseCSVFile = (file) => {
    return new Promise((resolve) => {
      Papa.parse(file, {
        complete: (result) => {
          resolve(result.data);
        },
        header: true, // If your CSV has a header row
      });
    });
  };

  const handleRedirect = () => {
     router.push('/products');
  };

  return (
    <Box padding={"2%"}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input type="file" {...register('file')} borderWidth={0} />
        <Button marginLeft={"1%"} type="submit">Upload File</Button>
      </form>
    </Box>
  );
};

export default FileUpload;