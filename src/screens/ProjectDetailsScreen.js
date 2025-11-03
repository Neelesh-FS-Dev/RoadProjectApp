// src/screens/ProjectDetailsScreen.js
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
} from 'react-native';

const ProjectDetailsScreen = ({ navigation, route }) => {
  const { project } = route.params;

  const formatCurrency = amount => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
    }).format(amount);
  };

  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('en-CA');
  };

  const handleEmailPress = () => {
    if (project.contractorEmail) {
      Linking.openURL(`mailto:${project.contractorEmail}`);
    }
  };

  const handleSubmitComplaint = () => {
    navigation.navigate('ComplaintForm', { projectId: project.id });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.projectName} accessibilityRole="header">
          {project.name}
        </Text>

        <View style={styles.detailSection}>
          <Text style={styles.sectionTitle}>Project Information</Text>
          <DetailRow label="Location" value={project.location} />
          <DetailRow label="Status" value={project.status} />
          <DetailRow
            label="Contract Amount"
            value={formatCurrency(project.contractAmount)}
          />
          <DetailRow
            label="Tender Date"
            value={formatDate(project.tenderDate)}
          />
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.sectionTitle}>Contractor Details</Text>
          <DetailRow label="Company Name" value={project.contractor} />
          <TouchableOpacity
            onPress={handleEmailPress}
            accessible={true}
            accessibilityLabel={`Contact contractor via email: ${project.contractorEmail}`}
            accessibilityRole="link"
          >
            <DetailRow
              label="Email"
              value={project.contractorEmail}
              isLink={true}
            />
          </TouchableOpacity>
        </View>

        {project.description && (
          <View style={styles.detailSection}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{project.description}</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.complaintButton}
          onPress={handleSubmitComplaint}
          accessible={true}
          accessibilityLabel="Submit a complaint about this project"
          accessibilityRole="button"
        >
          <Text style={styles.complaintButtonText}>Submit Complaint</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const DetailRow = ({ label, value, isLink = false }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}:</Text>
    <Text style={[styles.detailValue, isLink && styles.linkText]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: 'white',
    margin: 16,
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  projectName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  detailLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
    flex: 1,
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '400',
    flex: 2,
    textAlign: 'right',
  },
  linkText: {
    color: '#0066cc',
    textDecorationLine: 'underline',
  },
  descriptionText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  complaintButton: {
    backgroundColor: '#dc3545',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  complaintButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProjectDetailsScreen;
