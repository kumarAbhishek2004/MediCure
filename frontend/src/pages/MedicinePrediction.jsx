import { useState } from 'react'
import axios from 'axios'
import { Search, Pill, AlertTriangle, RefreshCw, Loader2 } from 'lucide-react'

const MedicinePrediction = () => {
  const [medicineName, setMedicineName] = useState('')
  const [usage, setUsage] = useState(null)
  const [sideEffects, setSideEffects] = useState(null)
  const [substitutes, setSubstitutes] = useState(null)
  const [loading, setLoading] = useState({ usage: false, sideEffects: false, substitutes: false })

  const handlePredictUsage = async () => {
    if (!medicineName.trim()) return
    
    setLoading({ ...loading, usage: true })
    try {
      const response = await axios.post('https://abhishek2607-medicure-backend.hf.space/api/medicine/usage', {
        medicine_name: medicineName
      })
      setUsage(response.data.usage)
    } catch (error) {
      console.error('Error predicting usage:', error)
      alert('Error predicting medicine usage. Please try again.')
    }
    setLoading({ ...loading, usage: false })
  }

  const handlePredictSideEffects = async () => {
    if (!medicineName.trim()) return
    
    setLoading({ ...loading, sideEffects: true })
    try {
      const response = await axios.post('https://abhishek2607-medicure-backend.hf.space/api/medicine/side-effects', {
        medicine_name: medicineName
      })
      setSideEffects(response.data.side_effects)
    } catch (error) {
      console.error('Error predicting side effects:', error)
      alert('Error predicting side effects. Please try again.')
    }
    setLoading({ ...loading, sideEffects: false })
  }

  const handlePredictSubstitutes = async () => {
    if (!medicineName.trim()) return
    
    setLoading({ ...loading, substitutes: true })
    try {
      const response = await axios.post('https://abhishek2607-medicure-backend.hf.space/api/medicine/substitutes', {
        medicine_name: medicineName
      })
      setSubstitutes(response.data.substitutes)
    } catch (error) {
      console.error('Error predicting substitutes:', error)
      alert('Error predicting substitutes. Please try again.')
    }
    setLoading({ ...loading, substitutes: false })
  }

  const handleClearResults = () => {
    setUsage(null)
    setSideEffects(null)
    setSubstitutes(null)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center">
          <Pill className="mr-3 text-indigo-600" />
          Medicine Prediction
        </h1>
        <p className="text-gray-600 mb-6">
          Enter a medicine name to get AI-powered predictions about its usage, side effects, and substitutes
        </p>

        <div className="flex gap-4 mb-6">
          <input
            type="text"
            value={medicineName}
            onChange={(e) => setMedicineName(e.target.value)}
            placeholder="Enter medicine name (e.g., Paracetamol, Aspirin)..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            onKeyPress={(e) => e.key === 'Enter' && handlePredictUsage()}
          />
          {(usage || sideEffects || substitutes) && (
            <button
              onClick={handleClearResults}
              className="px-4 py-3 text-gray-600 hover:text-gray-800 font-medium"
            >
              Clear
            </button>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <button
            onClick={handlePredictUsage}
            disabled={!medicineName.trim() || loading.usage}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading.usage ? (
              <Loader2 className="animate-spin mr-2" />
            ) : (
              <Search className="mr-2" />
            )}
            Predict Usage
          </button>

          <button
            onClick={handlePredictSideEffects}
            disabled={!medicineName.trim() || loading.sideEffects}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading.sideEffects ? (
              <Loader2 className="animate-spin mr-2" />
            ) : (
              <AlertTriangle className="mr-2" />
            )}
            Side Effects
          </button>

          <button
            onClick={handlePredictSubstitutes}
            disabled={!medicineName.trim() || loading.substitutes}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading.substitutes ? (
              <Loader2 className="animate-spin mr-2" />
            ) : (
              <RefreshCw className="mr-2" />
            )}
            Substitutes
          </button>
        </div>
      </div>

      {usage && (
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-blue-900 mb-2">Common Usage</h3>
          <p className="text-blue-800">{usage}</p>
        </div>
      )}

      {sideEffects && (
        <div className="bg-orange-50 border-l-4 border-orange-500 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-orange-900 mb-3">Possible Side Effects</h3>
          <ul className="list-disc list-inside space-y-1">
            {sideEffects.map((effect, index) => (
              <li key={index} className="text-orange-800">{effect}</li>
            ))}
          </ul>
        </div>
      )}

      {substitutes && (
        <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-green-900 mb-3">Common Substitutes</h3>
          <ul className="list-disc list-inside space-y-1">
            {substitutes.map((sub, index) => (
              <li key={index} className="text-green-800">{sub}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default MedicinePrediction