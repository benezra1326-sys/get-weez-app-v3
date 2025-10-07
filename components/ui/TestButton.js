import React from 'react'

export default function TestButton() {
  console.log('🔍 TestButton - RENDU')
  
  return (
    <div
      style={{
        position: 'fixed',
        top: '10px',
        left: '10px',
        zIndex: 999999,
        width: '100px',
        height: '50px',
        background: 'red',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px'
      }}
    >
      TEST
    </div>
  )
}


