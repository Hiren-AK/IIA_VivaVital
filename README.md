# VivaVital: Health and Nutrition Tracker

VivaVital is a comprehensive platform designed to track and manage your health and nutritional intake, providing a seamless integration of various health metrics and dietary habits. 

## Features

- Track physical activities and sleep patterns.
- Log dietary habits and nutritional intake.
- Monitor heart rate and blood oxygen levels.
- Manage user demographics and preferences.

## Getting Started

These instructions will guide you through the setup process to get the project running on your local machine for development and testing purposes.

### Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 14 or higher)
- [npm](https://www.npmjs.com/get-npm) (usually installed with Node.js)
- [MySQL](https://dev.mysql.com/downloads/mysql/)

### Installation

Follow these steps to set up the project locally.

1. **Clone the Repository**

2. **Set Up the Server**

    Navigate to the server directory, install dependencies, and start the server:

    ```sh
    cd server
    npm install
    npm start
    ```

3. **Set Up the Client**

    Open a new terminal, navigate to the client directory, install dependencies, and start the React application:

    ```sh
    cd client
    npm install
    npm start
    ```

    The application should now be running on `http://localhost:8001`.

4. **Configure MySQL Database**

    Update the database configuration in the server application (.env) and etl_script.py to match your MySQL setup.
    Ensure you have the required libraries installed (pymysql, pandas, openpyxl) and replace "your_password" with your actual MySQL root password.
    Run the etl_script.py ONLY ONCE IN THE START.
    ```python3
    pip install pymysql, pandas, openpyxl
    python3 etl_script.py
    ```
    To check if it ran:
    ```node
    node listTables.js
    ```

### Configuration

- Create a `.env` file in the `server` directory and add your environment variables:

  ```env
  PORT=8001
  DB_HOST=localhost
  DB_USER=vivavitaluser
  DB_PASSWORD=yourpassword
  DB_NAME=VivaVital
  ````

### Running the Application

Follow these steps:

1. **Start the server (if not already running):**
   
   Navigate to the server directory and start the server:

    ```sh
    cd client
    npm start
    ```

2. **Start the client (if not already running):**

    Navigate to the client directory and start the client:

    ```sh
    cd client
    npm start
    ```

3. **Navigate to http://localhost:80001 in your browser to view and interact with the application.**
