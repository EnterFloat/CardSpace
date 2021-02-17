import React from 'react'
import { CFooter } from '@coreui/react'

const TheFooter = () => {
  return (
    <CFooter fixed={false}>
      <div>
        {/* <a href="https://enterfloat.dk" target="_blank" rel="noopener noreferrer">CardSpace</a> */}
        <span>CardSpace</span>
        <span className="ml-1">&copy; 2021 <a href="https://enterfloat.dk" target="_blank" rel="noopener noreferrer">EnterFloat</a></span>
      </div>
      <div className="mfs-auto">
        <span className="mr-1">Study flash cards with spaced repetition</span>
        {/* <a href="https://coreui.io/react" target="_blank" rel="noopener noreferrer">CoreUI for React</a> */}
      </div>
    </CFooter>
  )
}

export default React.memo(TheFooter)
