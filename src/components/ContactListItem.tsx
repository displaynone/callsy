import { useMemo } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Avatar, Checkbox, TouchableRipple, useTheme } from 'react-native-paper';

import type { AllowedContact } from '../callsy';
import { getInitials } from '../utils/contacts';

export type ContactListItemProps = {
  contact: AllowedContact;
  selected: boolean;
  onToggle: () => void;
};

export function ContactListItem(props: ContactListItemProps) {
  const { contact, selected, onToggle } = props;
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  return (
    <TouchableRipple onPress={onToggle} borderless>
      <View style={styles.contactItem}>
        <View style={styles.contactAvatar}>
          {contact.avatarUri ? (
            <Avatar.Image size={44} source={{ uri: contact.avatarUri }} />
          ) : (
            <Avatar.Text size={44} label={getInitials(contact.name)} />
          )}
        </View>
        <View style={styles.itemText}>
          <Text style={styles.itemTitle} numberOfLines={1}>
            {contact.name}
          </Text>
          <Text style={styles.itemSubtitle} numberOfLines={1}>
            {contact.phoneNumbers[0]}
            {contact.phoneNumbers.length > 1 ? ` (+${contact.phoneNumbers.length - 1})` : ''}
          </Text>
        </View>
        <Checkbox status={selected ? 'checked' : 'unchecked'} onPress={onToggle} />
      </View>
    </TouchableRipple>
  );
}

function createStyles(theme: any) {
  return StyleSheet.create({
    contactItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.elevation.level1,
      borderRadius: 12,
      padding: 12,
      marginBottom: 10,
    },
    contactAvatar: {
      marginRight: 12,
    },
    itemText: {
      flex: 1,
    },
    itemTitle: {
      color: theme.colors.onSurface,
      fontWeight: '700',
    },
    itemSubtitle: {
      color: theme.colors.onSurfaceVariant,
      marginTop: 2,
    },
  });
}
