import React from 'react'
import './Log.css'

const Log = () => {
  return (
    <div className="landing">
    <header className="landing-header">
      <h1>Whisper</h1>
      <p>Share your thoughts. Meet up with new friends. Catch up with old friends</p>
    </header>

    <section className="landing-preview">
      <div className="preview-card">
        <h3>✍️ Create</h3>
        <p>Create a new community and catch up with old friends.</p>
      </div>
      <div className="preview-card">
        <h3>🌍 Discover</h3>
        <p>Discover new friends.</p>
      </div>
      <div className="preview-card">
        <h3>💬 Connect</h3>
        <p>Engage with a growing community.</p>
      </div>
      <div className="preview-card">
        <h3>Please log in to continue.</h3>
      </div>
    </section>
  </div>

  )
}

export default Log