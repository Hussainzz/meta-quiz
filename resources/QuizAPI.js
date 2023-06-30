const axios = require("axios");

class QuizAPI {
    quizBaseUrl = 'https://quizapi.io'

    async getQuiz(limit = 10, difficulty=null){
        const options = {
            limit,
            difficulty
        }
        try {
            const quizInfo = await axios.get(`${this.quizBaseUrl}/api/v1/questions`,{
                headers:{
                    'X-Api-Key': process.env.QUIZ_API_KEY
                },
                params: options
            });
            return quizInfo?.data;
        } catch (error) {
            console.log(error?.message);
        }
        return null
    }
}

module.exports = new QuizAPI();