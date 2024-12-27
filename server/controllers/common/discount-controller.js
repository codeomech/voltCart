const Discount = require("../../models/Discount");

// Add a new discount
const addDiscount = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== "string" || text.length > 200) {
      return res.status(400).json({
        success: false,
        message: "Text must be a string and must not exceed 200 characters.",
      });
    }

    const discount = await Discount.findOne().sort({ createdAt: -1 });

    if (!discount) {
      // If no discount document exists, create a new one
      const newDiscount = new Discount({ text: [text] });
      await newDiscount.save();

      return res.status(201).json({
        success: true,
        message: "Discount message created successfully.",
        data: newDiscount,
      });
    }

    // Add the message to the existing array
    discount.text.push(text);
    await discount.save();

    res.status(200).json({
      success: true,
      message: "Discount message added successfully.",
      data: discount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while adding the discount message.",
    });
  }
};

const getAllDiscounts = async (req, res) => {
  try {
    const discounts = await Discount.find().sort({ createdAt: -1 });

    if (!discounts || discounts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No discounts available.",
      });
    }

    res.status(200).json({
      success: true,
      data: discounts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching discounts.",
    });
  }
};

const updateDiscount = async (req, res) => {
  try {
    const { id } = req.params;
    const { index, text } = req.body;

    if (typeof text !== "string" || text.length > 200) {
      return res.status(400).json({
        success: false,
        message: "text must be a string not exceeding 200 characters.",
      });
    }

    const discount = await Discount.findById(id);

    if (!discount) {
      return res.status(404).json({
        success: false,
        message: "Discount not found.",
      });
    }

    if (index < 0 || index >= discount.text.length) {
      return res.status(400).json({
        success: false,
        message: "Invalid index provided.",
      });
    }

    // Update the message at the specified index
    discount.text[index] = text;
    await discount.save();

    res.status(200).json({
      success: true,
      message: "Discount message updated successfully.",
      data: discount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the discount message.",
    });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params; // Discount document ID
    const { messageIndex } = req.body;

    const discount = await Discount.findById(id);

    if (!discount) {
      return res.status(404).json({
        success: false,
        message: "Discount not found.",
      });
    }

    if (messageIndex < 0 || messageIndex >= discount.text.length) {
      return res.status(400).json({
        success: false,
        message: "Invalid message index.",
      });
    }

    discount.text.splice(messageIndex, 1); // Remove the message
    await discount.save();

    res.status(200).json({
      success: true,
      message: "Message deleted successfully.",
      data: discount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the message.",
    });
  }
};
module.exports = {
  addDiscount,
  getAllDiscounts,
  updateDiscount,
  deleteMessage,
};
