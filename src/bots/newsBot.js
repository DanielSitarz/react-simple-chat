import store from '../store/store'
import Bot from './Bot'
import { addMessage } from '../store/actionCreators'
import messagesCreator from '../helpers/messagesCreator'

/*
class Bot {
  constructor (cmd) {
    this.cmd = cmd
  }
  check (msg) {
    this.lastMsg = msg

    if (msg[0] !== '!') return false
    if (msg.indexOf(this.cmd) === -1) return false
  }
}

class NewsBot extends Bot {
  constructor () {
    super('news')
  }
}
// Should be abstracted out to more generic class Bot
export default function newsBot (msg) {
  const BOT_NAME = 'News Bot'
  const CMD = 'news'

  if (msg.indexOf(CMD) === -1) return

  const API_ADDR = 'https://newsapi.org/v1/articles?source='
  const API_KEY = '&apiKey=ed34e433fbe2476b958380195cc93017'

  const sources = {
    business: ['bloomberg', 'business-insider', 'business-insider-uk', 'cnbc', 'financial-times', 'fortune', 'the-economist', 'the-wall-street-journal'],
    entertainment: ['buzzfeed', 'daily-mail', 'entertainment-weekly', 'mashable', 'the-lad-bible'],
    sport: ['bbc-sport', 'espn', 'espn-cric-info', 'four-four-two', 'fox-sports', 'nfl-news', 'sky-sports-news', 'talksport', 'the-sport-bible'],
    gaming: ['ign', 'polygon'],
    general: ['abc-news-au', 'associated-press', 'bbc-news', 'cnn', 'google-news', 'independent', 'metro', 'mirror', 'newsweek', 'new-york-magazine', 'reddit-r-all', 'reuters', 'sky-news', 'the-guardian-au', 'the-guardian-uk', 'the-hindu', 'the-huffington-post', 'the-new-york-times', 'the-telegraph', 'the-times-of-india', 'the-washington-post', 'time', 'usa-today'],
    music: ['mtv-news', 'mtv-news-uk'],
    'science-nature': ['national-geographic', 'new-scientist'],
    technology: ['ars-technica', 'engadget', 'hacker-news', 'recode', 'techcrunch', 'techradar', 'the-next-web', 'the-verge']
  }

  var news = {}

  const params = msg.slice(6).split(' ')
  if (params[0] === '') params.pop()

  switch (params.length) {
    case 1:
      if (params[0] === 'help') {
        showHelp()
      } else {
        showArticleForCategory(params[0])
      }
      break
    case 2:
      if (!Number.isNaN(parseInt(params[1]))) {
        showSpecificArticleForCategory(params[0], params[1])
      } else {
        showTopicsForCategory(params[0])
      }
      break
    default:
      showHelp()
      break
  }

  function showArticleForCategory (category) {
    getDataForCategory(category, (data) => {
      sendMessage(data[0].title + ' - ' + data[0].description)
    })
  }

  function showSpecificArticleForCategory (category, index) {
    getDataForCategory(category, (data) => {
      index = index - 1
      if (!data[index]) {
        topicOutOfBounds()
        return
      }
      sendMessage(data[index].title + ' - ' + data[index].description)
    })
  }

  function showTopicsForCategory (category) {
    getDataForCategory(category, (data) => {
      data.forEach((e, i) => {
        sendMessage(`${i + 1}. ${e.title}`)
      })
    })
  }

  function showHelp () {
    sendMessage('!news [category] [article index]')
    showAvailableCategories()
  }

  function categoryDoesntExist (category) {
    sendMessage(`${category} doesn't exist.`)
    showAvailableCategories()
  }

  function showAvailableCategories () {
    const categories = Object.keys(sources).join(', ')
    sendMessage(`Available categories are: ${categories}.`)
  }

  function topicOutOfBounds () {
    sendMessage('Invalid topic index. Choose topic from 1 to 5.')
  }

  function getDataForCategory (category, callback) {
    if (!sources[category]) {
      categoryDoesntExist(category)
      return
    }
    if (news[category]) return callback(news[category])

    return window.fetch(API_ADDR + sources[category][0] + API_KEY).then((response) => {
      return response.json().then((json) => {
        news[category] = json.articles
        callback(news[category])
      })
    })
  }

  function sendMessage (content) {
    const msg = messagesCreator.create({
      sender: BOT_NAME,
      content: content
    })
    store.dispatch(addMessage(msg))
  }
}
*/

