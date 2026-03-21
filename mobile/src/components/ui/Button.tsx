import React from 'react';
import {
  Pressable,
  PressableProps,
  StyleSheet,
  ActivityIndicator,
  Text,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { borderRadius, spacing, fontSizes } from '../../theme';
import { typography } from '../../theme/typography';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps extends Omit<PressableProps, 'style'> {
  title: string;
  variant?: ButtonVariant;
  loading?: boolean;
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  style?: any;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const variantColors: Record<ButtonVariant, { bg: string; text: string; border?: string }> = {
  primary: { bg: '#0EA5E9', text: '#FFFFFF' },
  secondary: { bg: 'transparent', text: '#0EA5E9', border: '#0EA5E9' },
  ghost: { bg: 'transparent', text: '#0EA5E9' },
  danger: { bg: '#FF3B30', text: '#FFFFFF' },
};

const sizeStyles = {
  sm: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md, fontSize: fontSizes.sm },
  md: { paddingVertical: spacing.md, paddingHorizontal: spacing.lg, fontSize: fontSizes.base },
  lg: { paddingVertical: spacing.base, paddingHorizontal: spacing.xl, fontSize: fontSizes.md },
};

export function Button({
  title,
  variant = 'primary',
  loading = false,
  icon,
  size = 'md',
  onPress,
  style,
  disabled,
  ...props
}: ButtonProps) {
  const scheme = variantColors[variant];
  const sizeStyle = sizeStyles[size];
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = (e: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.(e);
  };

  return (
    <AnimatedPressable
      style={[
        styles.button,
        {
          backgroundColor: scheme.bg,
          paddingVertical: sizeStyle.paddingVertical,
          paddingHorizontal: sizeStyle.paddingHorizontal,
        },
        scheme.border && { borderWidth: 1.5, borderColor: scheme.border },
        disabled && styles.disabled,
        animatedStyle,
        style,
      ]}
      onPressIn={() => {
        scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 15, stiffness: 300 });
      }}
      onPress={handlePress}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={scheme.text} size="small" />
      ) : (
        <>
          {icon}
          <Text
            style={[
              styles.text,
              { color: scheme.text, fontSize: sizeStyle.fontSize },
              icon ? { marginLeft: spacing.sm } : undefined,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.lg,
  },
  text: {
    ...typography.headline,
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
});
