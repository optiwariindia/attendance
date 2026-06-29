import nodemailer from "nodemailer"
class Mail {
  #transporter;
  constructor(credentials) {
    this.#transporter = nodemailer.createTransport({
      connectionTimeout: 10000,
      greetingTimeout: 5000,
      socketTimeout: 15000,
      ...credentials,
    });
  }
  send(from, to, subject, message, cc = undefined, bcc = undefined, attachments = undefined) {
    return new Promise((resolve, reject) => {

      this.#transporter.sendMail({
        from,
        to,
        cc,
        bcc,
        subject,
        attachments,
        text: message.text,
        html: message.html
      }, (error, info) => {
        if (error) {
          return reject(error);
        }
        resolve(info);
      });
    })
  }
  async verify() {
    try {
      console.log("Connecting")
      let resp = await this.#transporter.verify();
      console.log("Connected successfully")
      return true;
    } catch (error) {
      throw error
    }
  }
}

export default Mail;