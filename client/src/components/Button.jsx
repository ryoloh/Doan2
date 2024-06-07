import React from 'react'

export default function Button(props) {
    return (
        <button className='bg-violet-600 text-white py-2 px-6 rounded md:ml-8 ml-5 hover:bg-violet-400 duration-500'>
            {props.children}
        </button>
    )
}
