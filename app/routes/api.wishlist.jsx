import db from "../db.server"
import { cors } from "remix-utils/cors"

export async function loader() {
  const data = {
    ok: true,
    message: "wish api"
  };
  return Response.json(data);
}

export async function action({ request }) {
  const method = request.method;
  let data = await request.formData();
  data = Object.fromEntries(data);
  const productId = data.productId;
  const customerId = data.customerId;
  const shop = data.shop;


  if (!productId || !customerId || !shop) {
    return Response.json({
      ok: false,
      message: "Missing required fields: shop, productId, customerId",
      method: method
    });
  }

  switch (method) {
    case "POST":

      const wishlist = await db.wishlist.create({
        data: {
          customerId,
          productId,
          shop
        }
      });

      const response = Response.json({
        message: "Product added to wishlist",
        method: "POST",
        wishlist: wishlist
      });

      return cors(request, response);

    case "PATCH":
      return Response.json({
        message: "Success",
        method: "patch"
      });

    // case "DELETE":

  }

}