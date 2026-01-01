import { Switch } from 'react-native-paper';
import { useTheme } from 'react-native-paper';

export type ToggleProps = {
  value: boolean;
  onValueChange: (next: boolean) => void;
  disabled?: boolean;
};

export function Toggle(props: ToggleProps) {
  const { value, onValueChange, disabled } = props;
  const theme = useTheme();
  return (
    <Switch
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      color={theme.colors.primary}
    />
  );
}
