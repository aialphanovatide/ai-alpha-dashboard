import React from 'react'

const ErrorList = ({ errorMessages }) => {
  return (
    <div style={styles.errorMessagesContainer}>
      {errorMessages?.map((errorMessage, index) => (
        <div key={index}>
          {typeof errorMessage === 'string' ? (
            <span style={{textAlign: 'center', display: 'block'}}>{errorMessage}</span>
          ) : (
          <span><strong>{errorMessage.coinName || errorMessage.keyword }</strong>: {errorMessage.error}</span>
          )}
        </div>
      ))}
    </div>
  );
};

const styles = {
  errorMessagesContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
    textAlign: 'left',
    maxHeight: 120,
    overflowY: 'auto',
    fontSize: 'smaller',
  }
}

export default ErrorList