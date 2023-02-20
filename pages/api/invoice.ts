// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from "next";

import fs from "fs";
import os from "os";
import path from "path";

import createTemplate from "../../components/create-template";

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  if (req.method === "POST") {
    const result = await createTemplate(req.body);

    // Setting up the response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=invoice.pdf");

    // Save the resulting pdf in the file system
    const {username, company, week} = req.body;
    const weekWithoutSpaces = week.replace(/\s/g, ""); // Remove spaces from week

    const desktopPath = os.homedir() + "/Desktop";
    // const folderPath = path.join(desktopPath, `invoices/${username}/${company}`);
    const folderPath = path.join(desktopPath, `trial/${username}/${company}`);
    const filePath = path.join(folderPath, `${weekWithoutSpaces}_${username}.pdf`);

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, {recursive: true});
    }

    result.pipe(fs.createWriteStream(filePath));

    // Sending the response
    result.pipe(res);
  }
}
