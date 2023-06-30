function isAnswerCorrect(questionObject, userAnswer) {
  const correctAnswers = Object.keys(questionObject.correct_answers).filter(
    (key) => questionObject.correct_answers[key] === "true"
  );
  let ans1 = correctAnswers.includes(`${userAnswer}_correct`);
  let ans2 = questionObject?.correct_answer === userAnswer;
  return ans1 || ans2;
}

function evaluateUserPerformance(questions, currentDifficulty) {
  let correctAnswers = 0;
  let totalResponseTime = 0;

  for (const question of questions) {
    if (question.correctAnswer) {
      correctAnswers += 1;
    }
    totalResponseTime += question.responseTime;
  }

  const answerAccuracy = correctAnswers / questions.length

  // Calculate the average response time
  const averageResponseTime = totalResponseTime / questions.length;

  currentDifficulty = currentDifficulty.trim()
  if (averageResponseTime < 3) {
    if (answerAccuracy >= 0.9) {
      currentDifficulty = currentDifficulty === "Easy" ? "Medium" : "Hard";
    } else {
      currentDifficulty = currentDifficulty === "Hard" ? "Medium" : "Easy";
    }
  } else {
    if (answerAccuracy <= 0.5) {
      currentDifficulty = currentDifficulty === "Hard" ? "Medium" : "Easy";
    } else {
      currentDifficulty = currentDifficulty === "Easy" ? "Medium" : "Hard";
    }
  }
  //console.log(currentDifficulty)
  return currentDifficulty;
}

module.exports = {
  isAnswerCorrect,
  evaluateUserPerformance,
};
