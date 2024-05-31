const puppeteer = require("puppeteer");

const url =
  "https://www.pthg.gov.tw/News.aspx?n=EC690F93E81FF22D&sms=90586F8A7E5F4397";

const main = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  for (let index = 0; index < 20; index++) {
    const selector = `#ContentPlaceHolder1_gvIndex_lnkTitle_${index}`;
    await page.waitForSelector(selector);

    const title = await page.evaluate((selector) => {
      const anchor = document.querySelector(selector);
      return anchor ? anchor.getAttribute("title") : null;
    }, selector);

    console.log(title);
  }

  await browser.close();
};

main();
