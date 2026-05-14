import { Navigate } from 'react-router-dom'
import { useData } from '../context/DataContext'

export default function PrivateRoute({ children }) {
  const { isAdmin } = useData()

  if (!isAdmin) {
    return <Navigate to="/admin" replace />
  }

  return children
}
