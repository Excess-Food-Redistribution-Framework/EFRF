import React, { useEffect } from 'react';
import Modal from 'react-modal';
import ProductCards from './ProductCards';

interface ProductListModalProps {
  showModal: boolean;
  closeModal: () => void;
  organization: any;
  page: number;
  pageSize: number;
  showDisabled: boolean;
}

const modalStyle: ReactModal.Styles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    minHeight: '300px',
    maxHeight: '100vh',
    width: '80%',
    maxWidth: '1300px',
    padding: '20px',
    background: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    overflow: 'auto',
  },
};

const ProductListModal: React.FC<ProductListModalProps> = ({
  showModal,
  closeModal,
  organization,
  page,
  pageSize,
  showDisabled,
}) => {
  useEffect(() => {
    Modal.setAppElement('#root');
  }, []);

  return (
    <Modal
      isOpen={showModal}
      onRequestClose={closeModal}
      style={modalStyle}
      contentLabel="Product List Modal"
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h2>{organization?.name}'s products</h2>
        <button
          onClick={closeModal}
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <span role="img" aria-label="close">
            ❌
          </span>
        </button>
      </div>
      <ProductCards
        params={{
          page,
          pageSize,
          notExpired: !showDisabled,
          organizationIds: organization?.id,
        }}
        isPagination
        isFilter
      />
    </Modal>
  );
};

export default ProductListModal;
