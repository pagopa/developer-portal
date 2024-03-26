import { th } from "@markdoc/markdoc/dist/src/schema";
import { boolean } from "io-ts";
import { threadId } from "worker_threads";

type NewsItem = {
  title: string;
  link: Links;
  image?: string;
  comingSoon?: boolean;
}

type Links = {
  text: string;
  href: string;
  target?: unknown;
}

function assertIsNewsItem(item: unknown): NewsItem {
  if (typeof item !== 'object' || item === null) {
    throw new Error('News item is not an object');
  }

  if (typeof item.title !== 'string') {
    throw new Error('News item title:"' +  item.title  +'"is not a string');
  }

  if (typeof item.link !== 'object' || item.link === null) {
    throw new Error('News item link is not an object');
  }

  if (typeof item.link.text !== 'string') {
    throw new Error('News item link text is not a string');
  }

  if (typeof item.link.href !== 'string') {
    throw new Error('News item link href is not a string');
  }

  if (item.image !== undefined && typeof item.image !== 'string') {
    throw new Error('News item image is not a string');
  }

  if (item.comingSoon !== undefined && typeof item.comingSoon !== 'boolean') {
    throw new Error('News item comingSoon is not a boolean');
  }

  return item as NewsItem;
}

fetch('/api/news') 