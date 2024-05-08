// var _ = require('lodash')
// var Parser = require('pdf3json')
const pdfParse = require('pdf-parse');
const OpenAI = require("openai");

// const { Configuration, OpenAIApi } = require('openai');
const dotenv = require('dotenv');
dotenv.config()



// const config = new Configuration({
// 	apiKey: process.env.OPENAI_KEY,
// })

// const openai = new OpenAIApi(config)


const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY }) ;


module.exports.cv_grader =  async (req, res)=>{
    // const {file, jobDescription} = req.body; 
    const file = req.file;
    const jobDescription = req.body.jobDescription;

 
    try{
        const dataBuffer = req.file.buffer; // Access the buffer directly from the file object

        const data = await pdfParse(dataBuffer);
        const extractedText = data.text; // Text extracted from the PDF

        // const response = await openai.createCompletion({
        //     model: 'text-davinci-003',
        //     prompt: `You will be evaluating a candidate's Curriculum Vitae (CV) for a specific job opening.  Here are the details:

        //     Job Description: """ ${jobDescription} """
        //     CV Text: """ ${extractedText} """
        //     My evaluation should consider the following factors:
            
        //     Skills and experience match: How well do the skills and experience listed in the CV align with the requirements of the job description? (Weight: 60%)
        //     Keywords: How many relevant keywords from the job description are present in the CV? (Weight: 20%)
        //     Quantifiable achievements: Does the CV showcase quantifiable achievements that demonstrate the candidate's impact in previous roles? (Weight: 10%)
        //     Clarity and conciseness: Is the CV well-structured, easy to read, and free of grammatical errors? (Weight: 10%)
        //     Please provide a score between 1 and 10 for this candidate's fit for the position, along with a brief explanation of your reasoning. Focus on identifying both strengths and weaknesses in the CV compared to the job description. 
            
        //     `,
        // })
        
        // const result = response.data.choices[0].text;
        // console.log(result)

        const completion = await openai.chat.completions.create({
            messages: [
              {
                role: "system",
                content: `You will be evaluating a candidate's Curriculum Vitae (CV) for a specific job opening.  

                Your evaluation should consider the following factors:
                
                Skills and experience match: How well do the skills and experience listed in the CV align with the requirements of the job description? (Weight: 60%)
                Keywords: How many relevant keywords from the job description are present in the CV? (Weight: 20%)
                Quantifiable achievements: Does the CV showcase quantifiable achievements that demonstrate the candidate's impact in previous roles? (Weight: 10%)
                Clarity and conciseness: Is the CV well-structured, easy to read, and free of grammatical errors? (Weight: 10%)
                Please provide a score between 1 and 10 for this candidate's fit for the position, along with a brief explanation of your reasoning. Focus on identifying 
                both strengths and weaknesses in the CV compared to the job description. 
                The output should be in json format with two keys - 'score' and 'reasoning'. 
                
                `,
              },

              // How ever if the text file is not a cv or the job description is not clear the output score should be zero and the reasoning should be 'Invalid CV or Job Description'
              { role: "user", content: ` Job Description: """ ${jobDescription} """
                                         CV Text: """ ${extractedText} """` },
            ],
            model: "gpt-3.5-turbo-0125",
            response_format: { type: "json_object" },
          });

          console.log(completion.choices[0].message.content);
          const jsonData = JSON.parse(completion.choices[0].message.content);
          console.log(jsonData.score)


        res.status(200).json({score: jsonData.score, reasoning: jsonData.reasoning})

    }catch(err){
        console.log(err)
        res.status(400).json({err})
        
    }
}

