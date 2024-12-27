import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";
import { useNavigate } from "react-router-dom";

function ShoppingProductTile({ product, handleAddtoCart }) {
  const navigate = useNavigate();

  const handleGetProductDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <Card className="w-full max-w-sm mx-auto md:max-w-xs lg:max-w-sm">
      <div>
        <div
          className="relative cursor-pointer"
          onClick={() => handleGetProductDetails(product?._id)}
        >
          {/* Responsive Image Container */}
          <div className="w-full aspect-w-4 aspect-h-3">
            <img
              src={product?.image}
              alt={product?.title}
              className="w-full h-full object-contain rounded-t-md"
            />
          </div>
          {/* Badge */}
          {product?.totalStock === 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              Out Of Stock
            </Badge>
          ) : product?.totalStock < 10 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              {`Only ${product?.totalStock} items left`}
            </Badge>
          ) : product?.salePrice > 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              Sale
            </Badge>
          ) : null}
        </div>
        <CardContent className="p-2 sm:p-4">
          <h2 className="text-sm lg:text-xl font-semibold lg:mb-2 truncate">
            {product?.title}
          </h2>
          <div className="flex items-center gap-2 mt-1 sm:mt-2">
            <span className="text-xs sm:text-sm text-gray-500">
              {categoryOptionsMap[product?.category]}
            </span>
            <span className="text-xs sm:text-sm text-green-600">
              {brandOptionsMap[product?.brand]}
            </span>
          </div>
          <div className="flex items-center justify-between mt-1 sm:mt-2">
            <div>
              {product?.salePrice > 0 ? (
                <div>
                  <span className=" font-semibold text-sm sm:text-lg">
                    ₹{product?.salePrice}
                  </span>
                  <span className="text-gray-400 text-xs sm:text-sm line-through ml-1">
                    ₹{product?.price}
                  </span>
                </div>
              ) : (
                <span className="text-gray-800 font-semibold text-sm sm:text-lg">
                  ₹{product?.price}
                </span>
              )}
            </div>
            {/* Add to Cart Button */}
            {product?.totalStock === 0 ? (
              <Button
                disabled
                className="bg-gray-400 text-white text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2"
              >
                Out of Stock
              </Button>
            ) : (
              <Button
                onClick={() => handleAddtoCart(product?._id)}
                className="text-black border-black  bg-gray-100 text-xs sm:text-sm px-4 py-2  border-2 font-semibold hover:bg-green-50  hover:border-green-600 hover:text-green-500"
              >
                ADD
              </Button>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

export default ShoppingProductTile;
