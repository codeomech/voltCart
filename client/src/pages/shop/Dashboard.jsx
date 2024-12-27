import React from "react";
import { Button } from "@/components/ui/button";

import bannerOne from "../../assets/banner-1.webp";
import bannerTwo from "../../assets/banner-2.webp";
import bannerFour from "../../assets/handkerchief.png";
import {
  Airplay,
  BabyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudLightning,
  Heater,
  Images,
  Shirt,
  ShirtIcon,
  ShoppingBasket,
  UmbrellaIcon,
  WashingMachine,
  WatchIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { fetchAllFilteredProducts } from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [bannerOne, bannerTwo, bannerFour];
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  //  const navigate = useNavigate();
  const { toast } = useToast();

  function handleAddtoCart(getCurrentProductId) {
    if (!user) {
      toast({
        title: "Please Login for adding the product into the Cart",
      });
    } else {
      dispatch(
        addToCart({
          userId: user?.id,
          productId: getCurrentProductId,
          quantity: 1,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchCartItems(user?.id)).then((data) => console.log(data));
          toast({
            title: "Product is added to cart",
          });
        }
      });
    }
  }

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-hightolow",
      })
    );
  }, [dispatch]);

  console.log(productList, "productList");

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative w-full h-[200px] lg:h-[525px] sm:h-[300px] md:h-[400px] overflow-hidden">
        {slides.map((slide, index) => (
          <img
            src={slide}
            key={index}
            className={`${
              index === currentSlide ? "opacity-100" : "opacity-0"
            } absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
          />
        ))}
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) => (prevSlide - 1 + slides.length) % slides.length
            )
          }
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80 sm:bg-white/70 w-8 h-8 lg:w-12 lg:h-12"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length)
          }
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80 sm:bg-white/70 w-8 h-8 lg:w-12 lg:h-12"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Feature Products
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList && productList.length > 0
              ? productList.map((productItem) => (
                  <ShoppingProductTile
                    product={productItem}
                    handleAddtoCart={handleAddtoCart}
                  />
                ))
              : null}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
