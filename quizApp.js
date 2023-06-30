const prompts = require("prompts");
const axios = require("axios");
const chalk = require('chalk');
const ora = require('ora');

require('dotenv').config();

const PORT = process.env.PORT || 8006
const apiBase = `http://localhost:${PORT}`
console.log(apiBase)
const quizTotalQuestions = 15;
const evaluateThreshold = 3;

const startingDifficulty = 'Easy';

const startQuiz = async (user) =>{
  try {
    let username = {name: user};
    if(!username?.name.length){
        console.log(`
            ▒█▀▄▀█ █▀▀ ▀▀█▀▀ █▀▀█ 　 ▒█▀▀█ ▒█░▒█ ▀█▀ ▒█▀▀▀█ 　 
            ▒█▒█▒█ █▀▀ ░░█░░ █▄▄█ 　 ▒█░▒█ ▒█░▒█ ▒█░ ░▄▄▄▀▀ 　 
            ▒█░░▒█ ▀▀▀ ░░▀░░ ▀░░▀ 　 ░▀▀█▄ ░▀▄▄▀ ▄█▄ ▒█▄▄▄█ 　
        `)
        username = await prompts({
            type: 'text',
            name: 'name',
            message: 'Enter your name',
          });
    }
    const registrationResult = await axios.post(`${apiBase}/user`,{
        username: username?.name,
        startingDifficulty
    });
    if(registrationResult?.status === 201){
        //user registered successfully
        const {userObj} = registrationResult?.data;
        console.log(chalk.bgCyanBright.black.bold(`*** Greetings ${userObj?.username.toUpperCase()} ***`));
        console.log(chalk.bgYellow.black.bold(`Difficulty: | ${userObj?.currentDifficulty.toUpperCase()} |`));
        console.log(chalk.bgYellow.black.bold(`Total Questions: | ${quizTotalQuestions} |`));
        console.log("\n");

        const loadingQuiz = ora('Please Wait... Fetching Quiz Questions').start();
        let questionInfo = await getQuizQuestion(quizTotalQuestions, startingDifficulty);
        loadingQuiz.succeed("Let's Start... ⚡️")
        if(questionInfo.length && userObj?.id){
            let currentDifficulty = userObj?.currentDifficulty;
            const evaluateAfterCount = Math.floor(questionInfo.length / evaluateThreshold);
            let currentQuestionIdx = 0;
            const quizStartTime = new Date().getTime();
            let correctAnswerCount = 0;
            let questionCounter = 0;
            let questionsAttempted = [];
            const totalQuestions = questionInfo.length;
            let questionNum = 1;
            while (currentQuestionIdx < questionInfo.length) {
                const {question, answers, correct_answer, difficulty:diffi} = questionInfo[currentQuestionIdx];
                const choices = Object.keys(answers)
                    .filter((key) => answers[key] !== null)
                    .map((key) => {
                        const letter = key.split('_')[1] ?? ''
                        return {
                            title: `${letter.toUpperCase()}. ${answers[key]}`,
                            value: key,
                        }
                    });
                
                const responseTimeStart = new Date().getTime();
                // Prompt the user with the current question and choices
                const questionResult = await prompts({
                    type: 'select',
                    name: 'answer',
                    message: `${questionNum}.${question} ' HINT:${correct_answer} |'${diffi}'|`,
                    choices,
                });
                const responseTimeEnd = new Date().getTime();
                const responseTime = (responseTimeEnd - responseTimeStart) / 1000;

                const checkAnswer = await axios.post(`${apiBase}/check-answer`, {
                    questionBlock: questionInfo[currentQuestionIdx],
                    userAnswer: questionResult?.answer
                });

                let {result:correctAnswer} = checkAnswer?.data;
                questionsAttempted.push({
                    responseTime,
                    correctAnswer
                });
                let correctWrongIcon = '❌';
                if(correctAnswer){
                    correctWrongIcon = '✅';
                    correctAnswerCount++;
                }
                console.log(`${correctWrongIcon} - response time: ${responseTime} seconds`)
                questionCounter++;
                if(questionCounter % evaluateAfterCount === 0) {
                    //evaluate performance and get new difficulty
                    const newDifficultyData = await axios.post(`${apiBase}/check-performance`, {
                        currentDifficulty,
                        currentAttemptedQuestions: questionsAttempted
                    });
                    const {difficulty} = newDifficultyData?.data;
                    
                    questionsAttempted = [];
                    if(difficulty !== currentDifficulty){
                        currentDifficulty = difficulty;
                        // Replace remaining questions with new difficulty questions
                        const remainingQuestionCount = totalQuestions - questionNum;
                        if(remainingQuestionCount > 0){
                            const loadingNewQuizQuestions = ora('Adjusting Difficulty...').start();
                            let newQuestionInfo = questionInfo.slice(0, currentQuestionIdx + 1);
                            const newDifficultyQuestions = await getQuizQuestion(remainingQuestionCount, difficulty);
                            newQuestionInfo.splice(currentQuestionIdx + 1, newQuestionInfo.length, ...newDifficultyQuestions);
                            questionInfo = newQuestionInfo;
                            loadingNewQuizQuestions.succeed(chalk.bgYellow.black.bold(`New Difficulty: | ${difficulty} |`));
                        }                  
                    }
                    questionCounter = 0;
                }
                currentQuestionIdx++;
                questionNum++;
            }
            const quizEndTime = new Date().getTime();
            const quizCompletionTime = (quizEndTime - quizStartTime) / 1000;
            console.log("\n");
            console.log(chalk.bgGreenBright.black.bold(`*** RESULTS 🍾 ***`));
            console.log(chalk.bgYellow.black.bold(`Completion Time: | ${quizCompletionTime} Seconds |`));
            console.log(chalk.bgYellow.black.bold(`Total Correct Answers: | ${correctAnswerCount} |`));
            console.log(chalk.bgYellow.black.bold(`Total Questions: | ${quizTotalQuestions} |`));
            console.log("\n");
            const newQuizQ = await prompts({
                type: 'text',
                name: 'ans',
                message: 'Do you want to take a new quiz ?',
            });
            if(newQuizQ?.ans === 'yes'){
                startQuiz(userObj?.username);
            }
        }
    }
  } catch (error) {
    console.log(error.message);
  }
}


const getQuizQuestion = async (limit, difficulty='Easy') => {
    return new Promise((resolve, reject) => {
        axios.get(`${apiBase}/quiz`,{
            params: {
                limit,
                difficulty
            }
        }).then((response) => {
            let {questionInfo} = response?.data;
            resolve(questionInfo);
        }).catch((error) => {
            reject([]);
        })
    });
}

startQuiz(username='');
