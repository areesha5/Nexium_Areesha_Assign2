import axios from 'axios';
import * as cheerio from 'cheerio';

export async function scrapeBlog(url: string): Promise<string> {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  return $('body').text(); // simplified scrape
}
