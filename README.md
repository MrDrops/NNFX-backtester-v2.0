# NNFX-backtester-v2.0
Originally coded 2021

## Description
This Forex manual backtester is a remake of my original one but after learning more about JavaScript and wanting to put into practice. The goal was to speed up manual testing and increase reliability. Its use is to record and store in the database quick visual tests of market indicators to see if it was worth to fully program them into the more robust trading strategy tester. It provides a form for test metadata and test data in the specific order it is visually seen in MetaTrader 5. It then stores the data in an SQL database for further analysis and comparison with other tests. This way, over time, it would be possible to further extrapolate separate indicator performance even if it was initially confounded by being tested together with other indicators.

## Motivation
I had been developing a market model for the Forex market based on the NNFX trading strategy. The main issue was that it required to code every indicator that I wanted to test. This required basically translating them form the proprietary MT5 language and then adapt them to my Python market model. Since there are more than 10000 different indicators, and most are useless, I needed a way to discriminate and only code those that actually had a chance of working, hence this project was born.

## Build Status
The front-end forms for metadata and test data along with the server and the MySql database are connected and work (MVP). I was starting to build a result visual display with chartJS but did not get to finish it.

## Tech used
- HTML
- CSS
- Javascript
- Node
- Mysql2
- Express
- MySql
