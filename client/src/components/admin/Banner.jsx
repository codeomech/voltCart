import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDiscount,
  addDiscount,
  updateDiscount,
  deleteDiscount,
} from "@/store/common-slice";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { useToast } from "@/hooks/use-toast";

const DiscountAdminInput = () => {
  const [discountMessage, setDiscountMessage] = useState("");
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { discount, isLoading } = useSelector((state) => state.commonDiscount);

  useEffect(() => {
    dispatch(fetchDiscount());
  }, [dispatch]);

  console.log(discount);

  const [editingId, setEditingId] = useState(null);
  const [editMessage, setEditMessage] = useState("");

  const handleEditClick = (id, currentMessage) => {
    setEditingId(id);
    setEditMessage(currentMessage);
  };

  const handleUpdate = () => {
    if (editMessage === "") {
      toast({
        title: "Message cannot be empty.",
      });
      return;
    }

    dispatch(updateDiscount({ id: editingId, text: editMessage }))
      .unwrap()
      .then(() => {
        toast({
          title: "Banner updated successfully!",
        });
        setEditingId(null); // Exit edit mode
        setEditMessage("");
      })
      .catch((err) =>
        toast({
          title: err.message || "Failed to update banner.",
        })
      );
  };

  const handleDelete = (id) => {
    dispatch(deleteDiscount(id))
      .unwrap()
      .then(() => {
        toast({
          title: "Banner deleted successfully!",
        });
      })
      .catch((err) =>
        toast({
          title: err.message || "Failed to delete banner.",
        })
      );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate input
    if (discountMessage.trim() === "") {
      toast({
        title: "Discount message cannot be empty.",
      });
      return;
    }
    if (discountMessage.length > 200) {
      toast({
        title: "Discount message cannot exceed 200 characters.",
      });
      return;
    }

    // Dispatch the addDiscount action
    dispatch(addDiscount(discountMessage))
      .unwrap()
      .then(() => {
        setError(null); // Clear any previous errors
        setDiscountMessage(""); // Clear input field after successful submission
        toast({
          title: "Discount message added successfully!",
        });
      })
      .catch((err) => {
        setError(err.message || "Failed to add discount.");
      });
  };
  if (!Array.isArray(discount.data)) {
    return <p>No discount data available.</p>;
  }

  return (
    <>
      <div>
        <h2 className="mb-6 font-gaegu text-2xl">Add Banner Message</h2>
        <form onSubmit={handleSubmit}>
          <Textarea
            value={discountMessage}
            onChange={(e) => setDiscountMessage(e.target.value)}
            placeholder="Enter discount message (max 200 characters)"
            rows="4"
            cols="50"
          />
          <br />
          <Button type="submit">Submit</Button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>

      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Manage Banners</h2>
        {isLoading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {discount.data.map((item) => (
            <Card key={item._id} className="p-4 space-y-4">
              {editingId === item._id ? (
                <div>
                  <Input
                    value={editMessage}
                    onChange={(e) => setEditMessage(e.target.value)}
                    className="mb-2"
                    placeholder="Edit banner message"
                  />
                  <div className="flex justify-end space-x-2">
                    <Button onClick={handleUpdate} variant="success">
                      Save
                    </Button>
                    <Button
                      onClick={() => setEditingId(null)}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-lg">{item.text}</p>
                  <div className="flex justify-end space-x-2">
                    <Button
                      onClick={() => handleEditClick(item._id, item.text)}
                      variant="outline"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(item._id)}
                      variant="outline"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default DiscountAdminInput;
