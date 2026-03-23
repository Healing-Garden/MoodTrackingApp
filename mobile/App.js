import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Auth Screens
import LandingScreen from './src/screens/Auth/LandingScreen';
import LoginScreen from './src/screens/Auth/LoginScreen';
import RegisterScreen from './src/screens/Auth/RegisterScreen';

// Onboarding Screens
import StepOneScreen from './src/screens/Onboarding/StepOneScreen';
import StepTwoScreen from './src/screens/Onboarding/StepTwoScreen';
import StepThreeScreen from './src/screens/Onboarding/StepThreeScreen';
import StepFourScreen from './src/screens/Onboarding/StepFourScreen';
import WelcomeScreen from './src/screens/Onboarding/WelcomeScreen';
import IntroTwoScreen from './src/screens/Onboarding/IntroTwoScreen';

// Main Screens
import DashboardScreen from './src/screens/Main/DashboardScreen';
import JournalScreen from './src/screens/Main/JournalScreen';
import InsightsScreen from './src/screens/Main/InsightsScreen';
import ChatbotScreen from './src/screens/Main/ChatbotScreen';
import FeedbackScreen from './src/screens/Main/FeedbackScreen';
import DashboardAdminScreens from './src/screens/Admin/DashboardAdminScreens';
import ManagementFeedback from './src/screens/Admin/managementFeedback';
import AdminFeedbackScreen from './src/screens/Admin/AdminFeedbackScreen';
import AdminResourceManagementScreen from './src/screens/Admin/AdminResourceManagementScreen';

// Settings Screens
import EditProfileScreen from './src/screens/Settings/EditProfileScreen';
import ChangePasswordScreen from './src/screens/Settings/ChangePasswordScreen';
import ChangePinScreen from './src/screens/Settings/ChangePinScreen';
import EditPinScreen from './src/screens/Settings/EditPinScreen';
import SettingScreen from './src/screens/Settings/SettingScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Landing"
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* Auth Flow */}
        <Stack.Screen name="Landing" component={LandingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />

        {/* Onboarding Flow */}
        <Stack.Screen name="OnboardingStep1" component={StepOneScreen} />
        <Stack.Screen name="OnboardingStep2" component={StepTwoScreen} />
        <Stack.Screen name="OnboardingStep3" component={StepThreeScreen} />
        <Stack.Screen name="OnboardingStep4" component={StepFourScreen} />
        <Stack.Screen name="OnboardingWelcome" component={WelcomeScreen} />
        <Stack.Screen name="OnboardingIntro2" component={IntroTwoScreen} />

        {/* Main Flow */}
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Journal" component={JournalScreen} />
        <Stack.Screen name="Insights" component={InsightsScreen} />
        <Stack.Screen name="Chatbot" component={ChatbotScreen} />
        <Stack.Screen name="Feedback" component={FeedbackScreen} />
        <Stack.Screen name="AdminDashboard" component={DashboardAdminScreens} />
        <Stack.Screen name="ManagementFeedback" component={ManagementFeedback} />
        <Stack.Screen name="AdminFeedback" component={AdminFeedbackScreen} />
        <Stack.Screen name="AdminUsers" component={ManagementFeedback} />
        <Stack.Screen name="AdminContent" component={AdminResourceManagementScreen} />
        <Stack.Screen name="AdminSettings" component={SettingScreen} />

        {/* Settings Flow */}
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
        <Stack.Screen name="ChangePin" component={ChangePinScreen} />
        <Stack.Screen name="EditPin" component={EditPinScreen} />
        <Stack.Screen name="Settings" component={SettingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
