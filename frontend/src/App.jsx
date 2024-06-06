import React from 'react'
import { useState, useRef, useEffect } from 'react'
import Sidebar from './components/sidebar'
import Sqlbar from './components/sqlbar'
import axios from 'axios';
import { marked } from 'marked'

import botwrite from './assets/botwrite.svg'
import user from './assets/user.svg'

function App() {

  const [messages, setMessages] = useState([])
  const [sqlQuery, setSqlQuery] = useState('')
  const [userInput, setUserInput] = useState('')
  const [loading, setLoading] = useState(false)

  const inputRef = useRef(null)
  const scrollRef = useRef(null)

  const sendMessage = async () => {
    setLoading(true)
    setMessages([...messages, { role: 'user', message: userInput }])
    console.log(userInput)
    setUserInput('')
    inputRef.current.value = ''

    try {
      const response = await axios.get('https://dbot.ploomberapp.io/chat', {
        params: {
          message: userInput
        }
      });

      console.log(response.data)

      setMessages(prevMessages => [...prevMessages, { role: 'bot', message: response.data.message }]);
      setSqlQuery(response.data.sql.query);
      setLoading(false)
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }

  useEffect(() => {
    scrollRef.current?.lastElementChild?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages])

  return (
    <div
      className="h-screen grid grid-cols-1 lg:grid-cols-[250px_1fr]"
    >
      <div className='hidden lg:flex'>
        <Sidebar/>
      </div>
      <div
        className="grid grid-cols-1 transition-[grid-template-columns] lg:grid-cols-[1fr_400px] lg:[&:has(>*:last-child:hover)]:grid-cols-[1fr_460px] bg-gray-100"
      >
        <div className="m-4 relative">
          <div className='h-[80svh] lg:h-[90svh] flex flex-col gap-2 overflow-scroll pb-8' ref={scrollRef}>
            {messages.map((message, index) => {
              if (message.role === 'bot') {
                message.message = marked.parse(message.message)
                return (
                  <div key={index} className='p-4 min-w-[60%] w-fit max-w-[80%] mr-auto drop-shadow-sm'>
                    <span className='flex align-middle gap-1 bg-white w-fit px-2 py-1 rounded-full mb-1' style={{alignItems: "center"}}>
                      <img className='w-6 drop-shadow-lg' src={botwrite} alt="" />
                      <p className='text-sm font-semibold text-dark-blue'>DBot</p>
                    </span>
                    <div className='p-4 bg-white rounded-lg'>
                      <div className='chatbot-text text-base text-gray-800' dangerouslySetInnerHTML={{ __html: message.message }} />
                    </div>
                  </div>
                );
              } else {
                return (
                  <div key={index} className='p-4 min-w-[60%] w-fit max-w-[80%] ml-auto drop-shadow-sm'>
                    <span className='flex align-middle gap-1 bg-light-blue w-fit px-2 py-1 mb-1 rounded-full ml-auto' style={{alignItems: "center"}}>
                      <img className='w-6 drop-shadow-lg' src={user} alt="" />
                      <p className='text-sm font-semibold text-dark-blue'>User</p>
                    </span>
                    <div className='p-4 bg-light-blue rounded-lg'>
                      <p className='text-base text-gray-800'>{message.message}</p>
                    </div>
                  </div>
                );
              }
            })}
          </div>
          <div className="absolute bottom-0 w-full">
              <label htmlFor="Search" className="sr-only"> Search </label>

              {loading ? (
                <input
                  ref={inputRef}
                  type="text"
                  id="Search"
                  disabled={loading}
                  placeholder="Loading...Please wait!"
                  onChange={(e) => setUserInput(e.target.value)}
                  className="w-full h-14 rounded-full border-gray-200 pl-8 py-2.5 pe-12 shadow-sm sm:text-sm"
                />
              ) : (
                <input
                  ref={inputRef}
                  type="text"
                  id="Search"
                  disabled={loading}
                  placeholder="Message DBot"
                  onChange={(e) => setUserInput(e.target.value)}
                  className="w-full h-14 rounded-full border-gray-200 pl-8 py-2.5 pe-12 shadow-sm sm:text-sm"
                />
              )}

              <span className="absolute inset-y-0 end-2 grid w-10 place-content-center">
                <button onClick={sendMessage} type="submit" className="text-dark-blue hover:text-white bg-light-blue hover:bg-dark-blue rounded-full">
                  <span className="sr-only">Search</span>

                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 32 32" class="icon-2xl"><path fill="currentColor" fill-rule="evenodd" d="M15.192 8.906a1.143 1.143 0 0 1 1.616 0l5.143 5.143a1.143 1.143 0 0 1-1.616 1.616l-3.192-3.192v9.813a1.143 1.143 0 0 1-2.286 0v-9.813l-3.192 3.192a1.143 1.143 0 1 1-1.616-1.616z" clip-rule="evenodd"></path></svg>
                </button>
              </span>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm m-auto">
          <Sqlbar query={sqlQuery}/>
        </div>
      </div>
    </div>
  )
}

export default App
