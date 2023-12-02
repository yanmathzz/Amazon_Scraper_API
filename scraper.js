const puppeteer = require('puppeteer');
const AWS = require('aws-sdk');

// Configuração do AWS SDK (ajuste com suas credenciais e região conforme necessário)
AWS.config.update({
    region: 'us-east-2',
    // credenciais, se necessário
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();

async function getTopProducts() {
    let browser;
    try {
        browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto('https://www.amazon.com.br/bestsellers');

        const products = await page.evaluate(() =>
            Array.from(document.querySelectorAll('.product')).slice(0, 3).map(product => ({
                title: product.querySelector('.title').innerText,
                link: product.querySelector('.link').href,
            }))
        );

        // Inserir todos os produtos no DynamoDB de uma vez usando Promise.all
        await Promise.all(products.map(product => {
            const params = {
                TableName: 'Products',
                Item: product,
            };

            return dynamoDB.put(params).promise().then(() => {
                console.log(`Produto salvo com sucesso: ${product.title}`);
            });
        }));

        console.log('Scraping e salvamento no DynamoDB concluídos com sucesso!');
    } catch (error) {
        console.error('Erro durante o scraping ou salvamento no DynamoDB:', error);
    } finally {
        // Fechar o navegador mesmo que ocorra um erro
        if (browser) await browser.close();
    }
}

getTopProducts();
