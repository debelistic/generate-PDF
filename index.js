const fs = require('fs')
const path = require('path')
const utils = require('util')
const puppeteer = require('puppeteer')
const hb = require('handlebars')
const readFile = utils.promisify(fs.readFile)

const fileName = './sample.pdf'

function getFile() {
  return readFile(fileName);
}

async function getTemplateHtml() {
  console.log("Loading template file in memory")
  try {
  const certPath = path.resolve("./index.html")
  return await readFile(certPath, 'utf8')
  } catch (err) {
  console.log(err)
  return Promise.reject("Could not load html template")
  }
}
async function generatePdf(parameter1, parameter2) {
  
  const data = {
    parameter1,
    parameter2
  }
  getTemplateHtml().then(async (res) => {
  const template = hb.compile(res, { strict: true })
  const result = template(data)
  const html = result
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setContent(html)
  await page.emulateMedia('screen')
  await page.pdf({ path: fileName, format: 'A4', landscape: true, printBackground: true })
  await browser.close()
 
  console.log("PDF Generated")
  }).catch(err => {
  console.error('TRYING TO GENERATE>>>> ', err)
  })
}
