// src/screens/ProjectListScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  AccessibilityInfo,
} from 'react-native';
import axios from 'axios';

const ProjectListScreen = ({ navigation }) => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [searchQuery, projects]);

  const fetchProjects = async () => {
    try {
      // Mock data - replace with actual API call
      const mockProjects = [
        {
          id: '1',
          name: 'Highway 401 Expansion',
          location: 'Toronto, ON',
          contractor: 'ABC Construction Ltd.',
          contractAmount: 25000000,
          tenderDate: '2024-01-15',
          contractorEmail: 'contact@abcconstruction.com',
          description: 'Expansion of Highway 401 from 4 to 6 lanes',
          status: 'In Progress',
        },
        {
          id: '2',
          name: 'Downtown Bridge Repair',
          location: 'Vancouver, BC',
          contractor: 'XYZ Infrastructure Inc.',
          contractAmount: 15000000,
          tenderDate: '2024-02-20',
          contractorEmail: 'projects@xyzinfra.com',
          description: 'Structural repair and maintenance of downtown bridge',
          status: 'Completed',
        },
      ];

      setProjects(mockProjects);
      setLoading(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to load projects');
      setLoading(false);
    }
  };

  const filterProjects = () => {
    if (!searchQuery.trim()) {
      setFilteredProjects(projects);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = projects.filter(
      project =>
        project.name.toLowerCase().includes(query) ||
        project.location.toLowerCase().includes(query) ||
        project.contractor.toLowerCase().includes(query),
    );
    setFilteredProjects(filtered);
  };

  const formatCurrency = amount => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
    }).format(amount);
  };

  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('en-CA');
  };

  const renderProjectItem = ({ item }) => (
    <TouchableOpacity
      style={styles.projectItem}
      onPress={() => navigation.navigate('ProjectDetails', { project: item })}
      accessible={true}
      accessibilityLabel={`Project: ${item.name}. Location: ${
        item.location
      }. Contract amount: ${formatCurrency(
        item.contractAmount,
      )}. Tap for details`}
      accessibilityRole="button"
    >
      <Text style={styles.projectName} accessibilityRole="header">
        {item.name}
      </Text>
      <Text style={styles.projectLocation}>{item.location}</Text>
      <View style={styles.detailsRow}>
        <Text style={styles.detailLabel}>Contractor:</Text>
        <Text style={styles.detailValue}>{item.contractor}</Text>
      </View>
      <View style={styles.detailsRow}>
        <Text style={styles.detailLabel}>Amount:</Text>
        <Text style={styles.detailValue}>
          {formatCurrency(item.contractAmount)}
        </Text>
      </View>
      <View style={styles.detailsRow}>
        <Text style={styles.detailLabel}>Tender Date:</Text>
        <Text style={styles.detailValue}>{formatDate(item.tenderDate)}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.loadingText}>Loading projects...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by name, location, or contractor..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        accessible={true}
        accessibilityLabel="Search projects by name, location, or contractor"
        accessibilityRole="search"
      />

      <FlatList
        data={filteredProjects}
        renderItem={renderProjectItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {searchQuery
              ? 'No projects found matching your search'
              : 'No projects available'}
          </Text>
        }
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchInput: {
    backgroundColor: 'white',
    margin: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  listContainer: {
    padding: 16,
  },
  projectItem: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  projectName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  projectLocation: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: '#888',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '400',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 50,
  },
});

export default ProjectListScreen;
