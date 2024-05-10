from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import numpy as np
from sklearn.decomposition import PCA
import math
from sklearn.manifold import MDS
from sklearn import metrics

application = Flask(__name__)
CORS(application)  # Enable CORS

application.config['JSON_SORT_KEYS'] = False


@application.route('/country_details', methods=['POST'])
@cross_origin()
def country_data():
    if request.method == 'POST':
        json_data = request.get_json()
        if 'country' in json_data and 'year' in json_data:
            country = json_data['country']
            year = json_data['year']
            
            data = pd.read_csv('./sustainable-score.csv')
            if isinstance(country, list) and isinstance(year, list):
                if len(country) > 0 and len(year) > 0:
                    data = data[data['country'].isin(country) & data['year'].isin(year)]
                elif len(country) > 0:
                    data = data[data['country'].isin(country)]
                elif len(year) > 0:
                    data = data[data['year'].isin(year)]
                data.fillna("", inplace=True)
                return jsonify({'data': data.to_dict('records')})
            else:
                return jsonify({'error': 'Invalid data format. Both "country" and "year" should be lists'})
        else:
            return jsonify({'error': 'Invalid or missing "country" or "year" key in JSON data'})
    else:
        return jsonify({'error': 'Invalid request method. Only POST requests are allowed'})

        
@application.route('/year_details', methods=['POST'])
@cross_origin()
def year_data():
    if request.method == 'POST':
        json_data = request.get_json()
        if 'year' in json_data:
            year = json_data['year']
            data = pd.read_csv('./sustainable-score.csv')

            data = data[data['year'] == year].drop(['year'], axis=1)

            # Return data as JSON
            return jsonify({'data': data.to_dict('records')})

        else:
            return jsonify({'error': 'No or invalid "post" key found in JSON data'})

@application.route('/scatter_plot_matrix', methods=['GET'])
@cross_origin()
def scatter_plot_data():
    # Read the dataset
    data = pd.read_csv("./sustainable-score.csv")

    # Separate data for 2018 and 2023
    data_2018 = data[data['year'] == 2018].drop(['country'], axis=1)
    data_2023 = data[data['year'] == 2023].drop(['country'], axis=1)

    # Apply KMeans clustering to each year's data
    kmeans_2018 = KMeans(n_clusters=4).fit(data_2018)
    kmeans_2023 = KMeans(n_clusters=4).fit(data_2023)

    # Assign cluster labels to each year's data
    data_2018['clusters'] = kmeans_2018.labels_
    data_2023['clusters'] = kmeans_2023.labels_

    # Return the scatter plot data for each year separately
    return jsonify({'data_2018': data_2018.to_dict('records'), 'data_2023': data_2023.to_dict('records')})


@application.route('/bi_plot', methods=['POST'])
@cross_origin()
def bi_plot():
    req1 = request.json
    kValue = req1.get('kValue')
    
    # Read the dataset for 2018
    data = pd.read_csv("./sustainable-score.csv")
    data_2018 = data[data['year'] == 2018].drop(['country', 'year'], axis=1)
    data_2023 = data[data['year'] == 2023].drop(['country', 'year'], axis=1)
    
    # Calculate scatter plot data for 2018
    scatter_plot_data_2018 = calculate_bi_plot_data(data_2018, kValue)
    
    # Calculate scatter plot data for 2023
    scatter_plot_data_2023 = calculate_bi_plot_data(data_2023, kValue)
    
    return jsonify({'data_2018': scatter_plot_data_2018, 'data_2023': scatter_plot_data_2023})

def calculate_bi_plot_data(data, kValue):
    listData = list(data)
    kmeans = KMeans(n_clusters=kValue)
    kmeans = kmeans.fit(data)
    data['clusters'] = kmeans.labels_
    datapca = data.drop(["clusters"],axis=1)
    datapca = StandardScaler().fit_transform(datapca)
    pca_func = PCA(n_components=2)
    pcaData = pca_func.fit_transform(datapca)
    number = math.ceil(data.shape[0])
    pcaData = np.append(pcaData, data['clusters'].values.reshape(number, 1), axis=1)
    output = pd.DataFrame(pcaData,columns=['x','y','cluster'])
    output2 = pd.DataFrame(data=pca_func.components_.T, columns=['PC1','PC2'])
    output2.insert(loc=0, column='Attr', value=listData)
    return output.to_dict('records')

@application.route('/PcpData', methods=['POST'])
@cross_origin()
def PcpData():
    if request.method == 'POST':
        json_data = request.get_json()
        if 'country' in json_data:
            country = json_data['country']
            
            # Read data
            data_1 = pd.read_csv('./sustainable-score.csv')
            
            # Filter data for the given year
            filtered_data = data_1[data_1['country'] == country].drop(['country', 'URL'], axis=1)
            
            # Move the 'year' column to the front
            cols = filtered_data.columns.tolist()
            cols = ['year'] + [col for col in cols if col != 'year']
            filtered_data = filtered_data[cols]
            
            # Return data as JSON
            return jsonify({'data': filtered_data.to_dict('records')})
        else:
            return jsonify({'error': 'No or invalid "country" key found in JSON data'})

if __name__ == "__main__":
    application.run(debug=True, port=5000)