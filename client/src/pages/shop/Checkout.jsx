import Address from "@/components/shopping-view/address";
import hankey from "../../assets/hankey.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { deleteCartItem } from "@/store/shop/cart-slice";
import { createNewOrder, capturePayment } from "@/store/shop/order-slice";
import { Navigate, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymemntStart] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  function handleInitiateRazorpayPayment() {
    if (cartItems?.items?.length === 0) {
      toast({
        title: "Your cart is empty. Please add items to proceed.",
        variant: "destructive",
      });
      return;
    }
    if (currentSelectedAddress === null) {
      toast({
        title: "Please select one address to proceed.",
        variant: "destructive",
      });
      return;
    }

    const orderData = {
      userId: user?.id || user?._id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price:
          singleCartItem?.salePrice > 0
            ? singleCartItem?.salePrice
            : singleCartItem?.price,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "pending",
      paymentMethod: "razorpay",
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
    };

    // Dispatch createNewOrder
    dispatch(createNewOrder(orderData)).then((data) => {
      if (data?.payload?.success) {
        const { razorpayOrderId, razorpayKey } = data.payload;

        // Razorpay options
        const options = {
          key: razorpayKey,
          amount: totalCartAmount * 100, // Amount in paise
          currency: "INR",
          name: "Volt Cart",
          description: "Order Payment",
          order_id: razorpayOrderId,
          handler: function (response) {
            // Dispatch capturePayment on success
            dispatch(
              capturePayment({
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
              })
            ).then((paymentResponse) => {
              if (paymentResponse?.payload?.success) {
                toast({
                  title: "Payment Successful!",
                  variant: "positive",
                });
                cartItems.items.forEach((item) => {
                  dispatch(
                    deleteCartItem({
                      userId: user?.id || user?._id,
                      productId: item.productId, // Pass productId from the item
                    })
                  );
                });
                navigate(`/payment-success`);
              } else {
                toast({
                  title: "Payment Failed. Please try again.",
                  variant: "destructive",
                });
              }
            });
          },
          prefill: {
            name: user?.name,
            email: user?.email,
            contact: user?.phone || "9999999999",
          },
          theme: {
            color: "#F37254",
          },
        };

        // Open Razorpay checkout
        const rzp = new Razorpay(options);
        rzp.open();
      } else {
        toast({
          title: "Failed to initiate Razorpay payment.",
          variant: "destructive",
        });
      }
    });
  }

  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img
          src={hankey}
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        <Address
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />
        <div className="flex flex-col gap-4">
          {cartItems && cartItems.items && cartItems.items.length > 0
            ? cartItems.items.map((item) => (
                <UserCartItemsContent
                  key={item?.id || item?._id}
                  cartItem={item}
                />
              ))
            : null}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">₹{totalCartAmount}</span>
            </div>
          </div>
          <div className="mt-4 w-full">
            <Button onClick={handleInitiateRazorpayPayment} className="w-full">
              {isPaymentStart ? "Processing Paypal Payment..." : "Checkout"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
