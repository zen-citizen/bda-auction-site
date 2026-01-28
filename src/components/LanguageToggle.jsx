import { useTranslation } from 'react-i18next'

function LanguageToggle() {
  const { i18n } = useTranslation()

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng)
    localStorage.setItem('language', lng)
  }

  const currentLanguage = i18n.language || 'en'

  return (
    <div className="language-toggle" style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
      {/* Desktop: Toggle buttons */}
      <div className="hidden sm:flex" style={{ 
        gap: '0.125rem', 
        border: '1px solid rgba(75, 40, 64, 0.2)', 
        borderRadius: '6px', 
        overflow: 'hidden',
        flexShrink: 0
      }}>
        <button
          onClick={() => changeLanguage('en')}
          className={`lang-button lang-button-en ${currentLanguage === 'en' ? 'active' : ''}`}
          style={{
            padding: '0.375rem 0.75rem',
            border: 'none',
            background: currentLanguage === 'en' ? '#4B2840' : 'transparent',
            color: currentLanguage === 'en' ? 'white' : '#4B2840',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: currentLanguage === 'en' ? '600' : '400',
            transition: 'background-color 0.2s, color 0.2s',
            fontFamily: "'Public Sans', sans-serif",
            whiteSpace: 'nowrap',
            flexShrink: 0,
            lineHeight: '1.2'
          }}
        >
          English
        </button>
        <button
          onClick={() => changeLanguage('kn')}
          className={`lang-button lang-button-kn ${currentLanguage === 'kn' ? 'active' : ''}`}
          style={{
            padding: '0.375rem 0.75rem',
            border: 'none',
            background: currentLanguage === 'kn' ? '#4B2840' : 'transparent',
            color: currentLanguage === 'kn' ? 'white' : '#4B2840',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: currentLanguage === 'kn' ? '600' : '400',
            transition: 'background-color 0.2s, color 0.2s',
            fontFamily: "'Public Sans', 'Baloo Tamma 2', sans-serif",
            whiteSpace: 'nowrap',
            flexShrink: 0,
            lineHeight: '1.2'
          }}
        >
          ಕನ್ನಡ
        </button>
      </div>
      
      {/* Mobile: Single toggle button with shortened labels */}
      <div className="sm:hidden">
        <button
          onClick={() => changeLanguage(currentLanguage === 'en' ? 'kn' : 'en')}
          style={{
            padding: '0.375rem 0.75rem',
            border: '1px solid rgba(75, 40, 64, 0.2)',
            borderRadius: '6px',
            color: '#4B2840',
            backgroundColor: 'white',
            cursor: 'pointer',
            fontFamily: currentLanguage === 'en' ? "'Public Sans', sans-serif" : "'Public Sans', 'Baloo Tamma 2', sans-serif",
            fontWeight: '600',
            transition: 'all 0.2s',
            whiteSpace: 'nowrap',
            lineHeight: '1.2',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.875rem',
            minWidth: '40px'
          }}
        >
          {currentLanguage === 'en' ? 'En' : 'ಕ'}
        </button>
      </div>
    </div>
  )
}

export default LanguageToggle
