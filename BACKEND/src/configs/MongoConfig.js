import mongoose from "mongoose";
import chalk from "chalk";

export const ConnectMongo = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log(chalk.green(`Connected to Mongo Database.`));
    })
    .catch((err) => {
      console.log(chalk.bgRed.white(`Error connecting to Database`));
      console.log(err);
    });
};
