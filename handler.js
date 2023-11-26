const AWS = require('aws-sdk');
const puppeteer = require('puppeteer');

const docClient = new AWS.DynamoDB.DocumentClient();
const amazonURL = 'https://www.amazon.com.br/bestsellers';

module.exports.scrape = async event => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(amazonURL);
    await page.waitForSelector('.a-section.a-spacing-none.aok-relative');

    const products = await page.evaluate(() => {
      const productNodes = document.querySelectorAll('.a-section.a-spacing-none.aok-relative');
      let results = [];

      for (let i = 0; i < 3; i++) {
        const product = productNodes[i];
        const title = product.querySelector('.zg-text-center-align .p13n-sc-truncate').innerText;
        const price = product.querySelector('.p13n-sc-price') ? product.querySelector('.p13n-sc-price').innerText : 'Preço não disponível';
        results.push({ title, price });
      }
      return results;
    });

    console.log(products); // Imprime os produtos extraídos

    for (let product of products) {
      const params = {
        TableName: 'Products',
        Item: {
          id: `${product.title}-${Date.now()}`, 
          title: product.title,
          price: product.price
        }
      };

      await docClient.put(params).promise();
      console.log(`Produto salvo com sucesso: ${product.title}`);
    }

    await browser.close();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Scraping complete!' }),
    };
  } catch (error) {
    console.error('Erro durante o scraping ou salvando no DynamoDB:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
