import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../lib/colors';

import DashboardScreen from '../screens/DashboardScreen';
import BudgetScreen from '../screens/BudgetScreen';
import PortfolioScreen from '../screens/PortfolioScreen';
import ChatScreen from '../screens/ChatScreen';
import LearnScreen from '../screens/LearnScreen';
import ExpensesScreen from '../screens/ExpensesScreen';
import BankingScreen from '../screens/BankingScreen';
import SavingsScreen from '../screens/SavingsScreen';
import RothIRAScreen from '../screens/RothIRAScreen';
import FourOhOneKScreen from '../screens/FourOhOneKScreen';
import CreditCardsScreen from '../screens/CreditCardsScreen';
import FraudProtectionScreen from '../screens/FraudProtectionScreen';
import LoansScreen from '../screens/LoansScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const stackScreenOptions = {
  headerStyle: { backgroundColor: '#fff' },
  headerTitleStyle: { fontWeight: '700' as const, fontSize: 18, color: colors.slate[900] },
  headerShadowVisible: false,
  headerTintColor: colors.primary[600],
};

const tabConfig: Record<string, { icon: keyof typeof Ionicons.glyphMap; focusedIcon: keyof typeof Ionicons.glyphMap }> = {
  HomeTab: { icon: 'grid-outline', focusedIcon: 'grid' },
  ChatTab: { icon: 'chatbubble-outline', focusedIcon: 'chatbubble' },
  InvestTab: { icon: 'trending-up-outline', focusedIcon: 'trending-up' },
  LearnTab: { icon: 'school-outline', focusedIcon: 'school' },
};

// Home tab has stack navigation to ALL screens
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="Expenses" component={ExpensesScreen} options={{ title: 'My Expenses' }} />
      <Stack.Screen name="Budget" component={BudgetScreen} options={{ title: 'Budget Tracker' }} />
      <Stack.Screen name="Banking" component={BankingScreen} />
      <Stack.Screen name="Savings" component={SavingsScreen} options={{ title: 'Savings Goals' }} />
      <Stack.Screen name="Portfolio" component={PortfolioScreen} />
      <Stack.Screen name="RothIRA" component={RothIRAScreen} options={{ title: 'Roth IRA' }} />
      <Stack.Screen name="FourOhOneK" component={FourOhOneKScreen} options={{ title: '401(K)' }} />
      <Stack.Screen name="CreditCards" component={CreditCardsScreen} options={{ title: 'Smart Credit Cards' }} />
      <Stack.Screen name="FraudProtection" component={FraudProtectionScreen} options={{ title: 'Fraud Protection' }} />
      <Stack.Screen name="Loans" component={LoansScreen} options={{ title: 'Loans' }} />
      <Stack.Screen name="Chat" component={ChatScreen} options={{ title: 'AI Chat' }} />
      <Stack.Screen name="Learn" component={LearnScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          const cfg = tabConfig[route.name];
          const iconName = focused ? cfg.focusedIcon : cfg.icon;
          return <Ionicons name={iconName} size={22} color={color} />;
        },
        tabBarActiveTintColor: colors.primary[600],
        tabBarInactiveTintColor: colors.slate[400],
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: colors.slate[200],
          height: 85,
          paddingTop: 8,
          paddingBottom: 28,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        headerShown: false,
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeStack} options={{ title: 'Home' }} />
      <Tab.Screen
        name="ChatTab"
        component={ChatScreen}
        options={{
          title: 'Chat',
          headerShown: true,
          headerTitle: 'AI Chat',
          headerStyle: { backgroundColor: '#fff' },
          headerTitleStyle: { fontWeight: '700', fontSize: 18, color: colors.slate[900] },
          headerShadowVisible: false,
        }}
      />
      <Tab.Screen
        name="InvestTab"
        component={PortfolioScreen}
        options={{
          title: 'Invest',
          headerShown: true,
          headerTitle: 'Portfolio',
          headerStyle: { backgroundColor: '#fff' },
          headerTitleStyle: { fontWeight: '700', fontSize: 18, color: colors.slate[900] },
          headerShadowVisible: false,
        }}
      />
      <Tab.Screen
        name="LearnTab"
        component={LearnScreen}
        options={{
          title: 'Learn',
          headerShown: true,
          headerTitle: 'Learn',
          headerStyle: { backgroundColor: '#fff' },
          headerTitleStyle: { fontWeight: '700', fontSize: 18, color: colors.slate[900] },
          headerShadowVisible: false,
        }}
      />
    </Tab.Navigator>
  );
}
