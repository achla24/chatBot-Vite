
import { useEffect, useRef, useState } from "react"
import ChatBotIcon from "./components/ChatBotIcon"
import ChatForm from "./components/ChatForm"
import ChatMessage from "./components/ChatMessage"



const App = () => {
  const [chatHistory , setChatHistory] = useState([])
  const [showChatbot , setshowChatbot] = useState(false)


  const chatBodyRef = useRef()

  const generateBotResponse = async (history) => {

    const updateHistory = (text) =>{
      setChatHistory(prev => [...prev.filter(msg => msg.text !== "thinking....."),{role:"model",text}])
    }

    history = history.map(({role,text})=>({role,parts:[{text}]}))
    
    const requestOptions={
      method : "POST",
      headers : { "Content-Type":"application/json"},
      body : JSON.stringify({ contents : history})
    }
    try{
      const response = await fetch(import.meta.env.VITE_API_URL, requestOptions)
      const data = await response.json()
      if(!response.ok) throw new Error(data.error.message || "something went wrong")
      console.log(data)
      const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g,"$1").trim()
      updateHistory(apiResponseText)
    }catch(error){
      console.log(error)
    }
  }

  //automatically scrolling when too many msgs
  useEffect(()=>{
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: "smooth",
      })
    }
  },[chatHistory])

  return (
    <div className={`container ${showChatbot ? "show-chatbot" : ""}`}>
      <button onClick={()=>setshowChatbot(prev=> !prev)} 
      id="chatbot-toggler">
        <span className="material-symbols-rounded">mode_comment</span>
        <span className="material-symbols.rounded">close</span>
      </button>
      <div className="chatbot-popup">
        <div className="chat-header">
          <div className="header-info">
            <ChatBotIcon />
            <h2 className="logo-text">ChatBot</h2>
          </div>
          <button className="material-symbols-rounded">keyboard_arrow_down</button>
        </div>



        <div ref={chatBodyRef} className="chat-body">
          <div className="message bot-message">
          <ChatBotIcon />
          <p className="message-text">
            Hey there <br /> How can i help you today?
          </p>
          </div>

          {chatHistory.map((chat, index) =>(
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>



        <div className="chat-footer">
          <ChatForm chatHistory={chatHistory} setChatHistory={setChatHistory} generateBotResponse={generateBotResponse} />       
        </div>

      </div>
    </div>
  )
}

export default App





























































// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App
