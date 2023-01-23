const PORT = 8008
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const {response} = require("express");

const app = express()

const newspapers = [
    {
        name: 'the new york times',
        address: 'https://www.nytimes.com/section/climate',
    },
    {
        name: 'guardian',
        address: 'https://www.theguardian.com/environment/climate-crisis',
    },
    {
        name:'nasa',
        address: 'https://climate.nasa.gov/',
    }
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
                    url,
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

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))