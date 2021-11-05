const cors = require("cors");
const helmet = require("helmet");
const express = require("express");
require("dotenv").config();
const { connect, task } = require("./db");

const server = express();
const PORT = process.env.PORT || 3000;

server.use(cors());
server.use(helmet());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.get("/", (req, res) => {
  res.send("hellow");
});

/* Fetch all tasks. */
server.get("/tasks", async (req, res) => {
  try {
    const Tasks = await task.find({});
    if (Tasks.length < 1) {
      return res
        .status(200)
        .json({ message: "No task avaliable in database. Create one." });
    }
    res.status(200).json(Tasks);
  } catch (error) {
    res.status(500).json({ message: `Fetch not successfull. Error: ${error}` });
  }
});

/* Add task to database. */
server.post("/tasks", async (req, res) => {
  const { title } = req.body;
  try {
    const Task = await task.create({ title });
    res.status(201).json({ message: "Task creation was successful" });
  } catch (error) {
    res.status(500).json({
      message: `An error occured while while creating task. Error: ${error.name}`,
    });
  }
});

/* Deletes all task from database. */
server.delete("/tasks", async (req, res) => {
  try {
    await task.deleteMany({});
    res.json({ message: "All task data cleared." });
  } catch (error) {
    res.status(500).send("An error occured.");
  }
});

/* Update task in database */
server.patch("/tasks/:id", async (req, res) => {
  const { id: taskId } = req.params;
  const { title, completed } = req.body;

  try {
    const Task = await task.findOneAndUpdate(
      { _id: taskId },
      { title, completed }
    );
    if (!Task) {
      return res.status(404).json({ message: "No task matches the given ID." });
    }
    res.status(202).json({ message: "Task successfully updated." });
  } catch (error) {
    res.status(500).json({ message: "An internal error had occured." });
  }
});

/* Delete task from database */
server.delete("/tasks/:id", async (req, res) => {
  const { id: taskId } = req.params;

  try {
    const Task = await task.findOneAndDelete({ _id: taskId });
    if (!Task) {
      return res.status(404).json({ message: "No task matches the given ID." });
    }
    res.status(200).json({ message: "Task successfully deleted." });
  } catch (error) {
    res.status(500).json({ message: "An internal error had occured." });
  }
});

/* server function. */
const startServer = async () => {
  await connect(process.env.DB_URL);
  server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
};

startServer();
