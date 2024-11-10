import React from "react";
import "../css/OrderConfirmation.css";

const OrderConfirmation = () => {
  return (
    <div className="order-confirmation">
      <h2>Order Confirmation</h2>
      {/* Order placement and dispatch message */}
      <div className="order-message">
        <p><strong>Your order has been successfully placed!</strong></p>
        <p>Your order is now ready for dispatch! Please pick up your order from:</p>
        <p><strong>Gokul Agro Agency</strong><br />
           Near Sardar Vallabhbhai Patel, Bedi,<br />
           Rajkot Morbi Highway, Rajkot-360003
        </p>
        <p>At <strong>Gokul Seed Tech Ltd</strong>, we deeply appreciate your trust . We understand the importance of providing quality products for your farming needs, and we're honored to serve you.</p>
        <p>Thank you for choosing us as your partner in growth. We look forward to serving you again!</p>
      </div>
    </div>
  );
};

export default OrderConfirmation;
