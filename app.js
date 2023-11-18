// Import necessary libraries
require('dotenv/config');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); // Added body-parser

const Question = require('./models/queston');







// Create Express app
const app = express();
const port = 3000;



// Use body-parser middleware
app.use(bodyParser.json());











app.get('/generate-question-paper', async (req, res) => {

    totalMarks = 50;
    distribution = {
        Easy: 20, // percent
        Medium: 60, 
        Hard: 20, 
    }
    // 10 marks, 30 marks, 10 marks


    try {
        // const { totalMarks, distribution } = req.body;


        if (!totalMarks || !distribution) {
            return res.status(400).json({ error: 'Bad Request. Please provide totalMarks and distribution in the request body.' });
        }

        const questionPaper = await generateQuestionPaper(totalMarks, distribution);
        res.json(questionPaper);

    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});








async function generateQuestionPaper(totalMarks, distribution) {
    
    const questionPaper = {
        questions: [],
        totalMarks,
    };


    
    for (const difficulty in distribution) {
        
        const marksForDifficulty = Math.floor(totalMarks * (distribution[difficulty]/100 ));

        console.log(difficulty, " marks : " , marksForDifficulty);
    
        const questions = await Question.aggregate([
            { $match: { difficulty, marks: { $lte: marksForDifficulty } } },
            { $sample: { size: 1 } }
        ]);
        
        questionPaper.questions = questionPaper.questions.concat(questions);
    }

    return questionPaper;
}








mongoose
    .connect(process.env.MONGO, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true 
    })
    .then( req => {
        console.log("Connected to mongodb");
        app.listen(port, ()=>{
            console.log(`Server is running at http://localhost:${port}`);
        })
    })
    .catch(err => {
        console.log(err);
    })
