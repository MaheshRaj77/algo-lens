import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import ChatWorkspace from '@/components/ChatWorkspace';

export const dynamic = 'force-dynamic';

export default async function AppDashboard() {
  const session = await auth();

  // Middleware should catch this, but double check just in case
  if (!session || !session.user || !session.user.id) {
    redirect('/auth/login');
  }

  // Fetch the user's chat history metadata
  const { data: initialChats } = await supabaseAdmin
    .from('chats')
    .select('id, title, created_at')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false });

  return (
    <ChatWorkspace 
      user={{ id: session.user.id, email: session.user.email }}
      initialChats={initialChats || []}
    />
  );
}
