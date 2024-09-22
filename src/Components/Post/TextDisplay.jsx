import React from 'react'

const TextDisplay = ({item}) => {
  let baseFontSize = 1.8;
  if(item.length<10)
    baseFontSize=1.8; 
  else if(item.length<20){
    baseFontSize=1.5;
  }
  else if(item.length<30)
    baseFontSize=1.25;
  else if(item.length<40)
    baseFontSize=1.10;
  else if(item.length<50)
    baseFontSize=1.00;
  else if(item.length<60)
    baseFontSize=0.9;
  else if(item.length<70)
    baseFontSize=0.8;
  else
  baseFontSize=0.7;
    const styles = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50vh',
        backgroundColor: 'black',
        color: 'white',
        fontSize:  `${baseFontSize}rem`,
        fontWeight: 'bold',
      };
  return (
    <div style={styles}>{item}</div>
  )
}

export default TextDisplay