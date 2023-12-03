# 🚀 Amazon Scraper API

## 📌 Índice
- Descrição
- Estrutura do Projeto
- Funcionalidades
- Como Executar
- Melhorias e Funcionalidades Extras
- Erros Conhecidos

## 🌟 Descrição
Este projeto é um web scraper que extrai informações dos produtos mais vendidos da Amazon e os armazena em um banco de dados DynamoDB. Utiliza Node.js, Puppeteer para scraping, e AWS Lambda para a lógica de backend.

## 📁 Estrutura do Projeto

| Arquivo/Diretório  | Descrição |
|------------|------------|
| 'handler.js'  | Função Lambda para scraping e armazenamento de dados. | 
| 'scraper.js'  | Lógica de scraping usando Puppeteer.  |
| 'serverless.yml'  | Configuração do Serverless para deploy no AWS.  |
| 'package.json'  | Dependências do Node.js.  |

## ✨ Funcionalidades
- Scraping dos produtos mais vendidos na Amazon.

- Armazenamento dos dados em DynamoDB.

- Automatização via AWS Lambda.

## 🚀 Como Executar

Copy code

Instale as dependências

npm install

Configure suas credenciais da AWS no arquivo de configuração

Deploy usando Serverless
serverless deploy

## 🌱 Melhorias e Funcionalidades Extras
- Adicionar rotinas de atualização automática.
- Implementar mais endpoints na API para diferentes consultas.
- Melhorar a gestão de erros e logs.

## 🔍 Erros Conhecidos
- Endpoints com Erro: Ao acessar os endpoints /dev/scrape e /dev/products, é retornado {"message": "Internal server error"}.
Alarmes no AWS CloudWatch:
- TargetTracking-table/Amazon-scraper-AlarmLow-a1b7c807: ConsumedReadCapacityUnits < 30.
- TargetTracking-table/Amazon-scraper-AlarmLow-b69ab9a7-eef1-4a02-803b-4f58806d5be2: ConsumedWriteCapacityUnits < 30.
- Esses problemas sugerem necessidade de revisão na configuração da AWS e na lógica de backend.
