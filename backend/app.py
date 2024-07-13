from flask import Flask, jsonify, request
from flask_cors import CORS
from model import create_forecast, find_spikes, create_forecast_exclude_spike

app = Flask(__name__)
CORS(app)

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/example', methods=['GET'])
def example_route():
    response_data = {"message": "Hello from the server!"}
    response = jsonify(response_data)
    return response

@app.route('/upload', methods=['POST'])
def upload_csv():
    if 'file' not in request.files:
        return 'No file part in the request', 400
    file = request.files['file']
    if file.filename == '':
        return 'No selected file', 400
    if not file.filename.endswith('.csv'):
        return 'Only CSV files are allowed', 400

    # Process the CSV file (you can customize this part)
    # For demonstration purposes, let's print the contents of the file
    file_contents = file.read().decode('utf-8')
    print(file_contents)

    return 'File uploaded successfully', 200

@app.route('/forecast', methods=['POST'])
def get_forecast():
    # Expected input json
    # {
    #     product_id: data from local storage
    # }

    try:
        # get json data
        data = request.get_json()

        final_result = {}
        
        for product_id in data.keys():
            final_result[product_id] = {
                'with_spike': create_forecast(data[product_id]),
                'without_spike': create_forecast_exclude_spike(data[product_id])
            }
            
            
        return final_result, 200
    except:
        return "some error occured", 400

@app.route('/spike', methods=['POST'])
def get_spikes():
    # Expected input json
    # {
    #     product_id: data from local storage
    # }
    try:
        # get json data
        data = request.get_json()

        final_result = {}

        for product_id in data.keys():
            if product_id != 'formula':
                final_result[product_id] = find_spikes(data[product_id], data['formula'])
            
        return final_result, 200
    except ValueError:
        return ValueError, 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)