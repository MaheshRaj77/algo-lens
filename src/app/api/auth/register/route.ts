import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { hashPassword } from '@/lib/hash';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password || password.length < 6) {
      return NextResponse.json(
        { error: 'Invalid email or password (min 6 chars required).' },
        { status: 400 }
      );
    }

    // 1. Check if user already exists
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists.' },
        { status: 409 }
      );
    }

    // 2. Hash the password with our custom pepper + bcrypt logic
    const password_hash = await hashPassword(password);

    // 3. Insert into Supabase `users` table (bypassing RLS with Admin key)
    const { data: newUser, error: insertError } = await supabaseAdmin
      .from('users')
      .insert([
        { 
          email, 
          password_hash,
          messages_remaining: 15 // Explicitly setting initial credits
        }
      ])
      .select('id, email, messages_remaining')
      .single();

    if (insertError) {
      console.error('Registration insertion error:', insertError);
      return NextResponse.json(
        { error: 'Failed to create user account.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Registration successful', user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration API error:', error);
    return NextResponse.json(
      { error: 'Internal server error during registration.' },
      { status: 500 }
    );
  }
}
