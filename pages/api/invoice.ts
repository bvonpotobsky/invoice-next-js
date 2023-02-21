// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from "next";

import fs from "fs";
import os from "os";
import path from "path";

import createTemplate from "../../components/create-template";

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  if (req.method === "POST") {
    const invoice = await createTemplate(req.body);
    const userAgent = req.headers["user-agent"];

    // Download the invoice as a PDF in mobile devices
    if (userAgent.includes("Android") || userAgent.includes("iPhone")) {
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=invoice.pdf");
      res.send(invoice);
    }
  }
}
