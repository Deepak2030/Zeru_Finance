import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css"; // Importing CSS for styling

function App() {
  const [userPoints, setUserPoints] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/user-points")
      .then((response) => {
        setUserPoints(response.data);
      })
      .catch((error) =>
        console.error("There was an error fetching the user points:", error)
      );
  }, []);

  return (
    <div className="App">
      <h1>User Points</h1>
      <table>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {userPoints.map((user, index) => (
            <tr key={index}>
              <td>{user.userId}</td>
              <td>{user.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
