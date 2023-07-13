import mail from "@sendgrid/mail";
import { Request, Response, Router } from "express";

mail.setApiKey(
  "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"
);

const emailRouter = Router();

emailRouter.post("/", async (req: Request, res: Response) => {
  const { to, subject, text, html } = req.body;
  
  if (!to || !subject || !text || !html) {
    return res.status(400).send("Missing parameters");
  }
  const msg = {
    to: to,
    from: "ink.kni.ed.guy@gmail.com",
    subject,
    text,
    html,
  };
  console.log(msg,"msg");
  try {
    // await mail.send(msg);
    // res.status(200).json({
    //   message: "Email sent successfully",
    // });
  } catch (error: any) {
    console.error(error);
    if (error.response) {
      console.error(error.response.body);
    }
    res.status(500).json(error);
  }
});

export default emailRouter;
