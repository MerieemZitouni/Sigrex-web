import React from 'react'

const SingleCard = (props) => {
    
    const{title,totalNumber,icon,color}= props.item
  return (
    <div className="single_card" style={{backgroundColor:{color}}}>
    <div className="card_content">
      <span className='card_icon'><i class={icon}></i></span>
      <span className='card_number'>{totalNumber}</span>
      <h4>{title}</h4>
      
    </div>
    
   
  </div>
  )
}

export default SingleCard