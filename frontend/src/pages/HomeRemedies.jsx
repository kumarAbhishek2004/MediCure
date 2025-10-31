import { useState } from 'react'
import { Search, Leaf, Loader2, Database, Sparkles, AlertCircle } from 'lucide-react'

const HomeRemedies = () => {
  const [disease, setDisease] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const API_URL = 'http://localhost:8000'

  const handleSearch = async () => {
    if (!disease.trim()) {
      setError('Please enter a disease or condition')
      return
    }

    setLoading(true)
    setResult(null)
    setError(null)
    
    try {
      console.log('Searching for:', disease)
      
      const response = await fetch(`${API_URL}/api/remedies/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          disease: disease.trim()
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || `HTTP ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Response:', data)
      setResult(data)
      
    } catch (err) {
      console.error('Error details:', err)
      
      if (err.message.includes('Failed to fetch')) {
        setError('Cannot connect to backend. Make sure the API is running on http://localhost:8000')
      } else {
        setError(`Error: ${err.message}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const testConnection = async () => {
    try {
      const response = await fetch(`${API_URL}/api/health`)
      const data = await response.json()
      console.log('Backend health:', data)
      alert(`✅ Backend is running!\n\nModels loaded: ${data.models_loaded}\nRemedies in database: ${data.remedy_count}`)
    } catch (err) {
      alert('❌ Cannot connect to backend. Make sure it is running on http://localhost:8000')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center">
            <Leaf className="mr-3 text-green-600" size={40} />
            Home Remedies
          </h1>
          <p className="text-gray-600 mb-6">
            Discover traditional and natural remedies for common health conditions
          </p>

          <div className="flex gap-4 mb-6">
            <input
              type="text"
              value={disease}
              onChange={(e) => {
                setDisease(e.target.value)
                setError(null)
              }}
              placeholder="Enter a disease or condition (e.g., cold, headache, fever)..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              disabled={!disease.trim() || loading}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <Loader2 className="animate-spin mr-2" size={20} />
              ) : (
                <Search className="mr-2" size={20} />
              )}
              Search
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded flex items-start">
              <AlertCircle className="text-red-500 mr-3 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">Popular searches:</span>
            {['cold', 'fever', 'headache', 'cough', 'acidity', 'diabetes', 'asthma'].map((term) => (
              <button
                key={term}
                onClick={() => {
                  setDisease(term)
                  setError(null)
                }}
                className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm hover:bg-green-200 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Loader2 className="animate-spin h-12 w-12 text-green-500 mx-auto mb-4" />
            <p className="text-gray-600">Searching for remedies...</p>
          </div>
        )}

        {result && !loading && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Remedies for <span className="text-green-600 capitalize">{result.disease}</span>
              </h2>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                result.source === 'database' ? 'bg-blue-100' : 'bg-purple-100'
              }`}>
                {result.source === 'database' ? (
                  <>
                    <Database className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">From Database</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    <span className="text-sm font-medium text-purple-700">AI Generated</span>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {result.remedies && result.remedies.length > 0 ? (
                result.remedies.map((item, index) => (
                  <div 
                    key={index} 
                    className={`border-l-4 p-5 rounded-lg transition-all hover:shadow-md ${
                      result.source === 'database' 
                        ? 'bg-green-50 border-green-500' 
                        : 'bg-purple-50 border-purple-500'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                        result.source === 'database' ? 'bg-green-500' : 'bg-purple-500'
                      }`}>
                        {index + 1}
                      </div>
                      
                      <div className="flex-1">
                        <p className="text-gray-800 leading-relaxed">{item.remedy}</p>
                        
                        {item.yoga_link && (
                          <div className="mt-3">
                            <a
                              href={item.yoga_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-green-600 hover:text-green-800 font-medium text-sm transition-colors"
                            >
                              <span>🧘 View Recommended Yoga Poses</span>
                              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No remedies found. Try a different search term.
                </div>
              )}
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Total Remedies:</strong> {result.total_count} | 
                <strong className="ml-2">Source:</strong> {result.source === 'database' ? 'Traditional Database' : 'AI Generated based on traditional medicine principles'}
              </p>
            </div>

            {result.source === 'ai_generated' && (
              <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
                <p className="text-sm text-yellow-800">
                  ⚠️ <strong>Note:</strong> These remedies are AI-generated based on traditional medicine practices. 
                  Always consult with a healthcare professional before trying new remedies, especially if you have existing health conditions.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-2">⚕️ Medical Disclaimer</h3>
          <p className="text-sm text-gray-600">
            These home remedies are for informational purposes only and should not replace professional medical advice, 
            diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with 
            any questions you may have regarding a medical condition.
          </p>
        </div>
      </div>
    </div>
  )
}

export default HomeRemedies