import pandas as pd
from prophet import Prophet
import json
from scipy import stats

def find_spikes(data, formula):
    df = pd.DataFrame(data)
    # Process the data
    df.dropna(inplace= True)
    df.reset_index(drop=True, inplace=True)
    df['Quantity_Sold'] = df['Quantity_Sold'].astype(str).astype(int)

    formula = int(formula)
    if("Spike" in df):  
        df = df.drop(['Spike'], axis=1)
        
    if formula == 1: # MAD
        mad = abs(df['Quantity_Sold'] - df['Quantity_Sold'].median()).median()
        med = df['Quantity_Sold'].median()

        # add a new column, true if a spike is detected, false o/w
        df["Spike"] = (abs(df['Quantity_Sold'] - med) / mad) > 3.5
        print(df[df["Spike"] == True].iloc[0])

    elif formula == 2: # Interquartile Range
        q1 = df['Quantity_Sold'].quantile(0.25)
        q3 = df['Quantity_Sold'].quantile(0.75)
        IQR = q3 - q1
        # add a new column, true if a spike is detected, false o/w
        df["Spike"] = ((df['Quantity_Sold'] < (q1 - (1.5*IQR))) | (df['Quantity_Sold'] > (q3 + (1.5*IQR))))
        print(df[df["Spike"] == True].iloc[0])
    
    elif formula == 3: # Z-score
        df['z_score'] = stats.zscore(df['Quantity_Sold'])
        # add a new column, true if a spike is detected, false o/w
        
        df["Spike"] = (abs(df['z_score']) >= 3)
        df = df.drop(['z_score'], axis=1)
        print(df[df["Spike"] == True].iloc[0])

    result = df.to_json(orient='records')
    return result

def create_forecast(data):
    df = pd.DataFrame(data)

    # Process the data
    df.dropna(inplace= True)
    df.reset_index(drop=True, inplace=True)

    # Note: These column name must be same and need to be inforced
    df = df[['Date', 'Quantity_Sold']]

    # Rename the columns for Prophet
    df.columns = ['ds','y']

    # Make sure datetime format is correct
    df['ds'] = pd.to_datetime(df['ds'])

    # Set the best parameters for Prophet (technically should check this everytime)
    params = {
        'changepoint_prior_scale': 0.001,
        'seasonality_prior_scale': 0.01,
        'holidays_prior_scale': 0.01,
        'seasonality_mode': 'additive'
    }

    # Run Prophet on df
    m = m = Prophet(**params, yearly_seasonality=100).add_country_holidays(country_name='US')
    m = m.fit(df)
    future = m.make_future_dataframe(periods=53, freq="w", include_history = False)
    forecast = m.predict(future)

    forecast = forecast[['ds', 'yhat']] 

    # Rename columns to t and y for graph plotting
    forecast.columns = ['x', 'y']

    forecast = forecast.to_json(orient='records', date_format='iso', date_unit='s')

    forecast = json.loads(forecast)
    return forecast


def create_forecast_exclude_spike(data):
    df = pd.DataFrame(data)

    # Process the data
    df.dropna(inplace= True)
    df.reset_index(drop=True, inplace=True)


    # choose non-spike columns
    df = df[df['Spike'] == False]

    # Note: These column name must be same and need to be inforced
    df = df[['Date', 'Quantity_Sold']]

    # Rename the columns for Prophet
    df.columns = ['ds','y']

    # Make sure datetime format is correct
    df['ds'] = pd.to_datetime(df['ds'])

    # Set the best parameters for Prophet (technically should check this everytime)
    params = {
        'changepoint_prior_scale': 0.001,
        'seasonality_prior_scale': 0.01,
        'holidays_prior_scale': 0.01,
        'seasonality_mode': 'additive'
    }

    # Run Prophet on df
    m = m = Prophet(**params, yearly_seasonality=100).add_country_holidays(country_name='US')
    m = m.fit(df)
    future = m.make_future_dataframe(periods=53, freq="w", include_history = False)
    forecast = m.predict(future)

    forecast = forecast[['ds', 'yhat']] 

    # Rename columns to t and y for graph plotting
    forecast.columns = ['x', 'y']

    forecast = forecast.to_json(orient='records', date_format='iso', date_unit='s')

    forecast = json.loads(forecast)
    return forecast