# Points Tracker

## Overview

This project implements a DeFi (Decentralized Finance) user points tracking system. It collects and calculates points for users based on their interactions with a lending protocol (e.g., Aave) on the blockchain. The system fetches transaction data, calculates incentive points according to predefined rules, stores these points in a MongoDB database, and displays the points in a web frontend.

## System Architecture

The project consists of two main components:

1. **Backend (Express.js API)**: Connects to MongoDB to fetch and update user points based on blockchain transactions.
2. **Frontend (React Application)**: Displays user points in a styled table, fetching data from the backend.

## Backend Setup

### Technologies

- Node.js
- Express.js
- MongoDB
- Axios

### Key Features

- Fetches transaction data from The Graph API (Aave protocol on Polygon).
- Calculates points for actions such as deposits, borrows, repays, liquidation calls, and redeeming underlyings.
- Stores and updates user points in a MongoDB database.
- Provides a REST API endpoint to serve user points data.

### Running the Backend

1. Navigate to the backend directory: `cd my-server`.
2. Install dependencies: `npm install`.
3. Start the server: `node index.js`.

## Frontend Setup

### Technologies

- React
- Axios
- CSS for styling

### Key Features

- Fetches user points data from the backend.
- Displays the data in a user-friendly table.
- Implements basic styling for improved UI.

### Running the Frontend

1. Navigate to the frontend directory: `cd my-frontend`.
2. Install dependencies: `npm install`.
3. Start the React app: `npm start`.

## Data Model

User points are calculated based on the following rules:

- **Deposit points**: $100 worth of tokens deposited = +1 point.
- **Borrow points**: $100 worth of tokens borrowed = +4 points.
- **Repay points**: $100 worth of tokens repaid = +8 points.
- **Withdraw points**: $100 worth of tokens withdrawn = -1 point.
- **User got Liquidated**: $100 worth of tokens got liquidated = -10 points.
- **Liquidate other user**: $100 worth of tokens liquidated = +10 points.

## Challenges and Solutions

- **Challenge**: Ensuring accurate and duplicate-free point calculations.
- **Solution**: Implemented logic to correctly calculate points based on transactions and used MongoDB's `updateOne` with upserts to avoid duplicates.

- **Challenge**: Displaying user points in a user-friendly manner.
- **Solution**: Developed a React frontend that fetches and displays user points data in a styled table.

## Future Enhancements

- Implement more sophisticated error handling and logging.
- Add authentication and authorization for accessing the points data.
- Enhance the UI with advanced frameworks like Material-UI or Bootstrap.

## Conclusion

This project successfully demonstrates how to integrate blockchain transaction data with a modern web application to calculate and display DeFi user points. It showcases the power of combining technologies such as Express.js, MongoDB, React, and The Graph API to build a full-stack application.



![image](https://github.com/Deepak2030/Zeru_Finance/assets/83352186/48b13306-cacf-4d56-8241-a89ad15abde9)
