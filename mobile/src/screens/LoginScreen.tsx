import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../lib/colors';
import { useAuthStore } from '../store/authStore';

export default function LoginScreen() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [buddyName, setBuddyName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { login, signup, isLoading, error, clearError } = useAuthStore();

  const handleSubmit = async () => {
    try {
      if (isSignup) {
        await signup(email, password, buddyName, true);
      } else {
        await login(email, password);
      }
    } catch {
      // handled by store
    }
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    clearError();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="wallet" size={32} color="#fff" />
          </View>
          <Text style={styles.appName}>Finance Buddy</Text>
          <Text style={styles.tagline}>Your AI Financial Companion</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.title}>
            {isSignup ? 'Create your account' : 'Welcome back'}
          </Text>
          <Text style={styles.subtitle}>
            {isSignup ? 'Start your financial journey with AI' : 'Sign in to your account'}
          </Text>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor={colors.slate[400]}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Enter your password"
                placeholderTextColor={colors.slate[400]}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={colors.slate[400]}
                />
              </TouchableOpacity>
            </View>
          </View>

          {isSignup && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Name your AI Buddy</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Penny, Max, Finley..."
                placeholderTextColor={colors.slate[400]}
                value={buddyName}
                onChangeText={setBuddyName}
              />
            </View>
          )}

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                {isSignup ? 'Create Account' : 'Sign In'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleMode} style={styles.toggleButton}>
            <Text style={styles.toggleText}>
              {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
            </Text>
          </TouchableOpacity>

          {/* Demo credentials */}
          <View style={styles.demoBox}>
            <Text style={styles.demoLabel}>Demo Credentials</Text>
            <Text style={styles.demoText}>demo@financebuddy.com / password123</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { flexGrow: 1 },
  header: {
    backgroundColor: colors.primary[600],
    paddingTop: 80,
    paddingBottom: 40,
    alignItems: 'center',
  },
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  appName: { fontSize: 28, fontWeight: '800', color: '#fff' },
  tagline: { fontSize: 14, color: colors.primary[200], marginTop: 4 },
  form: { padding: 24, flex: 1 },
  title: { fontSize: 24, fontWeight: '700', color: colors.slate[900], marginBottom: 4 },
  subtitle: { fontSize: 14, color: colors.slate[500], marginBottom: 24 },
  errorBox: {
    backgroundColor: colors.red[50],
    borderWidth: 1,
    borderColor: colors.red[400],
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  errorText: { color: colors.red[500], fontSize: 13 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: colors.slate[700], marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: colors.slate[200],
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.slate[900],
    backgroundColor: colors.slate[50],
  },
  passwordContainer: { position: 'relative' },
  passwordInput: { paddingRight: 48 },
  eyeButton: { position: 'absolute', right: 14, top: 14 },
  button: {
    backgroundColor: colors.primary[600],
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  toggleButton: { alignItems: 'center', marginTop: 16 },
  toggleText: { color: colors.primary[600], fontSize: 14, fontWeight: '600' },
  demoBox: {
    marginTop: 24,
    backgroundColor: colors.slate[50],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.slate[200],
    padding: 16,
  },
  demoLabel: { fontSize: 11, fontWeight: '600', color: colors.slate[500], marginBottom: 4 },
  demoText: { fontSize: 13, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', color: colors.slate[700] },
});
