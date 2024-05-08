"use client";

import { useEffect, useState, ChangeEvent, FormEvent  } from "react";
import {motion, useMotionValue, useTransform, animate} from "framer-motion"
import Image from 'next/image';
import { API_URL, API_URL_local } from "@/config/constants";
import TypingAnimation from "./_components/text";

const analysisVariants = {
  hidden: { 
    opacity: 0,
    y: '100vh',
   },
  visible: {
     opacity: 1 ,
      y: 0,
      transition : {
        ease: "easeInOut",
        delay: 0.5,
        duration: 0.7,
      }

    },
   
}



const logoVariant = {
  hidden: { 
    opacity: 0,
    y: '-100vw',
   },
  visible: {
     opacity: 1 ,
      y: 0,
      transition : {
        ease: "easeInOut",
        delay: 0.5,
        duration: 1,
        when: "beforeChildren",
        staggerChildren: 0.4, // seconds
      }

    },
  
}



export default function Home() {
  const [textFile, setTextFile] = useState<File | null>(null);
  const [score, setScore] = useState<number>(0);
  const [resoning, setResoning] = useState<string>("");
  const [upload, setUpload] = useState("Upload");
  const [error, setError] = useState(""); 
  const [text, setText] = useState('');

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setTextFile(event.target.files[0]);
  }
};

const handleSubmit = async (event: FormEvent) => {
    setUpload("Uploading...");
    setError("")
  
    event.preventDefault();

    if (!textFile) {
        console.error('No file selected');
        return;
    }
    const formData = new FormData();
    formData.append('file', textFile);
    formData.append("jobDescription", text);

    try {
        const response = await fetch(`${API_URL_local}`, {
            //  const response = await fetch(`${API_URL}text_analysis_whisper/`, { 
            //for using the Whisper engine but it is too slow if you have less than 8 GB GPU
            // headers: {'content-type': 'multipart/form-data', 'boundary': '----WebKitFormBoundary7MA4YWxkTrZu0gW'},
            method: 'POST',
            body:  formData
        });
        const data = await response.json();
        console.log(data);
        
        setScore(data.score);
        setResoning(data.reasoning);
        
        setUpload("Uploaded");
    } catch (error) {
        setUpload("Upload");
        setError("Error uploading file. Supported formats are .txt, .pdf, .docx,  Please Try again.");
        console.error('Error uploading file:', error);
    }
};
  
  return (
    <div className="p-6 bg-[url('/Alindor-bg.jpg')] bg-no-repeat bg-cover w-full h-[100vh] " >
      {/* <Image src={"/Alindor-bg.png"} width={1000} quality={100} property={"true"} height={55} alt='service image' objectFit="cover"/> */}
      
      <motion.div className="flex gap-2 items-center"
        variants={logoVariant}
        initial="hidden"
        animate="visible"
      >
        <Image src="/Alindor.png" width="48" height="48" alt="logo" />
        <TypingAnimation text="Alindor resume qualification analysis" />
      </motion.div>

      <div className=" flex flex-col justify-center items-center h-[70vh]">


        
        <div
            >
          <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange} />
                
                


                <div className="flex flex-col my-3">
                  <label htmlFor="description">Job Description</label>
                  <textarea
                   onKeyPress={(e) => {
                    if (e.key === 'Enter') e.preventDefault();
                  }}
                    id="description"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter job description here"
                    style={{ width: '500px', height: '200px' }}
                  />
                </div>
                
          <button 
         
          type="submit" className="border border-green-600 p-2 bg-green-200 justify-end items-end"> {upload}</button>

          </form>
        </div>
        
        


    

        <span className="text-red-600">
          {error}
        </span>
       {upload === "Uploaded" && <motion.div className=" border border-gray-400 mt-4 p-2 flex flex-col justify-center items-center "
                variants={analysisVariants}
                initial="hidden"
                animate="visible"
              >
            <span className="my-2 text-2xl font-serif self-center">CV analysis</span>
            <div className="w-[80%] bg-gray-200 rounded-full h-2 ">
                <div className="h-full rounded-full bg-green-500 transition-all" style={{ width: `${score * 10}%` }} > </div>
             </div>
            <span className="my-2 text-lg font-serif self-center">Score: {score}</span>
            <span className="my-2 text-lg font-serif self-center">Reasoning: {resoning}</span>
        
        </motion.div>}


    </div>
    </div>
  );
}
