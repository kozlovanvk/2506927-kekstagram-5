import './util.js';
import {createPost} from './data.js';

const posts = [];
for (let i = 0; i < 25; i++) {
  posts.push(createPost());
}
/*Создание постов можно было перенести в data.js,
но ругается проверка, что не используется posts, и что её нельзя вывести в консоль, я сделала пока так*/
