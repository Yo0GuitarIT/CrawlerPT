const puppeteer = require("puppeteer");

class WebScraper {
  constructor(url) {
    this.url = url;
    this.browser = null;
    this.page = null;
  }

  async initialize() {
    this.browser = await puppeteer.launch();
    this.page = await this.browser.newPage();
    await this.page.goto(this.url);
  }

  async getTitle(selector) {
    await this.page.waitForSelector(selector);
    const title = await this.page.evaluate((selector) => {
      const anchor = document.querySelector(selector);
      return anchor ? anchor.getAttribute("title") : null;
    }, selector);
    return title;
  }

  async scrapeTitles() {
    const titles = [];
    const titleIndex = 20;

    for (let i = 0; i < titleIndex; i++) {
      const selector = `#ContentPlaceHolder1_gvIndex_lnkTitle_${i}`;
      const title = await this.getTitle(selector);
      titles.push(title);
    }

    return titles;
  }

  async close() {
    await this.browser.close();
  }
}

const main = async (url) => {
  console.log("Start...");
  const scraper = new WebScraper(url);
  
  console.log("intialize...")
  await scraper.initialize();

  console.log("Scraping ...")
  const titles = await scraper.scrapeTitles();
  titles.forEach((element) => {
    console.log(element);
  });

  await scraper.close();
  console.log("done");
};

const url =
  "https://www.pthg.gov.tw/News.aspx?n=EC690F93E81FF22D&sms=90586F8A7E5F4397";

main(url);
