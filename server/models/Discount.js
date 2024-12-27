const mongoose = require("mongoose");

const discountSchema = new mongoose.Schema({
  text: {
    type: [String], // Array of strings
    required: true,
    validate: {
      validator: function (v) {
        // Ensure no message exceeds the 200-character limit
        return v.every((msg) => msg.length <= 200);
      },
      message: "Each message must not exceed 200 characters.",
    },
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Discount", discountSchema);

module.exports = mongoose.model("Discount", discountSchema);
