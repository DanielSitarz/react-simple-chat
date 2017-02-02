import Bot from './Bot'

export default class NewsBot extends Bot {
  constructor (sendResponse) {
    super('news', 'News Bot', sendResponse)

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

  getResponse (params) {
    this.parseParams(params)
  }

  parseParams (params) {
    if (!params) {
      this.showHelp()
      return false
    }

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
          this.showArticlesForCategory(params[0])
        }
        break
      default: this.showHelp()
    }
  }

  showHelp () {
    this.sendResponse(this, '!news [category] [article_index or "list"]\n' + this.showAvailableCategories())
  }

  showAvailableCategories () {
    const categories = Object.keys(this.sources).join(', ')
    return `Available categories are: ${categories}.`
  }

  showArticleForCategory (category) {
    if (!this.categoryExist(category)) return false

    this.getArticles(category, this.sources[category][0], (data) => {
      this.sendResponse(this, data[0].title + ' - ' + data[0].description)
    })
  }
  showSpecificArticleForCategory (category, index) {
    if (!this.categoryExist(category)) return false

    this.getArticles(category, this.sources[category][0], (data) => {
      index = index - 1
      if (!data[index]) {
        this.articleOutOfBounds(data.length)
      }
      this.sendResponse(this, data[index].title + ' - ' + data[index].description)
    })
  }
  showArticlesForCategory (category) {
    if (!this.categoryExist(category)) return false

    this.getArticles(category, this.sources[category][0], (data) => {
      let msg = []
      data.forEach((e, i) => {
        msg.push(`${i + 1}. ${e.title}`)
      })
      this.sendResponse(this, msg.join('\n'))
    })
  }

  articleOutOfBounds (maxIndex) {
    this.sendResponse(this, `Article doesn't exist, max article index is ${maxIndex}.`)
  }

  categoryExist (category) {
    if (!this.sources[category]) {
      this.categoryDoesntExist(category)
      return false
    }
    return true
  }

  categoryDoesntExist (category) {
    this.sendResponse(this, `Category "${category}" doesn't exist.\n` + this.showAvailableCategories())
  }

  getArticles (category, source, callback) {
    if (!this.categoryExist(category)) return false

    if (this.news[category]) {
      return callback(this.news[category])
    } else {
      this.fetchArticles(category, source, callback)
    }
  }

  fetchArticles (category, source, callback) {
    window.fetch(this.API_ADDR + source + this.API_KEY).then((response) => {
      response.json().then((json) => {
        this.news[category] = json.articles
        callback(this.news[category])
      })
    })
  }
}
