const mongoose = require("mongoose");

function connect(url) {
  return mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: [30, "Title must be less than 30 characters"],
    minlength: [5, "Title must be more than 5 characters"],
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const task = mongoose.model("Task", todoSchema);

module.exports = { connect, task };
