import React from 'react'
import { CFooter } from '@coreui/react'

const TheFooter = () => {
  return (
    <CFooter fixed={false}>
      <div>
        <a href="https://coreui.io" target="_blank" rel="noopener noreferrer">CardSpace</a>
        <span className="ml-1">&copy; 2020 EnterFloat</span>
      </div>
      <div className="mfs-auto">
        <span className="mr-1">Study flash cards with spaced repetition</span>
        {/* <a href="https://coreui.io/react" target="_blank" rel="noopener noreferrer">CoreUI for React</a> */}
      </div>
    </CFooter>
  )
}

export default React.memo(TheFooter)
