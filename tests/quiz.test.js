const request = require("supertest");
const quizApp = require("../app");

const port = 8000;

describe("POST /check-performance", () => {
  let globalServer;

  beforeAll((done) => {
    if (globalServer) {
      globalServer.close();
    }
    globalServer = quizApp.listen(port);
    done();
  });

  afterAll((done) => {
    globalServer.close(done);
  });


  it('should increase difficulty level from Easy to Medium', async () => {
    const payload = {
      currentDifficulty: 'Easy',
      currentAttemptedQuestions: [
        { responseTime: 2.5, correctAnswer: true },
        { responseTime: 3.2, correctAnswer: true },
        { responseTime: 1.8, correctAnswer: true }
      ]
    };

    
    const response = await request(globalServer)
      .post('/check-performance')
      .send(payload)
      .expect(200);

    expect(response.body).toEqual({ difficulty: 'Medium' });
  });

  it('should decrease difficulty level from Hard to Medium', async () => {
    const payload = {
      currentDifficulty: 'Hard',
      currentAttemptedQuestions: [
        { responseTime: 4.7, correctAnswer: false },
        { responseTime: 5.3, correctAnswer: false }
      ]
    };

    const response = await request(globalServer)
      .post('/check-performance')
      .send(payload)
      .expect(200);

    expect(response.body).toEqual({ difficulty: 'Medium' });
  });

  it('should decrease difficulty level from Medium to Easy', async () => {
    const payload = {
      currentDifficulty: 'Medium',
      currentAttemptedQuestions: [
        { responseTime: 14.7, correctAnswer: false },
        { responseTime: 15.3, correctAnswer: false }
      ]
    };

    const response = await request(globalServer)
      .post('/check-performance')
      .send(payload)
      .expect(200);

    expect(response.body).toEqual({ difficulty: 'Easy' });
  });


  it('should increase difficulty level from Medium to Hard', async () => {
    const payload = {
      currentDifficulty: 'Medium',
      currentAttemptedQuestions: [
        { responseTime: 1, correctAnswer: true },
        { responseTime: 2, correctAnswer: true },
        { responseTime: 3, correctAnswer: true }
      ]
    };

    const response = await request(globalServer)
      .post('/check-performance')
      .send(payload)
      .expect(200);

    expect(response.body).toEqual({ difficulty: 'Hard' });
  });
});
