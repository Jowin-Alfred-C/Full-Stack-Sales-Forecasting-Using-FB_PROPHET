import numpy as np
from flask import Flask, request, jsonify, Blueprint
import os
from werkzeug.security import generate_password_hash, check_password_hash
from pymongo import MongoClient
from flask_cors import CORS

import json
import plotly
import plotly.graph_objs as go
import plotly.io as pio
from PIL import Image
from io import BytesIO

import io
import pandas as pd
import numpy as np
import itertools
import base64
import re


import numpy as np
import pandas as pd

import matplotlib.pyplot as plt


from prophet import Prophet



from sklearn.metrics import r2_score
from sklearn.metrics import mean_squared_error
from sklearn.metrics import mean_absolute_error


app = Flask(__name__)
auth_bp = Blueprint('auth', __name__)
CORS(app)



client = MongoClient('mongodb://localhost:27017/')
db = client['mydatabase']



UPLOAD_FOLDER = 'uploaded_files'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


@app.route('/register', methods=['POST'])
def register():
    # data = request.json
    username = request.form.get('username')
    email = request.form.get('email')
    password =request.form.get('password')
    confirmpassword = request.form.get('confirmpassword')

    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return jsonify({'error': 'Invalid email format.'}), 400

    if password != confirmpassword:
        return jsonify({'error': 'Passwords do not match.'}), 400

    user = db.users.find_one({'email': email})

    if user:
        return jsonify({'error': 'Email already exists.'}), 400

    db.users.insert_one({'username': username, 'email': email, 'password': password})
    return jsonify({'message': 'User registered successfully.'}), 201

@app.route('/login', methods=['POST'])
def login():
    # data = request.json
    email = request.form.get('email')
    password =request.form.get('password')

    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return jsonify({'error': 'Invalid email format.'}), 400

    user = db.users.find_one({'email': email})

    if not user:
        return jsonify({'error': 'Email not found.'}), 401

    if user['password'] != password :
        return jsonify({'error': 'Invalid password.'}), 401

    return jsonify({'message': 'Login successful.'}), 200


       


@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        file = request.files['file']
        file_path=os.path.join(app.config['UPLOAD_FOLDER'],file.filename)
        file.save(file_path)
        # return file_path

        #inputs
        data = pd.read_csv(file_path)
        x = request.form.get('x')
        y = request.form.get('y')
        frequency=request.form.get('frequency')
        forecast_period=request.form.get('forecast_period')
        forecast_period=int(forecast_period)
        start_date=request.form.get('start_date')
        end_date=request.form.get('end_date')


        data.dropna(inplace=True)

        data=data[[x,y]]

        data = data.groupby(x)[y].sum().reset_index()

        data = data.rename(columns={x:'ds', y:'y'})
        data['ds'] = pd.to_datetime(data['ds'], format='%Y-%m-%d')

        model = Prophet()
        model.fit(data)

        from datetime import date, timedelta, datetime

        start_dt = datetime.strptime(start_date, '%Y-%m-%d').date()
        end_dt = datetime.strptime(end_date, '%Y-%m-%d').date()

        # difference between current and previous date
        delta = timedelta(days=1)

        # store the dates between two dates in a list
        dates = []

        while start_dt <= end_dt:
       # add current date to list by converting  it to iso format
           dates.append(start_dt.isoformat())
       # increment start date by timedelta
           start_dt += delta
    
        dates = pd.DataFrame({'ds': dates})
        #dates.columns = ['ds']
        dates['ds']= pd.to_datetime(dates['ds'])

        forecast_btw_two_dates=model.predict(dates)


        future = model.make_future_dataframe(periods=forecast_period,freq = frequency,include_history = True)
        forecast = model.predict(future)
        sales_forecast_plot = model.plot(forecast)

        sales_forecast_components = model.plot_components(forecast)
        
      
        img_buffer1 = BytesIO()
        sales_forecast_plot.savefig(img_buffer1, format='png')
        img_buffer1.seek(0)

        img_buffer2 = BytesIO()
        sales_forecast_components.savefig(img_buffer2, format='png')
        img_buffer2.seek(0)

        # encode image data to base64 string
        encoded_image1 = base64.b64encode(img_buffer1.getvalue()).decode('utf-8')
        encoded_image2 = base64.b64encode(img_buffer2.getvalue()).decode('utf-8')
        
        metric_df = forecast.set_index('ds')[['yhat']].join(data.set_index('ds').y).reset_index()
        metric_df.dropna(inplace=True)



        r2score=r2_score(metric_df.y, metric_df.yhat)
        mse=mean_squared_error(metric_df.y, metric_df.yhat)
        rmse=np.sqrt(mean_squared_error(metric_df.y, metric_df.yhat))
        mae=mean_absolute_error(metric_df.y, metric_df.yhat)
        mape=np.mean(abs((metric_df.y - metric_df.yhat) / metric_df.y)) * 100

        metric_dict = {'R2 Score': r2score, 'Mean Squared Error ': mse, 'Root Mean Squared Error ': rmse, 'Mean Absolute Error ': mae, 'Mean Absolute Percentage Error': mape}




        #output
        result_forecast_btw_two_dates = forecast_btw_two_dates[['ds', 'yhat']].to_dict('records')
        return jsonify({'result': result_forecast_btw_two_dates,'image1': encoded_image1,'image2': encoded_image2, 'metric': metric_dict})
       
    
if __name__ == "__main__":
    app.run(debug=True)
