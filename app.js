const express = require('express');
const QuizAPI = require('./resources/QuizAPI');
const { isAnswerCorrect, evaluateUserPerformance } = require('./resources/QuizController');
const app = express();

require('dotenv').config();

app.use(express.json());

app.post('/user', async (req, res) => {
    const {username, startingDifficulty} = req.body;
    if(!username) {
        return res.status(400).json({
            status: 'error',
            message: 'Bad request'
        });
    }
    let userObj = null;
    if(!userObj) {
        userObj = {
            id: Date.now(),
            username,
            currentDifficulty: startingDifficulty
        }
    }
    res.status(201).json({
        userObj
    })
});

app.post('/check-answer', async(req, res, next) => {
    const {
        questionBlock,
        userAnswer
    } = req.body;

    const isCorrect = isAnswerCorrect(questionBlock, userAnswer);

    res.status(200).json({
        result: isCorrect
    })
});

app.post('/check-performance', async(req, res, next) => {
    const {
        currentDifficulty,
        currentAttemptedQuestions
    } = req.body;
    const calculatedDifficulty = evaluateUserPerformance(currentAttemptedQuestions, currentDifficulty);
   
    res.status(200).json({
        difficulty: calculatedDifficulty
    })
});

app.get('/quiz', async(req, res, next) => {
    const {limit, difficulty} = req.query;
    let quizQuestion = null;
    try {
        const data = await QuizAPI.getQuiz(limit, difficulty);
        quizQuestion = data ?? null;
    } catch (error) {
        
    }
    res.status(200).json({
        userMeta: null,
        questionInfo: quizQuestion
    })
});

app.get('/', async(req, res) => {
    res.status(200).json({
        status: 'HEALTHY...'
    })
});

module.exports = app;

