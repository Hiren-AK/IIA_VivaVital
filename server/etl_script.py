import os
import pymysql
import pandas as pd
import numpy as np
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv('./final.env')

# Database credentials
db_config = {
    "host": os.getenv("VV_HOST"),
    "user": os.getenv("VV_USER"),
    "password": os.getenv("VV_PASSWORD"),
    "database": os.getenv("VV_NAME")
}

def create_connection():
    """Creates and returns a database connection."""
    try:
        connection = pymysql.connect(**db_config)
        return connection
    except Exception as e:
        print(f"Error connecting to database: {e}")
        return None

def create_tables(connection):
    """Creates the necessary tables in the database."""
    try:
        with connection.cursor() as cursor:
            # Create User table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS Users (
                    UserID INT AUTO_INCREMENT PRIMARY KEY,
                    Username VARCHAR(50) UNIQUE NOT NULL,
                    Email VARCHAR(100) UNIQUE NOT NULL,
                    PasswordHash VARCHAR(255) NOT NULL,
                    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                );
            """)

            # Create Health Metrics Table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS Health_Metrics (
                    MetricID INT AUTO_INCREMENT PRIMARY KEY,
                    UserID INT,
                    Date DATE,
                    HeartRate INT,
                    Steps INT,
                    SleepDuration DOUBLE,
                    OtherMetrics TEXT,
                    FOREIGN KEY (UserID) REFERENCES Users(UserID),
                    INDEX (UserID)  -- Adding an index on UserID
                );
            """)

            # Create Dietary Information Table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS Dietary_Information (
                    EntryID INT AUTO_INCREMENT PRIMARY KEY,
                    UserID INT,
                    Date DATE,
                    MealType VARCHAR(50),
                    FoodItem VARCHAR(255),
                    Calories DOUBLE,
                    Nutrients TEXT,
                    FOREIGN KEY (UserID) REFERENCES Users(UserID),
                    INDEX (UserID)  -- Adding an index on UserID
                );
            """)

            # Create Wearable Data Table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS Wearable_Data (
                    DataID INT AUTO_INCREMENT PRIMARY KEY,
                    UserID INT,
                    DeviceID VARCHAR(100),
                    Timestamp TIMESTAMP,
                    DataType VARCHAR(50),
                    Value DOUBLE,
                    FOREIGN KEY (UserID) REFERENCES Users(UserID),
                    INDEX (UserID)  -- Adding an index on UserID
                );
            """)

            # Create Nutritional Information table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS Nutritional_Information (
                    ID INT AUTO_INCREMENT PRIMARY KEY,
                    Food_Item VARCHAR(255),
                    Calories FLOAT,
                    Protein DOUBLE,
                    Fats FLOAT,
                    Carbohydrates FLOAT,
                    Saturated_Fats FLOAT
                );
            """)

            
            # Create Dietary Preferences table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS Dietary_Preferences (
                    PreferenceID INT AUTO_INCREMENT PRIMARY KEY,
                    Preference VARCHAR(255),
                    Food_Item TEXT
                );
            """)
    except Exception as e:
        print(f"Error creating tables: {e}")
        connection.close()
        return

