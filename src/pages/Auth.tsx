import { useState } from 'react';
import { SignInCard } from '@/components/ui/sign-in-card-2';
import { useAuth } from '@/hooks/useAuth';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signIn, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    const { error: signInError } = await signIn(email, password);
    
    if (signInError) {
      if (signInError.message === 'Invalid login credentials') {
        setError('Invalid email or password');
      } else {
        setError('An error occurred during sign in. Please try again.');
      }
    }
  };

  return (
    <SignInCard
      email={email}
      password={password}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
    />
  );
};

export default Auth;