require('dotenv').config()
const nodemailer = require("nodemailer");

let sendSimpleEmail = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });
    if (dataSend.type === 'verifyEmail') {
        let info = await transporter.sendMail({
            from: '"BiNgo2706 👻" <dotanthanhvlog@gmail.com>', // sender address
            to: dataSend.email, // list of receivers
            subject: "Xác thực email | Sneaker Hubs", // Subject line
            html: getBodyHTMLEmailVerify(dataSend)
        });
    }
    if (dataSend.type === 'forgotpassword') {
        let info = await transporter.sendMail({
            from: '"BiNgo2706 👻" <dotanthanhvlog@gmail.com>', // sender address
            to: dataSend.email, // list of receivers
            subject: "Xác nhận quên mật khẩu | Sneaker Hubs", // Subject line
            html: getBodyHTMLEmailForgotPassword(dataSend)
        });
    }
    if (dataSend.type === 'order') {
        let info = await transporter.sendMail({
            from: '"BiNgo2706 👻" <dotanthanhvlog@gmail.com>', // sender address
            to: dataSend.email, // list of receivers
            subject: "Đặt hàng", // Subject line
            html: getBodyHTMLOrderL(dataSend)
        });
    }
}
let getBodyHTMLEmailVerify = (dataSend) => {
    let fullname = `${dataSend.firstName} ${dataSend.lastName}`
    let result = `<h3>Xin chào ${fullname}!</h3>
        <p>Bạn nhận được email này vì đã thực hiện lệnh xác thực email!</p>
        <p>Bui lòng click vào đường link bên dưới để xác nhận và hoàn tất thủ tục xác minh email của bạn</p>
        <div>
            <a href="${dataSend.redirectLink}" target=""_blank>Click here</a>
        </div>
        <div>Xin cảm ơn !</div>
    `

    return result;
}
let getBodyHTMLOrderL = (dataSend) => {
    const order = dataSend.orderData;
    const { addressData, OrderDetails, typeShipData } = order;

    const currencyFormat = (price) => {
        return 'đ' + price.toLocaleString('vi-VN');
    };

    const itemsHTML = OrderDetails.map(item => {
        return `
      <div style="display: flex; align-items: center; border-top: 1px solid #eee; padding: 10px 0;">
          <img src="${item.image}" width="70" height="70" style="margin-right: 10px;">
          <div style="flex-grow: 1;">
              <p style="margin: 0;"><strong>Sản phẩm ID:</strong> ${item.productId}</p>
              <p style="margin: 0;">Size: ${item.size} | Màu: 
                <span style="display:inline-block;width:12px;height:12px;background:${item.color};border-radius:50%;"></span>
              </p>
              <p style="margin: 0;">x${item.quantity}</p>
          </div>
          <div style="font-weight: bold;">${currencyFormat(item.realPrice)}</div>
      </div>`;
    }).join('');

    const total = OrderDetails.reduce((sum, item) => sum + item.realPrice * item.quantity, 0) + (typeShipData?.price || 0);

    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
        <h3>Xin chào ${addressData.shipName}!</h3>
        <p>Bạn đã đặt hàng thành công tại <strong>Sneakerhub</strong>.</p>
        <p><strong>Mã đơn hàng:</strong> ${order.id}</p>

        <h4>Thông tin giao hàng:</h4>
        <p><strong>Người nhận:</strong> ${addressData.shipName}</p>
        <p><strong>Địa chỉ:</strong> ${addressData.shipAdress}</p>
        <p><strong>Email:</strong> ${addressData.shipEmail}</p>
        <p><strong>Điện thoại:</strong> ${addressData.shipPhonenumber}</p>

        <h4>Chi tiết đơn hàng:</h4>
        ${itemsHTML}

        <div style="text-align: right; margin-top: 20px; border-top: 1px solid #eee; padding-top: 10px;">
            <strong style="font-size: 18px; color: red;">Tổng cộng: ${currencyFormat(dataSend.orderData.total)}</strong>
        </div>

        <p style="margin-top: 20px;">Cảm ơn bạn đã mua hàng!</p>
    </div>
  `;
};

let getBodyHTMLEmailForgotPassword = (dataSend) => {
    let fullname = `${dataSend.firstName} ${dataSend.lastName}`
    let result = `<h3>Xin chào ${fullname}!</h3>
        <p>Bạn nhận được email này vì đã thực hiện lệnh quên mật khẩu!</p>
        <p>Bui lòng click vào đường link bên dưới để xác nhận quên mật khẩu và lấy lại mật khẩu của bạn</p>
        <div>
            <a href="${dataSend.redirectLink}" target=""_blank>Click here</a>
        </div>
        <div>Xin cảm ơn !</div>
    `

    return result;
}
// let sendAttachment = async (dataSend) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             let transporter = nodemailer.createTransport({
//                 host: "smtp.gmail.com",
//                 port: 587,
//                 secure: false, // true for 465, false for other ports
//                 auth: {
//                     user: process.env.EMAIL_APP,
//                     pass: process.env.EMAIL_APP_PASSWORD,
//                 },
//             });

//             let info = await transporter.sendMail({
//                 from: '"BiNgo2706 👻" <dotanthanhvlog@gmail.com>', // sender address
//                 to: dataSend.email, // list of receivers
//                 subject: "Thông tin đặt lịch khám bệnh", // Subject line
//                 html: getBodyHTMLEmailRemedy(dataSend),
//                 attachments: [
//                     {
//                         filename: `remedy-${dataSend.patientId}-${new Date().getTime()}.${dataSend.filename}`,
//                         content: dataSend.imgBase64.split("base64,")[1],
//                         encoding: 'base64'
//                     }
//                 ]
//             });
//             resolve()
//         } catch (error) {
//             reject(error)
//         }
//     })
// }
module.exports = {
    sendSimpleEmail: sendSimpleEmail,

}