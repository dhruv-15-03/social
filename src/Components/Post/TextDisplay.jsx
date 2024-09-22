import React from 'react'

const TextDisplay = ({item}) => {
    const styles = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50vh',
        backgroundColor: 'black',
        color: 'white',
        fontSize: '1.8rem',
        fontWeight: 'bold',
      };
  return (
    <div style={styles}>{item}</div>
  )
}

export default TextDisplay