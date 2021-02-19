import { ReactNode, MouseEvent } from 'react'

interface ModalProps {
  open: boolean
  close: () => void
  children: ReactNode
  withCloseButton: boolean
}

function Modal({ open, close, children, withCloseButton }: ModalProps) {
  const handleBackgroundClick = () => {
    close()
  }
  const handleCardClick = (e: MouseEvent) => {
    e.stopPropagation()
  }
  return (
    <div
      className={`modal ${open ? 'is-active' : ''}`}
      onMouseDown={handleBackgroundClick}
    >
      <div className='modal-background'></div>
      <div
        className='modal-card auth-modal'
        onMouseDown={(e) => handleCardClick(e)}
      >
        <header className='modal-card-head'>
          <p className='modal-card-title has-text-centered has-text-weight-semibold'></p>
          <button
            className='delete'
            onClick={close}
            aria-label='close'
          ></button>
        </header>
        <section className='modal-card-body'>{children}</section>
        {withCloseButton && (
          <footer className='modal-card-foot is-flex is-justify-content-end'>
            <button className='button is-primary' onClick={close}>
              Close
            </button>
          </footer>
        )}
      </div>
    </div>
  )
}
export default Modal
