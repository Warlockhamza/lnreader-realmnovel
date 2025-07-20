
import {
  Plugin,
  PluginChapter,
  PluginNovel,
  PluginSearch,
} from '@lnreader/core';

const baseUrl = 'https://www.realmnovel.com';

const id = 'realmnovel';
const name = 'RealmNovel';

const searchNovels: PluginSearch = async (searchTerm) => {
  const searchUrl = `${baseUrl}/search?keyword=${encodeURIComponent(searchTerm)}`;
  const res = await fetch(searchUrl);
  const text = await res.text();
  const $ = cheerio.load(text);

  const novels: PluginNovel[] = [];

  $('.book-img-text li').each((_, el) => {
    const novelName = $(el).find('.book-mid-info h4 a').text().trim();
    const novelUrl = baseUrl + $(el).find('.book-mid-info h4 a').attr('href');
    const cover = $(el).find('.book-img-box img').attr('src');

    novels.push({
      name: novelName,
      url: novelUrl,
      cover,
    });
  });

  return novels;
};

const fetchNovelDetails = async (novelUrl: string): Promise<PluginNovel> => {
  const res = await fetch(novelUrl);
  const text = await res.text();
  const $ = cheerio.load(text);

  const name = $('.book-info h1 em').text().trim();
  const author = $('.book-info h1 span').text().trim();
  const summary = $('.book-intro p').text().trim();
  const cover = $('.book-img img').attr('src');
  const chapters: PluginChapter[] = [];

  $('#chapterList li a').each((_, el) => {
    const title = $(el).text().trim();
    const url = baseUrl + $(el).attr('href');
    chapters.push({ name: title, url });
  });

  return {
    name,
    url: novelUrl,
    author,
    cover,
    summary,
    chapters,
  };
};

const fetchChapter = async (chapterUrl: string): Promise<string> => {
  const res = await fetch(chapterUrl);
  const text = await res.text();
  const $ = cheerio.load(text);

  return $('.read-content').html()?.trim() || '';
};

const plugin: Plugin = {
  id,
  name,
  version: '1.0.0',
  site: baseUrl,
  lang: 'en',
  searchNovels,
  fetchNovelDetails,
  fetchChapter,
};

export default plugin;
