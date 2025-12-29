import VerificationEmail from "@/components/email/VerificationEmail";
import { Resend } from "resend";
import {render, toPlainText} from "@react-email/render"

const resend = new Resend(process.env.RESEND_API_KEY) // create a resend client instance (new is for creating instance)


export const sendVerficationEmail = async (email: string, name: string ,token: String) => {

    // construct the verification url with our app public url
    const verificationURL = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify-email?token=${token}`;

    // render the email template as html
    const emailHtml = await render(VerificationEmail({name, verificationURL}));
    console.log('rendered jsx component email into html',emailHtml)

    try {
        const {data,error} = await resend.emails.send({
            from: "KongdenApp <kongden-app@kongden.space>",
            to:email,
            subject: 'Verify your email address',
            html: emailHtml,
        });

        if(error){
            console.error('Resend Error',error);
            throw new Error('Failed to send verification email');
        }

        console.log('Verification email sent:', data);
    } catch (error) {
        console.error('Failed to send verification email', error);
        throw new Error('Failed to send verification email');
    }
}