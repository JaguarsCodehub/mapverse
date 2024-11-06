import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Category, categories } from './CategorySelector';

type ThemeSelectorProps = {
  selectedThemes: string[];
  onThemeToggle: (themeId: string) => void;
};

export default function ThemeSelector({ selectedThemes, onThemeToggle }: ThemeSelectorProps) {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.container}
    >
      {categories.map((theme) => (
        <TouchableOpacity
          key={theme.id}
          style={[
            styles.themeButton,
            selectedThemes.includes(theme.id) && styles.selectedTheme,
            { backgroundColor: theme.color + '20' }, // Adding transparency
          ]}
          onPress={() => onThemeToggle(theme.id)}
        >
          <MaterialCommunityIcons
            name={theme.icon as any}
            size={24}
            color={selectedThemes.includes(theme.id) ? theme.color : '#8E8E93'}
          />
          <Text style={styles.themeName}>{theme.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    paddingHorizontal: 10,
  },
  themeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
  },
  selectedTheme: {
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  themeName: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
});
