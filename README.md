## META QUIZ 🔮

### Installation

```
> npm install
```
### Env
rename `.env.example` to `.env` and populate your API Key
Quiz API Key from https://quizapi.io/
```
QUIZ_API_KEY=xxxxx
```

### Start Server
```
> npm start

Meta Quiz Listening on 8006
```

### In New Terminal, Start Meta Quiz
```
> npm run meta-quiz

> meta-quiz@1.0.0 meta-quiz
> node quizApp.js


            ▒█▀▄▀█ █▀▀ ▀▀█▀▀ █▀▀█ 　 ▒█▀▀█ ▒█░▒█ ▀█▀ ▒█▀▀▀█ 　 
            ▒█▒█▒█ █▀▀ ░░█░░ █▄▄█ 　 ▒█░▒█ ▒█░▒█ ▒█░ ░▄▄▄▀▀ 　 
            ▒█░░▒█ ▀▀▀ ░░▀░░ ▀░░▀ 　 ░▀▀█▄ ░▀▄▄▀ ▄█▄ ▒█▄▄▄█ 　
        
? Enter your name › 
```

### Run Tests
```
> npm test
> meta-quiz@1.0.0 test
> ./node_modules/jest/bin/jest.js ./tests/

 PASS  tests/quiz.test.js
  POST /check-performance
    ✓ should increase difficulty level from Easy to Medium (24 ms)
    ✓ should decrease difficulty level from Hard to Medium (2 ms)
    ✓ should decrease difficulty level from Medium to Easy (1 ms)
    ✓ should increase difficulty level from Medium to Hard (1 ms)

Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
Snapshots:   0 total
Time:        0.297 s, estimated 1 s
```
