// reportGenerator.js
const fs = require('fs');

const generateHtmlReport = (testResults, testName, fileName) => {
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="ru">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Результаты теста ${testName}</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 20px;
                    padding: 0;
                    background-color: #f4f4f4;
                }
                h1 {
                    color: #333;
                    text-align: center;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                    background-color: #fff;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                th, td {
                    padding: 12px 15px;
                    text-align: left;
                    border-bottom: 1px solid #ddd;
                }
                th {
                    background-color: #4CAF50;
                    color: white;
                    font-weight: bold;
                }
                tr:hover {
                    background-color: #f5f5f5;
                }
                .status-pass {
                    color: green;
                    font-weight: bold;
                }
                .status-fail {
                    color: red;
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <h1>${testName}</h1>
            <table>
                <thead>
                    <tr>
                        <th>Название теста</th>
                        <th>Название проверки</th>
                        <th>Входные данные</th>
                        <th>Статус</th>         
                        <th>Доп. сведения</th>               
                    </tr>
                </thead>
                <tbody>
                    ${testResults.map(result => `
                        <tr>
                            <td>${result.testName}</td>
                            <td>${result.checkName}</td>
                            <td>${result.inputData}</td>
                            <td class="status-${result.status === 'Успешно' ? 'pass' : 'fail'}">${result.status}</td>
                            <td>${result.additionalInfo || ''}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </body>
        </html>
    `;

    // Сохранение HTML-файла
    fs.writeFileSync(fileName, htmlContent);
};

module.exports = generateHtmlReport;