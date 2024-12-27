import React from "react";
import hankey from "../../assets/hankey.jpg";
import { fetchAllFilteredProducts } from "@/store/shop/products-slice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useToast } from "@/hooks/use-toast";
const Shop = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { user } = useSelector((state) => state.auth);
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-hightolow",
      })
    );
  }, [dispatch]);

  console.log(productList, "productList");

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
          dispatch(fetchCartItems(user?.id));
          toast({
            title: "Product is added to cart",
          });
        }
      });
    }
  }

  return (
    <div className="flex flex-col">
      <div className="relative h-[200px] w-full overflow-hidden">
        <img
          src={hankey}
          className="h-full w-full object-cover object-center"
        />
      </div>
      <section className="py-5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">All Products</h2>
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

export default Shop;
