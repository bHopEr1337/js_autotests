const fs = require('fs');

const generateHtmlReport = (testResults, testName, fileName) => {
    // Получаем текущую дату и время
    const now = new Date();
    const formattedDate = now.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    const formattedTime = now.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });

    const htmlContent = `
        <!DOCTYPE html>
        <html lang="ru">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Результаты теста ${testName}</title>
            <style>
                /* Основные стили */
                body {
                    font-family: 'Arial', sans-serif;
                    margin: 20px;
                    padding: 0;
                    background-color: #f8f9fa;
                    color: #333;
                }

                /* Контейнер */
                .container {
                    background: white;
                    padding: 2rem;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    max-width: 1200px;
                    margin: 0 auto;
                }

                /* Заголовок */
                h1 {
                    color: #2c3e50;
                    text-align: center;
                    margin-bottom: 1.5rem;
                    font-size: 2rem;
                    font-weight: 600;
                }

                /* Блок информации */
                .info-block {
                    background-color: #f1f3f5;
                    padding: 1rem;
                    border-radius: 6px;
                    margin-bottom: 1.5rem;
                    font-size: 0.9rem;
                    color: #495057;
                }

                .info-block p {
                    margin: 0.5rem 0;
                }

                /* Таблица */
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 1.5rem;
                    background-color: #fff;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                }

                th, td {
                    padding: 12px 15px;
                    text-align: left;
                    border-bottom: 1px solid #e9ecef;
                }

                th {
                    background-color: #4CAF50;
                    color: white;
                    font-weight: bold;
                }

                tr:hover {
                    background-color: #f8f9fa;
                }

                .status-pass {
                    color: #28a745;
                    font-weight: bold;
                }

                .status-fail {
                    color: #dc3545;
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>${testName}</h1>

                <!-- Блок информации -->
                <div class="info-block">
                    <p><strong>Дата формирования отчёта:</strong> ${formattedDate}</p>
                    <p><strong>Время формирования отчёта:</strong> ${formattedTime}</p>
                </div>

                <!-- Таблица -->
                <table>
                    <thead>
                        <tr>
                            <th>№</th>
                            <th>Название теста</th>
                            <th>Название проверки</th>
                            <th>Входные данные</th>
                            <th>Статус</th>         
                            <th>Доп. сведения</th>               
                        </tr>
                    </thead>
                    <tbody>
                        ${testResults.map((result, index) => `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${result.testName}</td>
                                <td>${result.checkName}</td>
                                <td>${result.inputData}</td>
                                <td class="status-${result.status === 'Успешно' ? 'pass' : 'fail'}">${result.status}</td>
                                <td>${result.additionalInfo || ''}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </body>
        </html>
    `;

    // Сохранение HTML-файла
    fs.writeFileSync(fileName, htmlContent);
};

module.exports = generateHtmlReport;