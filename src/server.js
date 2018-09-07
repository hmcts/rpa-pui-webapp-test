const express = require('express')
const nunjucks = require('nunjucks')
//const log4js = require('express')
const path = require('path')

const app = express()
const PORT = 4001

// Components
const homeComponent = require('./components/home/home.js')
const { PUICreateAccountComponent } = require('./components/create-account/create-account.js')

var viewDirs = [
    __dirname,
    'components',
    'components/layout', // because of "includes" dependency in base.html - possible improvement here ?
    '../node_modules/govuk-frontend/',
    '../node_modules/govuk-frontend/components',
    '../node_modules/@hmcts/frontend/components'
]

nunjucks.configure(viewDirs, {
    autoescape: true,
    express: app,
    noCache: true,
    watch: true
})

//express view engine settings
app.engine('html', nunjucks.render)
app.set('view engine', 'html')

app.use(express.static('../dist'))

app.use(
    (req, res, next) => {
        res.setHeader('Cache-Control', 'private, no-cache, no-store, max-age=0')
        res.setHeader('Pragma', 'no-cache')
        res.setHeader('Expires', '0')
        next()
    }
)

// static assets
app.use(express.static('dist'))
app.use('/assets', express.static(path.join(__dirname, '../dist/assets')))

// components
app.get('/', homeComponent.home)

let puiCreateAccountComponent = new PUICreateAccountComponent({
    routingPrefix: '/create-account'
})
puiCreateAccountComponent.installToExpress(app)

// Start !
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})
