const PORT = 8008
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const {response} = require("express");

const app = express()

const newspapers = [
    {
        name: 'nyt',
        address: 'https://www.nytimes.com/section/climate',
        base:''
    },
    {
        name: 'guardian',
        address: 'https://www.theguardian.com/environment/climate-crisis',
        base:''
    },
    {
        name:'nasa',
        address: 'https://climate.nasa.gov/',
        base:''
    },
    {
        name:'gov',
        address: 'https://www.climate.gov/',
        base: ''
    },
    {
        name:'worldwildlife',
        address: 'https://www.worldwildlife.org/topic/climate-change',
        base: ''
    },
    {
        name:'climatecentral',
        address: 'https://www.climatecentral.org/',
        base: ''
    },
    {
        name:'gov-news',
        address: 'https://www.climate.gov/news-features',
        base: ''
    },
    {
        name:'climaterealityproject',
        address: 'https://www.climaterealityproject.org/',
        base: ''
    },
    {
        name:'climatechangenews',
        address: 'https://www.climatechangenews.com/',
        base: ''
    },
    {
        name:'climateaction',
        address: 'https://www.climateaction.org/',
        base: ''
    },
    {
        name:'climatehawksvote',
        address: 'https://www.climatehawksvote.com/',
        base: ''
    },
    {
        name:'climatecouncil',
        address: 'https://www.climatecouncil.org.au/',
        base: ''
    },
]

const articles = []

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("climate")', html).each(function () {
              const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                })
            })

        })
})

app.get('/',(req,res) => {
    res.json('welcome to my climate change new api stuff')
})

app.get('/news', (req, res) => {
    res.json(articles)

    //for 1 website
    // axios.get('https://www.theguardian.com/environment/climate-crisis')
    //     .then((response) =>{
    //         const html = response.data
    //         const $ = cheerio.load(html)
    //
    //         $('a:contains("climate")', html).each(function () {
    //           const title = $(this).text()
    //             const url = $(this).attr('href')
    //             articles.push({
    //                 title,
    //                 url
    //             })
    //         })
    //         res.json(articles)
    //     }).catch((err) => console.log(err))
})

app.get('/news/:newspaperId',(req, res)=>{
    const  newspaperId = req.params.newspaperId

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
    const  newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base

    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("climate")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperId
                })
            })
            res.json(specificArticles)
        }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))