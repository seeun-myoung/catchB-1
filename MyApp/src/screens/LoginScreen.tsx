import { View, Text, Alert } from 'react-native';
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

/**
 * ✅ 로그인 성공하면?
 * - 여기서 navigate 안 해도 됨
 * - AuthProvider가 user를 채움 → App.tsx에서 "로그인 후 스택"으로 자동 전환
 */

type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
};

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const LoginScreen = ({ navigation }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('입력 확인', '이메일과 비밀번호를 입력해줘!');
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.log(error, '에러');
      }
      console.log(data);
    } catch {
      console.log('오류');
    }
  };

  return (
    <View>
      <Text>LoginScreen</Text>
    </View>
  );
};

export default LoginScreen;
