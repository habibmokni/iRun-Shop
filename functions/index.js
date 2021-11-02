const functions = require("firebase-functions");
const admin=require("firebase-admin");
const nodemailer =require("nodemailer");
admin.initializeApp();


// eslint-disable-next-line max-len
exports.sendEmailNotification=functions.firestore.document("orderList/{docId}")
    .onCreate((snap, _ctx)=>{
      const data=snap.data();
      const details = data.billingDetails;
      const email = details.email;
      const authData=nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: "hm.cc.project@gmail.com",
          pass: "habibmoknicnc2021",
        },
      });

      var products = '';
      for(let product of data.productsOrdered){
        products += '<li>Product Name: '+product.productName+ '</li>' + '<li>Model No: '+product.modelNo+ '</li>' + '<li>Size: '+product.size+ '</li>' + '<li>Price: '+product.price+ '</li>';
      }

      authData.sendMail({
        from: "info.habibmokni@cnc.com",
        to: `${email}`,
        subject: "iRun Order confirmation",
        text: "Hi thank you for shopping at iRun. Your order is confirmed and we are processing it. An email will be sent to you when it is ready for pickup. Following are your order details:",
        html: `
            <p>Hi thank you for shopping at iRun. Your order is confirmed and we are processing it. An email will be sent to you when it is ready for pickup. Following are your order details:</p>
            <h3>Order No: <span>${data.orderId}</span></h3>
            <h3>Name: <span>${details.name}</span></h3>
            <h3>Email: <span>${details.email}</span></h3>
            <h3>Phone No: <span>${details.phoneNo}</span></h3>
            <h3>Address 1: <span>${details.address1}</span></h3>
            <h3>Address 2: <span>${details.address2}</span></h3>
            <h3>Payment Option: <span>${data.paymentOption}</span></h3>
            <h3>Pickup Date: <span>${data.pickupDate}</span></h3>
            <h3>Pickup Time: <span>${data.pickupTime}</span></h3>
            <h3>Pickup Type: <span>${data.pickupType}</span></h3>
            <h3>Order Price: <span>${data.orderPrice}</span></h3>
            <h2>Products Ordered</h2>
            <ul style="list-style: none;">
              ${products}
            </ul>

        `,
      // eslint-disable-next-line max-len
      }).then((_res)=>console.log("successfully sent that mail")).catch((err)=>console.log(err));
    });

