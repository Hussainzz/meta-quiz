const quizApp = require('./app');

const PORT = process.env.PORT || 8006
quizApp.listen(PORT, () => {
    console.log(`Meta Quiz Listening on ${PORT}`);
})