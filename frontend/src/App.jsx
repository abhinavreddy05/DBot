import React from 'react'

import Sidebar from './components/sidebar'
import Sqlbar from './components/sqlbar'

import botwrite from './assets/botwrite.svg'
import user from './assets/user.svg'

function App() {

  return (
    <div
      className="h-screen grid grid-cols-1 lg:grid-cols-[250px_1fr]"
    >
      <div>
        <Sidebar/>
      </div>
      <div
        className="grid grid-cols-1 transition-[grid-template-columns] lg:grid-cols-[1fr_400px] lg:[&:has(>*:last-child:hover)]:grid-cols-[1fr_550px] bg-gray-100"
      >
        <div className="m-4 relative">
          <div className='h-full flex flex-col gap-4'>
            <div className='p-4 w-11/12 ml-auto drop-shadow-sm'>
              <span className='flex align-middle gap-1 bg-white w-fit px-2 py-1 mb-1 rounded-full ml-auto' style={{alignItems: "center"}}>
                <img className='w-6' src={user} alt="" />
                <p className='text-sm font-semibold text-dark-blue'>User</p>
              </span>
              <div className='p-4 bg-light-blue rounded-lg'>
                <p className='text-sm text-gray-700'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam dapibus tortor nec enim mattis placerat. Donec nec erat iaculis, commodo nisl et, pharetra turpis. Duis vitae nisl at risus convallis laoreet id eget mauris.</p>
              </div>
            </div>
            <div className='bg-white p-4 rounded-lg w-11/12 mr-auto shadow-sm'>
              <div className='m-1'>
                <p className='text-sm text-gray-700'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam dapibus tortor nec enim mattis placerat. Donec nec erat iaculis, commodo nisl et, pharetra turpis. Duis vitae nisl at risus convallis laoreet id eget mauris. Mauris euismod tempus elementum. Nulla id suscipit libero. Praesent sit amet sapien erat. Nam nec metus porta, tincidunt arcu at, scelerisque leo. Morbi convallis vulputate risus, finibus interdum urna imperdiet vel.</p>
              </div>
              <span className='flex align-middle gap-1 bg-light-blue w-fit px-2 py-1 rounded-full mt-2' style={{alignItems: "center"}}>
                <img className='w-6' src={botwrite} alt="" />
                <p className='text-sm font-semibold text-dark-blue'>DBot</p>
              </span>
            </div>
          </div>
          <div className="absolute bottom-0 w-full">
            <label htmlFor="Search" className="sr-only"> Search </label>

            <input
              type="text"
              id="Search"
              placeholder="Message DBot"
              className="w-full h-14 rounded-full border-gray-200 pl-8 py-2.5 pe-12 shadow-sm sm:text-sm"
            />

            <span className="absolute inset-y-0 end-2 grid w-10 place-content-center">
              <button type="button" className="text-dark-blue hover:text-white bg-light-blue hover:bg-dark-blue rounded-full">
                <span className="sr-only">Search</span>

                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 32 32" class="icon-2xl"><path fill="currentColor" fill-rule="evenodd" d="M15.192 8.906a1.143 1.143 0 0 1 1.616 0l5.143 5.143a1.143 1.143 0 0 1-1.616 1.616l-3.192-3.192v9.813a1.143 1.143 0 0 1-2.286 0v-9.813l-3.192 3.192a1.143 1.143 0 1 1-1.616-1.616z" clip-rule="evenodd"></path></svg>
              </button>
            </span>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm m-4 ml-0">
          <Sqlbar/>
        </div>
      </div>
    </div>
  )
}

export default App
