function ErrorMessage({ message }) {
  return (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <h3>Terjadi Kesalahan</h3>
      <p>{message}</p>
    </div>
  );
}

export default ErrorMessage;
