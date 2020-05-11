import React from 'react'
import ReactDOM from 'react-dom'
import styles from './BaseModal.less'

const { body } = document

function BaseModal(props: { children: React.ReactNode }) {
  return ReactDOM.createPortal(
    <div className={styles.container}>
      <div className={styles.box}>{props.children}</div>
    </div>,
    body
  )
}

export default BaseModal
