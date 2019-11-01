const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'phi@stacksmarketing.com',
        subject: 'Welcome to the Stool Squad!',
        // Backticks vvvvvv you can only insert when the template string is surrounded by backticks
        text: `Welcome to the the app!! ${name} Please don't hesitate to let us know if you think of any way we can improve :) `
    })
}

const cancelAccountEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'phi@stacksmarketing.com',
        subject: "Phi from Stool Squad here!",
        text: `Thank you for trying out our Stool Squad, ${name}, we really hope you enjoyed your time with us :)`
    })
}

// sgMail.send({
//     to: 'pnguy55@gmail.com',
//     from: 'codephony@gmail.com',
//     subject: 'This is my first creation',
//     text: 'I hope this one actually gets to you'
// })

module.exports = {
    sendWelcomeEmail,
    cancelAccountEmail
}