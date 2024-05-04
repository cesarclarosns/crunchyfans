import { redirect } from 'next/navigation';

export default async function SettingsPage() {
  redirect('/my/settings/account');
}
