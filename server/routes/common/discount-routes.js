const express = require("express");
const {
  addDiscount,
  updateDiscount,
  getAllDiscounts,
  deleteMessage,
} = require("../../controllers/common/discount-controller");

const router = express.Router();

// Create a new discount
router.post("/add", addDiscount);

// Fetch the latest discount
router.get("/get", getAllDiscounts);

// Update an existing discount
router.put("/update/:id", updateDiscount);

router.delete("/delete/:id", deleteMessage);

module.exports = router;
