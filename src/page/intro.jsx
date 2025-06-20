import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Intro = () => {
    const [progress, setProgress] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer)
                    setIsLoading(false)
                    return 100
                }
                return prev + 2
            })
        }, 50)

        return () => clearInterval(timer)
    }, [])

    useEffect(() => {
        if (!isLoading) {
            const delayRedirect = setTimeout(() => {
                navigate('/accueil')
            }, 1000)
            return () => clearTimeout(delayRedirect)
        }
    }, [isLoading, navigate])



    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white px-8">
            {/* Nom de l'application */}
            <div className="text-center mb-6">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2">
                    <span className="text-black">Assistant</span>{' '}
                    <span className="text-orange-500">Digitale</span>
                </h1>
                <p className="text-gray-500 text-sm sm:text-base">
                    Votre assistant personnel intelligent
                </p>
            </div>

            {/* Barre de progression */}
            <div className="w-full max-w-xs sm:max-w-sm md:max-w-md">
                <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-100 ease-out shadow-sm"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Indicateur de progression */}
                <div className="flex justify-between items-center mt-4">
                    <span className="text-xs sm:text-sm text-gray-400">Chargement...</span>
                    <span className="text-xs sm:text-sm text-gray-400 font-medium">
                        {progress}%
                    </span>
                </div>
            </div>

            {/* Version */}
            <div className="absolute bottom-8 text-center">
                <p className="text-xs text-gray-400">Version 1.0.0</p>
            </div>
        </div>
    )
}

export default Intro
