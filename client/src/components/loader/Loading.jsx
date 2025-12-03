import React from 'react'
import PageLayout from '../../layout/PageLayout'

const Loading = () => {
  return (
   <PageLayout>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-gray-200 rounded-2xl h-24"></div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-gray-200 rounded-2xl h-64"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
  )
}

export default Loading
