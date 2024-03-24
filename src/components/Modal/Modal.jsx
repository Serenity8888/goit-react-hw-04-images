import Modal from 'react-modal';
import css from './Modal.module.css';
import PropTypes from 'prop-types';

Modal.setAppElement('#root');

const ImageModal = ({ modalClose, isModalOpen, image }) => {
  return (
    <Modal
      onRequestClose={modalClose}
      isOpen={isModalOpen}
      contentLabel="Image Modal"
      className={css.overlay}
    >
      <div className={css.modal}>
        <img src={image} alt="" />
      </div>
    </Modal>
  );
};

ImageModal.propTypes = {
  modalClose: PropTypes.func.isRequired,
  isModalOpen: PropTypes.bool.isRequired,
  image: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};
export default ImageModal;