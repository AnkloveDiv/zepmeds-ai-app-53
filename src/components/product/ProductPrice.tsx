
interface ProductPriceProps {
  price: number;
  discountPrice?: number | null;
}

const ProductPrice = ({ price, discountPrice }: ProductPriceProps) => {
  return (
    <div>
      {discountPrice ? (
        <div className="flex flex-col">
          <span className="text-green-400 font-semibold">₹{discountPrice}</span>
          <span className="text-gray-400 text-xs line-through">₹{price}</span>
        </div>
      ) : (
        <span className="text-white font-semibold">₹{price}</span>
      )}
    </div>
  );
};

export default ProductPrice;
