import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";

const app = express();
const port = 3000; 
const uri = "mongodb://localhost:27017";
const dbName = "Zeru_Finance";

app.use(cors());

app.get('/user-points', async (req, res) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection("user_points");
        const userPoints = await collection.find({}).toArray();
        
        res.json(userPoints);
    } catch (error) {
        console.error("Error accessing MongoDB:", error);
        res.status(500).json({ message: "Internal server error" });
    } finally {
        await client.close();
    }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
