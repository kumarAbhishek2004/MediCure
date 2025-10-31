import { Link } from 'react-router-dom'
import { Pill, Leaf, MessageCircle, ArrowRight } from 'lucide-react'

const Home = () => {
  const features = [
    {
      icon: Pill,
      title: 'Medicine Prediction',
      description: 'Get insights on medicine usage, side effects, and substitutes using AI',
      path: '/medicine',
      color: 'bg-blue-500'
    },
    {
      icon: Leaf,
      title: 'Home Remedies',
      description: 'Discover traditional remedies for common health issues',
      path: '/remedies',
      color: 'bg-green-500'
    },
    {
      icon: MessageCircle,
      title: 'AI Doctor Assistant',
      description: 'Chat with our AI doctor for health guidance and recommendations',
      path: '/chatbot',
      color: 'bg-purple-500'
    }
  ]

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Welcome to MediCure
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Your AI-powered healthcare assistant for medicine information, home remedies, 
          and health consultations
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature) => {
          const Icon = feature.icon
          return (
            <Link
              key={feature.path}
              to={feature.path}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300 group"
            >
              <div className={`${feature.color} w-16 h-16 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {feature.description}
              </p>
              <div className="flex items-center text-indigo-600 font-medium group-hover:text-indigo-800">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
              </div>
            </Link>
          )
        })}
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">About MediCure</h2>
        <p className="text-gray-600 text-lg mb-4">
          MediCure is an advanced AI-powered healthcare platform designed to provide 
          accurate information about medicines, traditional remedies, and health consultations.
        </p>
        <p className="text-gray-600 text-lg">
          Our platform uses state-of-the-art machine learning models and natural language 
          processing to help you make informed decisions about your health. However, please 
          remember that this is not a substitute for professional medical advice.
        </p>
      </div>
    </div>
  )
}

export default Home
