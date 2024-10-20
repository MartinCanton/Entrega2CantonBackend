import transporter from "../config/nodemailer.config.js";

export const sendPurchaseEmail = async (ticketData, purchasedProducts, email) => {
    const productList = purchasedProducts.map((product) => `<li>${product.title} - ${product.quantity} unidades</li>`).join('');
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Confirmación de compra: ${ticketData.code}`,
        html:  `
        <h1>¡Gracias por tu compra!</h1>
        <p>Ticket ID: <strong>${ticketData.code}</strong></p>
        <p>Monto Total: <strong>$${ticketData.amount}</strong></p>
        <p>Fecha: ${new Date(ticketData.purchase_datetime).toLocaleString()}</p>
        <h2>Productos Comprados:</h2>
        <ul>${productList}</ul>
      `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Correo enviado con exito');
    } catch (error) {
        console.error('Error al enviar el correo', error);
        throw new Error("No se pudo enviar el correo");        
    }    
}