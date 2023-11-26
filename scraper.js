const puppeteer = require('puppeteer');
const AWS = require('aws-sdk');

const dynamoDB = new AWS.DynamoDB.DocumentClient();

async function getTopProducts() {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto('https://www.amazon.com.br/bestsellers');

        const products = await page.evaluate(() =>
            Array.from(document.querySelectorAll('.product')).slice(0, 3).map(product => ({
                title: product.querySelector('.title').innerText,
                link: product.querySelector('.link').href,
            }))
        );

        await browser.close();

        for (const product of products) {
            const params = {
                TableName: 'Products',
                Item: product,
            };

            await dynamoDB.put(params).promise();
            console.log(`Produto salvo com sucesso: ${product.title}`);
        }

        console.log('Scraping e salvamento no DynamoDB concluídos com sucesso!');
    } catch (error) {
        console.error('Erro durante o scraping ou salvamento no DynamoDB:', error);
    }
}

getTopProducts();
