Инструкция по установке и эксплуатации.


1. Распаковать архив с проектом, открыть его в любой IDE с поддержкой js.
2. В корне проекта выполнить следующие команды:
    cd js-autotest
    npm install playwright
    npx playwright install
3. Запустить тесты командой:
    npx playwright test

После выполнения всех тестов в браузере автоматически откроется отчёт index.html.
index.html содержит ссылки на отчёты по каждому из тестов.


Окружение, которое использовалось при разработке проекта:
node version: v20.18.1;
playwright version: 1.50.1;
OS: windows 10 x64;
IDE: Visual Studio Code, version 1.97.2.
