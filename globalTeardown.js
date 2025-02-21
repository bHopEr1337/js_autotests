const { execSync } = require('child_process');
const path = require('path');

// Настройки для автоматического открытия отчёта после работы тестов

module.exports = async () => {
  const reportPath = path.resolve(__dirname, 'index.html');
  // Команда для открытия файла
  const fullCommand = `start "" "${reportPath}"`;
  try {
    execSync(fullCommand, { stdio: 'inherit' }); // Выполняем команду
  } catch (error) {
    console.error(`Ошибка при выполнении команды: ${error.message}`);
  }
};