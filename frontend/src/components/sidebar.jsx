import React from 'react'

import logo from '../assets/logo.svg'
import botlove from '../assets/botlove.svg'

function Sidebar() {

  return (
    <div className="flex h-screen flex-col justify-between border-e bg-white">
        <div className="px-4 py-6">
            <span className="w-full text-center flex flex-col gap-2 mb-4">
                <img className='w-4/5 min-w-32 max-w-52 m-auto' src={logo} alt=""/>
                <h1 className='text-2xl font-bold text-black'>DBot</h1>
                <p className=' text-gray-500 text-sm'>Intelligent chatbot for database querying.</p>
            </span>

            <ul className="flex flex-col space-y-2">
                <li>
                    <strong className="block text-xs font-medium uppercase text-gray-400"> General </strong>

                    <ul className="mt-2 space-y-1">
                        <li>
                            <a
                                href="#"
                                className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                            >
                                Database
                            </a>
                        </li>

                        <li>
                            <a
                                href="#"
                                className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                            >
                                Documentation
                            </a>
                        </li>
                    </ul>
                </li>

                <li>
                    <strong className="block text-xs font-medium uppercase text-gray-400"> Previous Conversations </strong>

                    <ul className="mt-2 space-y-1">
                        <li className='group'>
                        <a
                            href="#"
                            className="flex align-middle justify-between rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                        >
                            Conversation 1
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="gray"
                                className='h-4 w-4 hidden group-hover:block'
                            >
                                <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                />
                            </svg>
                        </a>
                        </li>

                        <li className='group'>
                        <a
                            href="#"
                            className="flex align-middle justify-between rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                        >
                            Conversation 2
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="gray"
                                className='h-4 w-4 hidden group-hover:block'
                            >
                                <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                />
                            </svg>
                        </a>
                        </li>

                        <li className='group'>
                        <a
                            href="#"
                            className="flex align-middle justify-between rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                        >
                            Conversation 3
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="gray"
                                className='h-4 w-4 hidden group-hover:block'
                            >
                                <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                />
                            </svg>
                        </a>
                        </li>
                    </ul>
                </li>

            </ul>
        </div>

        <div className="sticky inset-x-0 bottom-0 border-t border-gray-100">
            <a href="https://github.com/abhinavreddy05/db-bot" target='_blank' className="flex items-center gap-2 bg-white p-4 hover:bg-gray-50">
                <img
                    alt=""
                    src={botlove}
                    className="size-16 rounded-full object-cover"
                />
                <div>
                    <p className="text-xs flex flex-col gap-1">
                        <strong className="block font-medium">Built by Abhinav Reddy</strong>
                        <span className=' underline'>Link to Github</span>
                    </p>
                </div>
            </a>
        </div>
    </div>
  )
}

export default Sidebar
