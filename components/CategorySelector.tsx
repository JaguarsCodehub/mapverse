import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export type Category = {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
};

const categories: Category[] = [
  { 
    id: '1', 
    name: 'Historic', 
    icon: 'castle', 
    description: 'Explore historical landmarks and cultural heritage sites',
    color: '#FF6B6B'
  },
  { 
    id: '2', 
    name: 'Foodie', 
    icon: 'food', 
    description: 'Discover local cuisine and popular eateries',
    color: '#4ECDC4'
  },
  { 
    id: '3', 
    name: 'Nature', 
    icon: 'tree', 
    description: 'Experience parks, trails, and natural attractions',
    color: '#45B7D1'
  },
  { 
    id: '4', 
    name: 'Adventure', 
    icon: 'hiking', 
    description: 'Find exciting activities and adventure spots',
    color: '#96CEB4'
  },
  { 
    id: '5', 
    name: 'Shopping', 
    icon: 'shopping', 
    description: 'Browse local markets and shopping areas',
    color: '#D4A5A5'
  }
];

type CategorySelectorProps = {
  selectedCategory: string;
  onSelectCategory: (category: Category) => void;
};

export default function CategorySelector({
  selectedCategory,
  onSelectCategory,
}: CategorySelectorProps) {
  return (
    <View style={styles.container}>
      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.categoryButton,
            selectedCategory === category.id && styles.selectedCategory,
          ]}
          onPress={() => onSelectCategory(category)}
        >
          <MaterialCommunityIcons
            name={category.icon as any}
            size={24}
            color={selectedCategory === category.id ? '#007AFF' : '#8E8E93'}
          />
          <Text
            style={[
              styles.categoryText,
              selectedCategory === category.id && styles.selectedCategoryText,
            ]}
          >
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  categoryButton: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
    width: '48%',
    marginBottom: 8,
  },
  selectedCategory: {
    backgroundColor: '#E5F0FF',
  },
  categoryText: {
    color: '#8E8E93',
    marginTop: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: '#007AFF',
    fontWeight: '600',
  },
});

export { categories };
