import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { getReviews, addReview } from "@/store/shop/review-slice";
import { fetchProductDetails } from "@/store/shop/products-slice";
import { useToast } from "@/hooks/use-toast";
import StarRatingComponent from "../../components/common/star-rating";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";

function ProductDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { productDetails } = useSelector((state) => state.shopProducts);
  const { reviews } = useSelector((state) => state.shopReview);
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { toast } = useToast();
  const [reviewMsg, setReviewMsg] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [backgroundPosition, setBackgroundPosition] = useState("0% 0%");
  const [rating, setRating] = useState(0);
  const descriptionLines = productDetails?.description
    .split("\n")
    .filter((line) => line.trim() !== "");

  useEffect(() => {
    dispatch(fetchProductDetails(id)); // Fetch product details by ID
    dispatch(getReviews(id)); // Fetch product reviews
  }, [id]);

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    if (!user) {
      toast({
        title: "Please Login for adding the product into the Cart",
      });
    } else {
      let getCartItems = cartItems.items || [];

      if (getCartItems.length) {
        const indexOfCurrentItem = getCartItems.findIndex(
          (item) => item.productId === getCurrentProductId
        );
        if (indexOfCurrentItem > -1) {
          const getQuantity = getCartItems[indexOfCurrentItem].quantity;
          if (getQuantity + 1 > getTotalStock) {
            toast({
              title: `Only ${getQuantity} quantity can be added for this item`,
              variant: "destructive",
            });
            return;
          }
        }
      }
      dispatch(
        addToCart({
          userId: user?.id || user?._id,
          productId: getCurrentProductId,
          quantity: 1,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchCartItems(user?.id || user?._id));
          toast({
            title: "Product is added to cart",
          });
        }
      });
    }
  }

  function handleAddReview() {
    dispatch(
      addReview({
        productId: id,
        userId: user?.id || user?._id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    ).then((data) => {
      if (data.payload.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(id));
        toast({
          title: "Review added successfully!",
        });
      }
    });
  }

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setBackgroundPosition(`${x}% ${y}%`);
  };

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
        reviews.length
      : 0;

  return (
    <div className="container mx-auto p-4">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Image Section */}
        <div
          className="relative flex justify-center items-center h-[300px] w-full lg:h-[500px] lg:w-[500px] mx-auto p-8 border border-solid overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onMouseMove={handleMouseMove}
          style={{
            backgroundImage: isHovered
              ? `url(${productDetails?.image})`
              : "none",
            backgroundSize: isHovered ? "200%" : "contain",
            backgroundPosition: backgroundPosition,
            backgroundRepeat: "no-repeat",
            transition: "background-size 0.3s ease-in-out",
            cursor: isHovered ? "zoom-in" : "default",
          }}
        >
          {/* Initial Image (Always Visible) */}
          {!isHovered && (
            <img
              src={productDetails?.image}
              alt={productDetails?.title}
              className="h-full object-contain"
            />
          )}
        </div>
        {/* Product Details Section */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{productDetails?.title}</h1>
          {/* Render description as a list */}
          <h3 className="text-xl font-bold mb-2 ml-2">Product Details</h3>
          <ul className="list-disc list-inside text-gray-600 mb-6 ml-2">
            {descriptionLines?.map((line, index) => (
              <li key={index}>{line}</li>
            ))}
          </ul>
          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-bold text-primary">
              ₹{productDetails?.salePrice}
            </span>
            {productDetails?.salePrice > 0 && (
              <span className="text-2xl text-gray-500 line-through">
                ₹{productDetails?.price}
              </span>
            )}
          </div>
          <Button
            className="bg-primary text-white px-4 py-2 rounded-lg"
            onClick={() =>
              handleAddToCart(productDetails?._id, productDetails?.totalStock)
            }
          >
            Add to Cart
          </Button>

          {/* Reviews Section */}
          <div className="mt-10">
            <h2 className="text-xl font-bold mb-4">Reviews</h2>
            {reviews?.map((review, index) => (
              <div key={index} className="flex gap-4 mt-2">
                <Avatar>
                  <AvatarFallback>
                    {review?.userName[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold">{review?.userName}</h3>
                  <StarRatingComponent rating={review?.reviewValue} />
                  <p>{review?.reviewMessage}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Add Review Section */}
          <div className="mt-10">
            <Label>Write a Review</Label>
            <StarRatingComponent rating={rating} setRating={setRating} />
            <Input
              value={reviewMsg}
              onChange={(e) => setReviewMsg(e.target.value)}
              placeholder="Your review"
              className="mt-2 border rounded-lg px-3 py-2 w-full"
            />
            <Button
              onClick={handleAddReview}
              disabled={!reviewMsg}
              className="mt-2 bg-primary text-white px-4 py-2 rounded-lg"
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