export class NewsBot extends Bot {
  constructor () {
    super('news')

    this.API_ADDR = 'https://newsapi.org/v1/articles?source='
    this.API_KEY = '&apiKey=ed34e433fbe2476b958380195cc93017'

    this.sources = {
      business: ['bloomberg', 'business-insider', 'business-insider-uk', 'cnbc', 'financial-times', 'fortune', 'the-economist', 'the-wall-street-journal'],
      entertainment: ['buzzfeed', 'daily-mail', 'entertainment-weekly', 'mashable', 'the-lad-bible'],
      sport: ['bbc-sport', 'espn', 'espn-cric-info', 'four-four-two', 'fox-sports', 'nfl-news', 'sky-sports-news', 'talksport', 'the-sport-bible'],
      gaming: ['ign', 'polygon'],
      general: [
        'abc-news-au', 'associated-press', 'bbc-news', 'cnn',
        'google-news', 'independent', 'metro', 'mirror', 'newsweek',
        'new-york-magazine', 'reddit-r-all', 'reuters', 'sky-news', 'the-guardian-au',
        'the-guardian-uk', 'the-hindu', 'the-huffington-post', 'the-new-york-times',
        'the-telegraph', 'the-times-of-india', 'the-washington-post', 'time', 'usa-today'
      ],
      music: ['mtv-news', 'mtv-news-uk'],
      'science-nature': ['national-geographic', 'new-scientist'],
      technology: ['ars-technica', 'engadget', 'hacker-news', 'recode', 'techcrunch', 'techradar', 'the-next-web', 'the-verge']
    }

    this.news = {}
  }

  parseParams (params) {
    switch (params.length) {
      case 1:
        if (params[0] === 'help') {
          this.showHelp()
        } else {
          this.showArticleForCategory(params[0])
        }
        break
      case 2:
        if (!Number.isNaN(parseInt(params[1]))) {
          this.showSpecificArticleForCategory(params[0], params[1])
        } else {
          this.showTopicsForCategory(params[0])
        }
        break
      default:
        this.showHelp()
        break
    }
  }

  showHelp () {
    this.sendMessage('!news [category] [article index]')
    this.showAvailableCategories()
  }

  showAvailableCategories () {
    const categories = Object.keys(this.sources).join(', ')
    this.sendMessage(`Available categories are: ${categories}.`)
  }

  showArticleForCategory (category) {
    this.getNews(category, this.sources[category][0], (data) => {
      this.sendMessage(data[0].title + ' - ' + data[0].description)
    })
  }
  showSpecificArticleForCategory (category, index) {
    this.getNews(category, this.sources[category][0], (data) => {
      index = index - 1
      if (!data[index]) {
        // topicOutOfBounds()
        return false
      }
      this.sendMessage(data[index].title + ' - ' + data[index].description)
    })
  }
  showTopicsForCategory (category) {
    this.getNews(category, this.sources[category][0], (data) => {
      let msg = []
      data.forEach((e, i) => {
        msg.push(`${i + 1}. ${e.title}`)
      })
      this.sendMessage(msg.join('\n'))
    })
  }

  sendMessage (content) {
    const msg = messagesCreator.create({
      sender: 'News Bot',
      content: content
    })
    store.dispatch(addMessage(msg))
  }

  getNews (category, source, callback) {
    if (!this.sources[category]) {
      this.categoryDoesntExist(category)
      return false
    }
    if (this.news[category]) {
      return callback(this.news[category])
    } else {
      this.fetchNews(category, source, callback)
    }
  }

  fetchNews (category, source, callback) {
    window.fetch(this.API_ADDR + source + this.API_KEY).then((response) => {
      response.json().then((json) => {
        this.news[category] = json.articles
        callback(this.news[category])
      })
    })
  }
}
