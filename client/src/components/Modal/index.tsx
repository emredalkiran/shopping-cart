import React, { ReactNode, MouseEvent, TouchEvent } from 'react'

interface ModalProps {
  open: boolean
  close: () => void
  children: ReactNode
  withCloseButton: boolean
  title?: string
}

function Modal({ open, close, children, withCloseButton, title }: ModalProps) {
  const handleBackgroundClick = () => {
    close()
  }
  const handleCardClick = (e: MouseEvent | TouchEvent) => {
    e.stopPropagation()
  }
  return (
    <div className={`modal ${open ? 'is-active' : ''}`} onMouseDown={handleBackgroundClick}>
      <div className="modal-background"></div>
      <div className="modal-card auth-modal" onMouseDown={(e) => handleCardClick(e)}>
        <header className="modal-card-head">
          <p className="modal-card-title has-text-centered has-text-weight-semibold">{title}</p>
          <button className="delete" onClick={close} aria-label="close"></button>
        </header>
        <section className="modal-card-body">{children}</section>
        {withCloseButton && (
          <footer className="modal-card-foot is-flex is-justify-content-flex-end">
            <button className="button is-link" onClick={close}>
              Close
            </button>
          </footer>
        )}
      </div>
    </div>
  )
}
export default Modal
