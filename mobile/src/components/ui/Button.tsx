import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Text } from './Text';
import { colors, borderRadius, spacing, fonts, fontSizes } from '../../theme';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  loading?: boolean;
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const variantColors: Record<ButtonVariant, { bg: string; text: string; border?: string }> = {
  primary: { bg: colors.red, text: colors.white },
  secondary: { bg: 'transparent', text: colors.navy, border: colors.navy },
  ghost: { bg: 'transparent', text: colors.navy },
  danger: { bg: colors.error, text: colors.white },
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

  const handlePress = async (e: any) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.(e);
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: scheme.bg,
          paddingVertical: sizeStyle.paddingVertical,
          paddingHorizontal: sizeStyle.paddingHorizontal,
        },
        scheme.border && { borderWidth: 1.5, borderColor: scheme.border },
        disabled && styles.disabled,
        style,
      ]}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.7}
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
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
  },
  text: {
    fontFamily: fonts.bodySemiBold,
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
});
