import db from "../db.server"
import { cors } from "remix-utils/cors"
import { action } from "./webhooks.app.scopes_update";

export async function loader({ request }) {
  const url = new URL(request.url);
  const customerId = url.searchParams.get("customerId");
  const shopUrl = url.searchParams.get("shop");
  const productId = url.searchParams.get("productId");

  if (!customerId || !shopUrl || !productId) {
    return Response.json({
      message: "Missing required parameters",
      method: "GET",
    })
  }

  const wishlist = await db.wishlist.findMany({
    where: {
      customerId: customerId,
      shop: shopUrl,
      productId: productId,
    },
  });

  const response = Response.json({
    ok: true,
    message: "Success",
    data: wishlist,
  });

  return cors(request, response);

}

export async function action_1({ request }) {
  const formData = Object.fromEntries(await request.formData());

  const customerId = formData.customerId;
  const shopUrl = formData.shop;
  const productId = formData.productId;

  const _action = formData._action;

  if (_action === "CREATE") {
    await db.wishlist.create({
      data: {
        customerId: customerId,
        shop: shopUrl,
        productId: productId,
      },
    });
  } else if (_action === "DELETE") {
    await db.wishlist.deleteMany({
      where: {
        customerId: customerId,
        shop: shopUrl,
        productId: productId,
      },
    });
  }

  return Response.json({
    ok: true,
    message: "Success",
  });

}
