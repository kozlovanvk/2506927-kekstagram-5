import {getRandomInteger} from './util.js';

const ids = [];
for (let counter = 1; counter <= 25; counter++) {
  ids.push(counter);
}

const urls = [];
for (let counter = 1; counter <= 25; counter++) {
  urls.push(`photos/${counter}.jpg`);
}

const descriptions = [
  'Хайповая фотография',
  'Каждый день — новое приключение',
  'Здесь и сейчас',
  'Кадры, которые говорят сами за себя',
  'Крутая фотография',
  'Мир вокруг нас полон красоты',
  'Следуй своим мечтам',
  'Неудачная фотография',
  'Уютная фотография',
  'Эстетик',
];

const messages = [
  'Всё отлично!',
  'В целом всё неплохо.Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра.В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают.Как можно было поймать такой неудачный момент ?!',
];

const names = [
  'Павел',
  'Мария',
  'Артем',
  'Наталья',
  'Алина',
  'Елена',
  'Владимир',
  'Анна',
  'Диана',
  'Даниил',
];

const createComment = (commentId) => {
  const randomCommentId = commentId;
  const randomAvatar = `img/avatar-${getRandomInteger(1, 6)}.svg`;
  const randomMessage = messages[getRandomInteger(0, messages.length - 1)];
  const randomName = names[getRandomInteger(0, names.length - 1)];
  return {
    id: randomCommentId,
    avatar: randomAvatar,
    message: randomMessage,
    name: randomName,
  };
};

const createComments = () => {
  const commentIds = [];
  for (let counter = 0; counter < 1000; counter++) {
    commentIds.push(counter);
  }
  const comments = [];
  for (let i = 0; i < getRandomInteger(0, 30); i++) {
    const commentIdinArray = getRandomInteger(0, commentIds.length - 1);
    comments.push(createComment(commentIds[commentIdinArray]));
    delete commentIds[commentIdinArray];
  }
  return comments;
};

const createPost = () => {
  const randomIdIndex = getRandomInteger(0, ids.length - 1);
  const randomId = ids[randomIdIndex];
  ids.splice(randomIdIndex, 1);

  const randomUrlIndex = getRandomInteger(0, urls.length - 1);
  const randomUrl = urls[randomUrlIndex];
  urls.splice(randomUrlIndex, 1);

  const randomDescription = descriptions[getRandomInteger(0, descriptions.length - 1)];

  const randomLikes = getRandomInteger(15, 200);

  return {
    id: randomId,
    url: randomUrl,
    description: randomDescription,
    likes: randomLikes,
    comments: createComments(),
  };
};

export {createPost};
