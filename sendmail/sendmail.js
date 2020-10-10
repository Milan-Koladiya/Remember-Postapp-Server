const nodemailer = require('nodemailer')

    const sendmail = (email) =>{
        const auth = nodemailer.createTransport({
            service : 'gmail',
            auth : {
               user : 'test@gmail.com',
               pass : 'test123' 
            }
        })

        const mailTempl = {
            to : email,
            from : 'test@gmail.com',
            subject : 'Welcome in Globaliasoft',
            text : 'Thanks for joining with us',
            html :  '<h3>We are happy to joining you with us</h3>'
        }

        auth.sendMail(mailTempl , (err,res)=>{
            if(err){
                console.log(err)
            }
            console.log(`Email was sent to ${email}`)
        })
    }

    module.exports = sendmail;
