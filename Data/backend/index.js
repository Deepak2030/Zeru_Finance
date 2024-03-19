import axios from "axios";
import { MongoClient } from "mongodb";
import cron from "node-cron";

function getPreviousDayTimestamps() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const timestamp_gte = Math.floor(today.getTime() / 1000);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const timestamp_lte = timestamp_gte + 86400;
  return { timestamp_gte, timestamp_lte };
}

async function getDataAndInsertIntoDB() {
    const uri = "mongodb://localhost:27017";
    const dbName = "Zeru_Finance";
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  
    try {
      await client.connect();
      console.log("Connected to database");
      const db = client.db(dbName);
      
      await db.collection("user_points").createIndex({ userId: 1 }, { unique: true });
  
      const { timestamp_gte, timestamp_lte } = getPreviousDayTimestamps();
  
      const response = await axios.post("https://api.thegraph.com/subgraphs/name/aave/aave-v2-matic", {
        query: `
          {
            borrows(where: {timestamp_gte: ${timestamp_gte}, timestamp_lte: ${timestamp_lte}}) {
              assetPriceUSD
              user {
                id
              }
              action
            }
            repays(where: {timestamp_gte: ${timestamp_gte}, timestamp_lte: ${timestamp_lte}}) {
              assetPriceUSD
              user {
                id
              }
              action
            }
            deposits(where: {timestamp_gte: ${timestamp_gte}, timestamp_lte: ${timestamp_lte}}) {
              assetPriceUSD
              user {
                id
              }
              action
            }
            liquidationCalls(where: {timestamp_gte: ${timestamp_gte}, timestamp_lte: ${timestamp_lte}}) {
              liquidator
              borrowAssetPriceUSD
              collateralAssetPriceUSD
              user {
                id
              }
              action
            }
            redeemUnderlyings(where: {timestamp_gte: ${timestamp_gte}, timestamp_lte: ${timestamp_lte}}) {
              assetPriceUSD
              user {
                id
              }
              action
            }
          }
        `,
      });
  
      if (response.data && response.data.data) {
        const actions = ['borrows', 'repays', 'deposits', 'liquidationCalls', 'redeemUnderlyings'];
        const userPoints = {};
  
        actions.forEach((action) => {
          const items = response.data.data[action];
          console.log(`Processing ${items.length} items for action: ${action}`);
  
          items.forEach((item) => {
            const userId = item.user.id;
            let points = 0;
  
            switch (action) {
              case "borrows":
                points = (parseFloat(item.assetPriceUSD) / 100) * 4;
                break;
              case "repays":
                points = (parseFloat(item.assetPriceUSD) / 100) * 8;
                break;
              case "deposits":
                points = parseFloat(item.assetPriceUSD) / 100;
                break;
              case "liquidationCalls":
                const liquidatedUserId = item.user.id;
                const liquidationPoints = (parseFloat(item.borrowAssetPriceUSD) / 100) * 10;
                userPoints[liquidatedUserId] = (userPoints[liquidatedUserId] || 0) - liquidationPoints;
                points = liquidationPoints;
                break;
              case "redeemUnderlyings":
                points = -(parseFloat(item.assetPriceUSD) / 100);
                break;
            }
  
            userPoints[userId] = (userPoints[userId] || 0) + points;
          });
        });
  
        for (const userId in userPoints) {
          await db.collection("user_points").updateOne(
            { userId },
            { $inc: { points: userPoints[userId] } },
            { upsert: true }
          );
        }
  
        console.log("User points updated in MongoDB successfully!");
      }
    } catch (error) {
      console.error("Error updating user points in MongoDB:", error);
    } finally {
      await client.close();
    }
  }

getDataAndInsertIntoDB();

cron.schedule("0 0 * * *", () => {
  console.log("Running data fetch and insert at 12 AM midnight.");
  getDataAndInsertIntoDB();
});
