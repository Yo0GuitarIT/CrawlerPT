import puppeteer, { Browser, Page } from "puppeteer";

class WebScraper {
  url: string;
  browser: Browser | null = null;
  page: Page | null = null;
  constructor(url: string) {
    this.url = url;
    this.browser = null;
    this.page = null;
  }

  async initialize(): Promise<void> {
    this.browser = await puppeteer.launch();
    this.page = await this.browser.newPage();
    await this.page.goto(this.url);
  }

  async waitForPageSelector(selector: string) {
    if (!this.page) throw new Error("Page not initialized");
    await this.page.waitForSelector(selector);
  }

  async getTargetElement(
    selector: string,
    attribute: string
  ): Promise<string | null> {
    await this.waitForPageSelector(selector);
    const articleUrl = await this.page.evaluate(
      (selector, attribute) => {
        const anchor = document.querySelector(selector);
        return anchor ? anchor.getAttribute(attribute) : null;
      },
      selector,
      attribute
    );
    return articleUrl;
  }

  async scrapeArticleUrl(): Promise<string | null> {
    const selector = "a[title=屏東新聞]";
    const url = await this.getTargetElement(selector, "href");
    return url;
  }

  async scrapeTitles(): Promise<(string | null)[]> {
    const titles: (string | null)[] = [];
    const titleIndex = 20;
    for (let i = 0; i < titleIndex; i++) {
      const selector = `#ContentPlaceHolder1_gvIndex_lnkTitle_${i}`;
      const title = await this.getTargetElement(selector, "title");
      titles.push(title);
    }
    return titles;
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

const main = async (url: string): Promise<void> => {
  const homeScraper = new WebScraper(url);
  await homeScraper.initialize();
  const scraperArticleUrl = await homeScraper.scrapeArticleUrl();
  const newsUrl = `${baseUrl.slice(0, -13)}/${scraperArticleUrl}`;
  await homeScraper.close();

  const newsScraper = new WebScraper(newsUrl);
  await newsScraper.initialize();
  const titles = await newsScraper.scrapeTitles();
  titles.forEach((element) => {
    console.log(element);
  });
  await newsScraper.close();
};

const baseUrl = "https://www.pthg.gov.tw/Default.aspx";
main(baseUrl);
