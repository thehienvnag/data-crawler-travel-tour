# Data Crawler for ITour Travel Project

- This tool is made to crawl data for ITour Travel Project.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Installing
- Install required packaged of the tool (includes Chromium r756035 and Puppeteer):
```
npm install
```
### Usage
1. Excecute crawler in terminal: 
```
node dataCrawler.js
```
2. Execute generating Insert Stament to DB
```
node generateInsert.js
```
## Built With

* [Puppeteer](https://pptr.dev/) - The node library to provide api for crawling data
* [Chromium] - Versioning (Chromium r756035) - The headless browser that is downloaded and installed when installing **Puppeteer**
* [Node.js](https://nodejs.org/en/) - The JavaScript runtime

## Authors

* **Huynh The Hien** 