def etl_process_to_mysql(host, user, password, database):
    # Connect to MySQL database
    connection = pymysql.connect(host=host,
                                 user=user,
                                 password=password,
                                 database=database,
                                 charset='utf8mb4',
                                 cursorclass=pymysql.cursors.DictCursor)
    
    # EXTRACTION
    abbrev_df = pd.read_excel("./data/ABBREV.xlsx")
    nutrition_df = pd.read_csv("./data/nutrition.csv")
    database_json_df = pd.read_json("./data/Database.json", orient='records', lines=True)

    # TRANSFORMATION
    abbrev_transformed = abbrev_df[['NDB_No', 'Shrt_Desc', 'Energ_Kcal', 'Protein_(g)', 'Lipid_Tot_(g)', 'Carbohydrt_(g)']].copy()
    abbrev_transformed.columns = ['ID', 'Food_Item', 'Calories', 'Protein', 'Fats', 'Carbohydrates']
    
    nutrition_transformed = nutrition_df[['name', 'calories', 'total_fat', 'saturated_fat', 'protein', 'carbohydrate']].copy()
    nutrition_transformed.columns = ['Food_Item', 'Calories', 'Fats', 'Saturated_Fats', 'Protein', 'Carbohydrates']
    
    # Combining both dataframes
    nutritional_information_df = pd.concat([abbrev_transformed, nutrition_transformed], ignore_index=True)
    nutritional_information_df.replace({np.nan: None}, inplace=True)
    nutritional_information_df['Protein'] = nutritional_information_df['Protein'].str.replace(' g', '', regex=False)
    nutritional_information_df['Protein'] = nutritional_information_df['Protein'].astype(float)
    nutritional_information_df['Protein'].fillna(value=0, inplace=True)
    nutritional_information_df['Fats'] = nutritional_information_df['Fats'].str.replace('g', '', regex=True).str.strip().astype(float)
    nutritional_information_df['Fats'] = nutritional_information_df['Fats'].astype(float)
    nutritional_information_df['Carbohydrates'] = nutritional_information_df['Carbohydrates'].str.replace('[^\d.]', '', regex=True).astype(float)
    nutritional_information_df['Saturated_Fats'] = nutritional_information_df['Saturated_Fats'].str.replace('[^\d.]', '', regex=True).astype(float)
    nutritional_information_df.fillna(0, inplace=True)


    # Assuming the maximum ID from the 'abbrev_transformed' dataframe is the last ID used
    max_id = abbrev_transformed['ID'].max()

    # Fill NaN values in 'ID' column with a range of numbers starting from the max_id + 1
    nan_ids = nutritional_information_df['ID'].isna()
    nutritional_information_df.loc[nan_ids, 'ID'] = range(max_id + 1, max_id + 1 + nan_ids.sum())
    

    # Transforming the data from Database.json to a long format suitable for insertion
    dietary_preferences = database_json_df.melt(id_vars=[], 
                                                value_vars=database_json_df.columns, 
                                                var_name='Preference', 
                                                value_name='Food_Item')
    # Drop NaN rows and reset index
    dietary_preferences = dietary_preferences.dropna().reset_index(drop=True)

    try:
        with connection.cursor() as cursor:
            # Insert data into Nutritional Information table
            for _, row in nutritional_information_df.iterrows():
                cursor.execute(f"""
                    INSERT INTO Nutritional_Information (ID, Food_Item, Calories, Protein, Fats, Carbohydrates, Saturated_Fats)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                """, (row['ID'], row['Food_Item'], row['Calories'], row['Protein'], row['Fats'], row['Carbohydrates'], row.get('Saturated_Fats', None)))
            
            # Insert data into Dietary Preferences table
            for _, row in dietary_preferences.iterrows():
                for item in row['Food_Item']:
                    cursor.execute("""
                        INSERT INTO Dietary_Preferences (Preference, Food_Item)
                        VALUES (%s, %s)
                    """, (row['Preference'], item))
            
            # Commit the changes
            connection.commit()
            
    finally:
        connection.close()

    # For testing purposes, we'll return a message indicating the process has been completed.
    return "ETL process to MySQL completed!"

def initialize_and_create_database(host, user, password):
    """Drops the VivaVital database if it exists and then creates it."""
    connection = pymysql.connect(host=host, user=user, password=password, charset='utf8mb4', cursorclass=pymysql.cursors.DictCursor)
    try:
        with connection.cursor() as cursor:
            # Drop the database if it exists
            cursor.execute("DROP DATABASE IF EXISTS VivaVital;")
            # Create the database
            cursor.execute("CREATE DATABASE VivaVital;")
    except Exception as e:
        print(f"Error handling the database: {e}")
    finally:
        connection.close()

if __name__ == "__main__":
    # Drop existing VivaVital database (if it exists) and create a new one
    connection_config = {k: db_config[k] for k in ('host', 'user', 'password')}  # Excluding the 'database' key
    initialize_and_create_database(**connection_config)

    # Connect to the newly created VivaVital database
    connection = create_connection()

    if connection:
        # Create tables and load data
        create_tables(connection)
        etl_process_to_mysql(**db_config)
        connection.close()