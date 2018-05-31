declare const require: any;
import * as env from '../../.env';
const pkg = require('../../package.json');

export const environment = {production: false,
  app: {
    name: env.APP_NAME,
    version: (pkg as any).version,
    description: (pkg as any).description,
    url: `${env.APP_SCHEMA}://${env.APP_HOST}:${env.APP_PORT}`,
    meta: [
      {charset: 'utf-8'},
      {name: 'description', content: 'Si deseas promociarte como artista o apoyar futuras promesas como editor, tenemos lo que necesitas. Somos la red social de contacto entre artistas y editores.'}, // tslint:disable-line:max-line-length
      {name: 'keywords', content: 'diseño, ilustración, red social artistas, red social editores, contacto artistas, red contactos, donativos, escritura'}, // tslint:disable-line:max-line-length
      {name: 'viewport', content: 'width=device-width, initial-scale=1, shrink-to-fit=no'},
      {property: 'og:title', content: 'Contacto artistas y editores | Inarts'},
      {property: 'og:locale', content: 'es_ES'},
      {property: 'og:description', content: 'Si deseas promociarte como artista o apoyar futuras promesas como editor, tenemos lo que necesitas. Somos la red social de contacto entre artistas y editores.'}, // tslint:disable-line:max-line-length
      {property: 'og:type', content: 'website'},
      {property: 'og:url', content: `${env.APP_SCHEMA}://${env.APP_HOST}`},
      {property: 'og:image', content: `assets/img/og/1200x630.png`},
    ]
  },
  api: {
    url: `${env.API_URL}`,
    user: {
      getUser: `${env.API_URL}${env.API_PREFIX}${env.API_VERSION}user/`,
      registerUser: `${env.API_URL}${env.API_PREFIX}${env.API_VERSION}user/registry/`,
      validateUser: `${env.API_URL}${env.API_PREFIX}${env.API_VERSION}user/validation/`,
      authenticate: `${env.API_URL}${env.API_PREFIX}${env.API_VERSION}user/auth/`,
      tokenValidation: `${env.API_URL}${env.API_PREFIX}${env.API_VERSION}user/auth/`,
      deleteUser: `${env.API_URL}${env.API_PREFIX}${env.API_VERSION}user/`,
      updatePassword: `${env.API_URL}${env.API_PREFIX}${env.API_VERSION}user/`,
      updateUser: `${env.API_URL}${env.API_PREFIX}${env.API_VERSION}user/`,
      admin: {
        getValids: `${env.API_URL}${env.API_PREFIX}${env.API_VERSION}user/validation/`,
        createUser: `${env.API_URL}${env.API_PREFIX}${env.API_VERSION}user/`,
      }
    },
    chat: {
      getChats: `${env.API_URL}${env.API_PREFIX}${env.API_VERSION}chat/`,
      getMessages: `${env.API_URL}${env.API_PREFIX}${env.API_VERSION}chat/message/`,
      createChat: `${env.API_URL}${env.API_PREFIX}${env.API_VERSION}chat/`,
      deleteChat: `${env.API_URL}${env.API_PREFIX}${env.API_VERSION}chat/`,
      admin: {
        deleteMessage: `${env.API_URL}${env.API_PREFIX}${env.API_VERSION}chat/message/`,
      }
    },
    subscription: {
      getSubscription: `${env.API_URL}${env.API_PREFIX}${env.API_VERSION}subscription/`,
      getMessages: `${env.API_URL}${env.API_PREFIX}${env.API_VERSION}subscription/`,
      createChat: `${env.API_URL}${env.API_PREFIX}${env.API_VERSION}subscription/`,
    },
    post: {
      getPost: `${env.API_URL}${env.API_PREFIX}${env.API_VERSION}post/`,
      createPost: `${env.API_URL}${env.API_PREFIX}${env.API_VERSION}post/`,
    },
    feed: {
      getPosts: `${env.API_URL}${env.API_PREFIX}${env.API_VERSION}feed/`,
      getPrevious: `${env.API_URL}${env.API_PREFIX}${env.API_VERSION}feed/prev/`
    },
    reaction: {
      getReaction: `${env.API_URL}${env.API_PREFIX}${env.API_VERSION}reaction/`,
      react: `${env.API_URL}${env.API_PREFIX}${env.API_VERSION}reaction/`,
    },
    comment: {
      getComment: `${env.API_URL}${env.API_PREFIX}${env.API_VERSION}comment/`,
      newComment: `${env.API_URL}${env.API_PREFIX}${env.API_VERSION}comment/`,
    },
    notification: {
      getNotification: `${env.API_URL}${env.API_PREFIX}${env.API_VERSION}notification/`,
    }
  }
};
