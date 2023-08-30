const Modal = ({ title, children }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h3>{title}</h3>
        {children}
      </div>
    </div>
  );
};

export default Modal;
