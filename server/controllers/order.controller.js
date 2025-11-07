import Stripe from "../config/stripe.js";
import CartProductModel from "../models/cartproduct.model.js";
import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";
import mongoose from "mongoose";

export async function CashOnDeliveryOrderController(request, response) {
  try {
    const userId = request.userId; // auth middleware
    const { list_items, totalAmt, addressId, subTotalAmt } = request.body;

    const payload = list_items.map((el) => {
      return {
        userId: userId,
        orderId: `ORD-${new mongoose.Types.ObjectId()}`,
        productId: el.productId._id,
        product_details: {
          name: el.productId.name,
          image: el.productId.image,
        },
        paymentId: "",
        payment_status: "CASH ON DELIVERY",
        delivery_address: addressId,
        subTotalAmt: subTotalAmt,
        totalAmt: totalAmt,
      };
    });

    const generatedOrder = await OrderModel.insertMany(payload);

    ///remove from the cart
    const removeCartItems = await CartProductModel.deleteMany({
      userId: userId,
    });
    const updateInUser = await UserModel.updateOne(
      { _id: userId },
      { shopping_cart: [] }
    );

    return response.json({
      message: "Order successfully",
      error: false,
      success: true,
      data: generatedOrder,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// New controller to handle order completion from client side after Stripe payment
export async function verifyAndCompleteStripeOrder(request, response) {
  try {
    const userId = request.userId;
    const { sessionId } = request.body;

    console.log("=== Verifying Stripe Payment ===");
    console.log("Session ID:", sessionId);
    console.log("User ID:", userId);

    if (!sessionId) {
      return response.status(400).json({
        message: "Session ID is required",
        error: true,
        success: false,
      });
    }

    // Retrieve the session from Stripe
    const session = await Stripe.checkout.sessions.retrieve(sessionId);

    console.log("Session retrieved:", {
      id: session.id,
      payment_status: session.payment_status,
      status: session.status,
    });

    // Verify the payment was successful
    if (session.payment_status !== "paid" || session.status !== "complete") {
      return response.status(400).json({
        message: "Payment not completed",
        error: true,
        success: false,
      });
    }

    // Verify the user matches
    if (session.metadata.userId !== userId) {
      return response.status(403).json({
        message: "Unauthorized access",
        error: true,
        success: false,
      });
    }

    // Check if order already exists for this session
    const existingOrder = await OrderModel.findOne({
      paymentId: session.payment_intent,
    });

    if (existingOrder) {
      console.log("Order already exists for this session");

      // Clear cart even if order exists (in case it wasn't cleared before)
      await CartProductModel.deleteMany({ userId: userId });
      await UserModel.updateOne({ _id: userId }, { shopping_cart: [] });

      return response.json({
        message: "Order already processed",
        error: false,
        success: true,
        data: existingOrder,
      });
    }

    // Get line items from the session
    const lineItems = await Stripe.checkout.sessions.listLineItems(session.id);
    console.log("Line items retrieved:", lineItems.data.length);

    // Create order products
    const orderProducts = await getOrderProductItems({
      lineItems: lineItems,
      userId: userId,
      addressId: session.metadata.addressId,
      paymentId: session.payment_intent,
      payment_status: "paid",
    });

    console.log("Order products prepared:", orderProducts.length);

    // Insert orders
    const orders = await OrderModel.insertMany(orderProducts);
    console.log("✅ Orders created:", orders.length);

    // Clear the cart
    const removeCartProductDB = await CartProductModel.deleteMany({
      userId: userId,
    });

    await UserModel.updateOne({ _id: userId }, { shopping_cart: [] });

    console.log("✅ Cart cleared:", removeCartProductDB.deletedCount, "items");

    return response.json({
      message: "Order completed successfully",
      error: false,
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("=== Verify Payment Error ===");
    console.error("Error:", error);
    return response.status(500).json({
      message: error.message || "Failed to complete order",
      error: true,
      success: false,
    });
  }
}

export const pricewithDiscount = (price, dis = 1) => {
  const discountAmout = Math.ceil((Number(price) * Number(dis)) / 100);
  const actualPrice = Number(price) - Number(discountAmout);
  return actualPrice;
};

export async function paymentController(request, response) {
  try {
    const userId = request.userId; // auth middleware
    const { list_items, totalAmt, addressId, subTotalAmt } = request.body;

    console.log("=== Payment Controller Debug ===");
    console.log("User ID:", userId);
    console.log("List items count:", list_items?.length);
    console.log("Address ID:", addressId);
    console.log("Total Amount:", totalAmt);

    // Validate required fields
    if (!list_items || !Array.isArray(list_items) || list_items.length === 0) {
      return response.status(400).json({
        message: "Cart is empty or invalid",
        error: true,
        success: false,
      });
    }

    if (!addressId) {
      return response.status(400).json({
        message: "Delivery address is required",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return response.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    console.log("User found:", user.email);

    // Validate and prepare line items
    const line_items = list_items.map((item, index) => {
      console.log(`Processing item ${index}:`, {
        name: item.productId?.name,
        price: item.productId?.price,
        discount: item.productId?.discount,
        quantity: item.quantity,
      });

      if (!item.productId || !item.productId._id) {
        throw new Error(`Invalid product at index ${index}`);
      }

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.productId.name,
            images: item.productId.image,
            metadata: {
              productId: item.productId._id,
            },
          },
          unit_amount:
            pricewithDiscount(item.productId.price, item.productId.discount) *
            100,
        },
        adjustable_quantity: {
          enabled: true,
          minimum: 1,
        },
        quantity: item.quantity,
      };
    });

    console.log("Line items prepared:", line_items.length);

    const params = {
      submit_type: "pay",
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: user.email,
      metadata: {
        userId: userId,
        addressId: addressId,
      },
      line_items: line_items,
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    };

    console.log("Creating Stripe session with params...");
    const session = await Stripe.checkout.sessions.create(params);
    console.log("Stripe session created:", session.id);

    return response.status(200).json(session);
  } catch (error) {
    console.error("Payment Controller Error:", error);
    return response.status(500).json({
      message: error.message || "Payment processing failed",
      error: true,
      success: false,
    });
  }
}

const getOrderProductItems = async ({
  lineItems,
  userId,
  addressId,
  paymentId,
  payment_status,
}) => {
  const productList = [];

  if (lineItems?.data?.length) {
    for (const item of lineItems.data) {
      const product = await Stripe.products.retrieve(item.price.product);

      const paylod = {
        userId: userId,
        orderId: `ORD-${new mongoose.Types.ObjectId()}`,
        productId: product.metadata.productId,
        product_details: {
          name: product.name,
          image: product.images,
        },
        paymentId: paymentId,
        payment_status: payment_status,
        delivery_address: addressId,
        subTotalAmt: Number(item.amount_total / 100),
        totalAmt: Number(item.amount_total / 100),
      };

      productList.push(paylod);
    }
  }

  return productList;
};

//http://localhost:8080/api/order/webhook
export async function webhookStripe(request, response) {
  try {
    console.log("=== Webhook Received ===");

    const sig = request.headers["stripe-signature"];
    const endPointSecret = process.env.STRIPE_ENDPOINT_WEBHOOK_SECRET_KEY;

    let event;

    // Verify webhook signature if secret is configured
    if (endPointSecret && sig) {
      try {
        event = Stripe.webhooks.constructEvent(
          request.body,
          sig,
          endPointSecret
        );
        console.log("✅ Webhook signature verified");
      } catch (err) {
        console.error("❌ Webhook signature verification failed:", err.message);
        return response.status(400).send(`Webhook Error: ${err.message}`);
      }
    } else {
      // For testing without signature verification
      event = request.body;
      console.log(
        "⚠️ Webhook signature verification skipped (no secret configured)"
      );
    }

    console.log("Event type:", event.type);

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        console.log("=== Processing Checkout Session Completed ===");
        const session = event.data.object;

        console.log("Session ID:", session.id);
        console.log("User ID:", session.metadata.userId);
        console.log("Address ID:", session.metadata.addressId);
        console.log("Payment Status:", session.payment_status);

        const lineItems = await Stripe.checkout.sessions.listLineItems(
          session.id
        );

        console.log("Line items retrieved:", lineItems.data.length);

        const userId = session.metadata.userId;
        const orderProduct = await getOrderProductItems({
          lineItems: lineItems,
          userId: userId,
          addressId: session.metadata.addressId,
          paymentId: session.payment_intent,
          payment_status: session.payment_status,
        });

        console.log("Order products prepared:", orderProduct.length);

        const order = await OrderModel.insertMany(orderProduct);
        console.log("✅ Orders created:", order.length);

        if (Boolean(order[0])) {
          console.log("Clearing cart for user:", userId);

          const removeCartItems = await UserModel.findByIdAndUpdate(userId, {
            shopping_cart: [],
          });

          const removeCartProductDB = await CartProductModel.deleteMany({
            userId: userId,
          });

          console.log("✅ Cart cleared successfully");
          console.log("Cart items removed:", removeCartProductDB.deletedCount);
        }
        break;

      default:
        console.log(`⚠️ Unhandled event type: ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event
    response.json({ received: true });
  } catch (error) {
    console.error("=== Webhook Error ===");
    console.error("Error:", error);
    response.status(500).json({
      error: "Webhook handler failed",
      message: error.message,
    });
  }
}

export async function getOrderDetailsController(request, response) {
  try {
    const userId = request.userId; // from auth middleware

    console.log("=== Fetching Orders ===");
    console.log("User ID:", userId);

    const orderlist = await OrderModel.find({ userId: userId })
      .sort({ createdAt: -1 })
      .populate("delivery_address");

    console.log("Orders found:", orderlist.length);
    if (orderlist.length > 0) {
      console.log("First order:", orderlist[0]);
    }

    return response.json({
      message: "order list",
      data: orderlist,
      error: false,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// import Stripe from "../config/stripe.js";
// import CartProductModel from "../models/cartproduct.model.js";
// import OrderModel from "../models/order.model.js";
// import UserModel from "../models/user.model.js";
// import mongoose from "mongoose";

// export async function CashOnDeliveryOrderController(request, response) {
//   try {
//     const userId = request.userId; // auth middleware
//     const { list_items, totalAmt, addressId, subTotalAmt } = request.body;

//     const payload = list_items.map((el) => {
//       return {
//         userId: userId,
//         orderId: `ORD-${new mongoose.Types.ObjectId()}`,
//         productId: el.productId._id,
//         product_details: {
//           name: el.productId.name,
//           image: el.productId.image,
//         },
//         paymentId: "",
//         payment_status: "CASH ON DELIVERY",
//         delivery_address: addressId,
//         subTotalAmt: subTotalAmt,
//         totalAmt: totalAmt,
//       };
//     });

//     const generatedOrder = await OrderModel.insertMany(payload);

//     ///remove from the cart
//     const removeCartItems = await CartProductModel.deleteMany({
//       userId: userId,
//     });
//     const updateInUser = await UserModel.updateOne(
//       { _id: userId },
//       { shopping_cart: [] }
//     );

//     return response.json({
//       message: "Order successfully",
//       error: false,
//       success: true,
//       data: generatedOrder,
//     });
//   } catch (error) {
//     return response.status(500).json({
//       message: error.message || error,
//       error: true,
//       success: false,
//     });
//   }
// }

// export const pricewithDiscount = (price, dis = 1) => {
//   const discountAmout = Math.ceil((Number(price) * Number(dis)) / 100);
//   const actualPrice = Number(price) - Number(discountAmout);
//   return actualPrice;
// };

// export async function paymentController(request, response) {
//   try {
//     const userId = request.userId; // auth middleware
//     const { list_items, totalAmt, addressId, subTotalAmt } = request.body;

//     const user = await UserModel.findById(userId);

//     const line_items = list_items.map((item) => {
//       return {
//         price_data: {
//           currency: "usd",
//           product_data: {
//             name: item.productId.name,
//             images: item.productId.image,
//             metadata: {
//               productId: item.productId._id,
//             },
//           },
//           unit_amount:
//             pricewithDiscount(item.productId.price, item.productId.discount) *
//             100,
//         },
//         adjustable_quantity: {
//           enabled: true,
//           minimum: 1,
//         },
//         quantity: item.quantity,
//       };
//     });

//     const params = {
//       submit_type: "pay",
//       mode: "payment",
//       payment_method_types: ["card"],
//       customer_email: user.email,
//       metadata: {
//         userId: userId,
//         addressId: addressId,
//       },
//       line_items: line_items,
//       success_url: `${process.env.FRONTEND_URL}/success`,
//       cancel_url: `${process.env.FRONTEND_URL}/cancel`,
//     };

//     const session = await Stripe.checkout.sessions.create(params);

//     return response.status(200).json(session);
//   } catch (error) {
//     return response.status(500).json({
//       message: error.message || error,
//       error: true,
//       success: false,
//     });
//   }
// }

// const getOrderProductItems = async ({
//   lineItems,
//   userId,
//   addressId,
//   paymentId,
//   payment_status,
// }) => {
//   const productList = [];

//   if (lineItems?.data?.length) {
//     for (const item of lineItems.data) {
//       const product = await Stripe.products.retrieve(item.price.product);

//       const paylod = {
//         userId: userId,
//         orderId: `ORD-${new mongoose.Types.ObjectId()}`,
//         productId: product.metadata.productId,
//         product_details: {
//           name: product.name,
//           image: product.images,
//         },
//         paymentId: paymentId,
//         payment_status: payment_status,
//         delivery_address: addressId,
//         subTotalAmt: Number(item.amount_total / 100),
//         totalAmt: Number(item.amount_total / 100),
//       };

//       productList.push(paylod);
//     }
//   }

//   return productList;
// };

// //http://localhost:8080/api/order/webhook
// export async function webhookStripe(request, response) {
//   const event = request.body;
//   const endPointSecret = process.env.STRIPE_ENDPOINT_WEBHOOK_SECRET_KEY;

//   console.log("event", event);

//   // Handle the event
//   switch (event.type) {
//     case "checkout.session.completed":
//       const session = event.data.object;
//       const lineItems = await Stripe.checkout.sessions.listLineItems(
//         session.id
//       );
//       const userId = session.metadata.userId;
//       const orderProduct = await getOrderProductItems({
//         lineItems: lineItems,
//         userId: userId,
//         addressId: session.metadata.addressId,
//         paymentId: session.payment_intent,
//         payment_status: session.payment_status,
//       });

//       const order = await OrderModel.insertMany(orderProduct);

//       console.log(order);
//       if (Boolean(order[0])) {
//         const removeCartItems = await UserModel.findByIdAndUpdate(userId, {
//           shopping_cart: [],
//         });
//         const removeCartProductDB = await CartProductModel.deleteMany({
//           userId: userId,
//         });
//       }
//       break;
//     default:
//       console.log(`Unhandled event type ${event.type}`);
//   }

//   // Return a response to acknowledge receipt of the event
//   response.json({ received: true });
// }

// export async function getOrderDetailsController(request, response) {
//   try {
//     const userId = request.userId; // order id

//     const orderlist = await OrderModel.find({ userId: userId })
//       .sort({ createdAt: -1 })
//       .populate("delivery_address");

//     return response.json({
//       message: "order list",
//       data: orderlist,
//       error: false,
//       success: true,
//     });
//   } catch (error) {
//     return response.status(500).json({
//       message: error.message || error,
//       error: true,
//       success: false,
//     });
//   }
// }
