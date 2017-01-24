import store from '../store/store'
import { addMessage } from '../store/actionCreators'
import messagesCreator from '../helpers/messagesCreator'

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
