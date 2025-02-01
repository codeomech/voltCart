import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";
import { useToast } from "@/hooks/use-toast";

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const totalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  const handleCheckout = () => {
    if (!cartItems || cartItems.length === 0) {
      toast({
        title: "Your cart is empty. Please add items to proceed.",
        variant: "destructive",
      });
      setOpenCartSheet(false);
      return;
    }
    navigate("/checkout");
    setOpenCartSheet(false);
  };
  return (
    <SheetContent className="sm:max-w-md">
      <SheetHeader>
        <SheetTitle>Your Cart</SheetTitle>
      </SheetHeader>
      <div className="mt-8 space-y-4">
        {cartItems?.length > 0
          ? cartItems.map((item) => (
              <UserCartItemsContent
                key={item.productId || item._productId} // Handle both `id` and `_id`
                cartItem={item}
              />
            ))
          : null}
      </div>
      <div className="mt-8 space-y-4">
        <div className="flex justify-between">
          <span className="font-bold">Total</span>
          <span className="font-bold">₹{totalCartAmount}</span>
        </div>
      </div>
      <Button onClick={handleCheckout} className="w-full mt-6">
        Checkout
      </Button>
    </SheetContent>
  );
}

export default UserCartWrapper;
