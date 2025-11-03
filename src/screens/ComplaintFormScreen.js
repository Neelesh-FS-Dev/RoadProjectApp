// src/screens/ComplaintFormScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import axios from 'axios';

const ComplaintFormScreen = ({ navigation, route }) => {
  const { projectId } = route.params;

  const [formData, setFormData] = useState({
    description: '',
    contactEmail: '',
    consentGiven: false,
  });

  const [attachments, setAttachments] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_FILE_TYPES = [
    'image/jpeg',
    'image/png',
    'image/jpg',
    'video/mp4',
    'video/quicktime',
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (formData.contactEmail && !/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address';
    }

    if (!formData.consentGiven) {
      newErrors.consentGiven = 'You must consent to submit personal media';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAttachment = () => {
    Alert.alert('Add Attachment', 'Choose attachment method', [
      {
        text: 'Take Photo',
        onPress: () =>
          launchCamera(
            {
              mediaType: 'mixed',
              videoQuality: 'high',
              maxWidth: 1024,
              maxHeight: 1024,
            },
            handleMediaSelection,
          ),
      },
      {
        text: 'Choose from Library',
        onPress: () =>
          launchImageLibrary(
            {
              mediaType: 'mixed',
              videoQuality: 'high',
              maxWidth: 1024,
              maxHeight: 1024,
              selectionLimit: 5,
            },
            handleMediaSelection,
          ),
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };

  const handleMediaSelection = response => {
    if (response.didCancel) return;

    if (response.errorCode) {
      Alert.alert('Error', `Failed to select media: ${response.errorMessage}`);
      return;
    }

    const selectedAssets = response.assets || [];

    selectedAssets.forEach(asset => {
      // Validate file type
      if (!ALLOWED_FILE_TYPES.includes(asset.type)) {
        Alert.alert(
          'Invalid File Type',
          'Please select only images (JPEG, PNG) or videos (MP4, MOV)',
        );
        return;
      }

      // Validate file size
      if (asset.fileSize > MAX_FILE_SIZE) {
        Alert.alert('File Too Large', 'Please select files smaller than 10MB');
        return;
      }

      setAttachments(prev => [
        ...prev,
        {
          uri: asset.uri,
          type: asset.type,
          fileName: asset.fileName || `attachment-${Date.now()}`,
          fileSize: asset.fileSize,
        },
      ]);
    });
  };

  const removeAttachment = index => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const submissionData = new FormData();

      submissionData.append('projectId', projectId);
      submissionData.append('description', formData.description);
      submissionData.append('contactEmail', formData.contactEmail);
      submissionData.append('consentGiven', formData.consentGiven);
      submissionData.append('submissionDate', new Date().toISOString());

      // Append attachments
      attachments.forEach((attachment, index) => {
        submissionData.append('attachments', {
          uri: attachment.uri,
          type: attachment.type,
          name: attachment.fileName,
        });
      });

      // Replace with your actual API endpoint
      const response = await axios.post(
        'https://your-api-domain.com/api/complaints',
        submissionData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 30000,
        },
      );

      if (response.status === 200 || response.status === 201) {
        Alert.alert(
          'Success',
          'Your complaint has been submitted successfully.',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ],
        );
      }
    } catch (error) {
      console.error('Submission error:', error);
      Alert.alert(
        'Submission Failed',
        'Unable to submit your complaint. Please try again later.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Complaint Description *</Text>
          <TextInput
            style={[styles.textArea, errors.description && styles.inputError]}
            placeholder="Please provide detailed description of your complaint..."
            value={formData.description}
            onChangeText={text =>
              setFormData(prev => ({ ...prev, description: text }))
            }
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            accessible={true}
            accessibilityLabel="Complaint description"
            accessibilityHint="Enter detailed description of your complaint. This field is required."
          />
          {errors.description && (
            <Text style={styles.errorText}>{errors.description}</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Contact Email (Optional)</Text>
          <TextInput
            style={[styles.input, errors.contactEmail && styles.inputError]}
            placeholder="your.email@example.com"
            value={formData.contactEmail}
            onChangeText={text =>
              setFormData(prev => ({ ...prev, contactEmail: text }))
            }
            keyboardType="email-address"
            autoCapitalize="none"
            accessible={true}
            accessibilityLabel="Contact email"
            accessibilityHint="Optional email address for follow-up"
          />
          {errors.contactEmail && (
            <Text style={styles.errorText}>{errors.contactEmail}</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Attachments</Text>
          <Text style={styles.helperText}>
            You can attach photos or videos (max 10MB each, JPEG, PNG, MP4, MOV)
          </Text>

          <TouchableOpacity
            style={styles.attachmentButton}
            onPress={handleAttachment}
            accessible={true}
            accessibilityLabel="Add photo or video attachment"
            accessibilityRole="button"
          >
            <Text style={styles.attachmentButtonText}>+ Add Attachment</Text>
          </TouchableOpacity>

          {attachments.map((attachment, index) => (
            <View key={index} style={styles.attachmentItem}>
              <Text style={styles.attachmentName} numberOfLines={1}>
                {attachment.fileName}
              </Text>
              <TouchableOpacity onPress={() => removeAttachment(index)}>
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.consentGroup}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() =>
              setFormData(prev => ({
                ...prev,
                consentGiven: !prev.consentGiven,
              }))
            }
            accessible={true}
            accessibilityLabel="Consent to submit personal media"
            accessibilityRole="checkbox"
            accessibilityState={{ checked: formData.consentGiven }}
          >
            <View
              style={[
                styles.checkboxBox,
                formData.consentGiven && styles.checkboxChecked,
              ]}
            >
              {formData.consentGiven && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.consentText}>
              I consent to submitting personal media and understand it will be
              used for complaint processing *
            </Text>
          </TouchableOpacity>
          {errors.consentGiven && (
            <Text style={styles.errorText}>{errors.consentGiven}</Text>
          )}
        </View>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
          accessible={true}
          accessibilityLabel="Submit complaint"
          accessibilityRole="button"
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.submitButtonText}>Submit Complaint</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  helperText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  input: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  textArea: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    minHeight: 120,
  },
  inputError: {
    borderColor: '#dc3545',
  },
  errorText: {
    color: '#dc3545',
    fontSize: 14,
    marginTop: 4,
  },
  attachmentButton: {
    backgroundColor: '#0066cc',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  attachmentButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  attachmentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  attachmentName: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    marginRight: 8,
  },
  removeText: {
    color: '#dc3545',
    fontSize: 14,
    fontWeight: 'bold',
  },
  consentGroup: {
    marginBottom: 30,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkboxBox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#0066cc',
    borderColor: '#0066cc',
  },
  checkmark: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  consentText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#6c757d',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ComplaintFormScreen;
