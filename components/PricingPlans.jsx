import { useState, useEffect } from 'react'
import { getCountryFromIP } from '@/lib/geoPricing'
import { useUser, useAuth, useSignIn } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'

const regions = {
  US: { currency: '$', starter: 24.99, pro: 39.99 },
  AU: { currency: 'AUD $', starter: 29, pro: 49 },
  IN: { currency: '₹', starter: 2000, pro: 2800 },
  // add others
}

export default function PricingPlans() {
  const [countryCode, setCountryCode] = useState('US')
  const [prices, setPrices] = useState(regions['US'])
  const [loading, setLoading] = useState(true)

  const { isSignedIn } = useAuth()
  const { user } = useUser()
  const { signIn } = useSignIn()
  const navigate = useNavigate()

  useEffect(() => {
    getCountryFromIP().then(cc => {
      setCountryCode(cc)
      setPrices(regions[cc] || regions['US'])
      setLoading(false)
    })
  }, [])

  if (loading) return <p>Loading geo pricing...</p>

  const handleStart = async (planId) => {
    if (!isSignedIn) {
      signIn.open({
        redirectUrl: `/pricing?plan=${planId}`,
        afterSignInUrl: `/pricing?plan=${planId}`
      })
      return
    }

    const priceReq = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        planId,
        userId: user.id,
        email: user.primaryEmailAddress.emailAddress,
        countryCode
      })
    })
    const { url } = await priceReq.json()
    if (url) window.location.href = url
  }

  return (
    <div>
      <h2 className="text-3xl font-bold">Choose your plan ({countryCode})</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
        <div className="bg-white shadow rounded p-6">
          <h3 className="text-xl font-semibold">Starter</h3>
          <p className="text-lg">{prices.currency}{prices.starter} /month</p>
          <button onClick={() => handleStart('starter')} className="mt-4 btn-primary">Start Starter</button>
        </div>
        <div className="bg-white shadow rounded p-6 border-2 border-indigo-500">
          <h3 className="text-xl font-semibold">Pro</h3>
          <p className="text-lg">{prices.currency}{prices.pro} /month</p>
          <button onClick={() => handleStart('pro')} className="mt-4 btn-primary">Start Pro</button>
        </div>
      </div>
    </div>
  )
}
  
