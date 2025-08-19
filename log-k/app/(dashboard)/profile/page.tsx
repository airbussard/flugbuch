import { redirect } from 'next/navigation'

export default function ProfilePage() {
  // Redirect to settings page which contains the profile information
  redirect('/settings')
}