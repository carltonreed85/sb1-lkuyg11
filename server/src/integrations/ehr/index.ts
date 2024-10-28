import { FHIRClient } from './fhir';
import { HL7Client } from './hl7';
import { logger } from '../../utils/logger';

export class EHRIntegration {
  private fhirClient: FHIRClient;
  private hl7Client: HL7Client;

  constructor(config: {
    fhir: {
      baseUrl: string;
      authToken: string;
    };
    hl7: {
      host: string;
      port: number;
      facilityId: string;
    };
  }) {
    this.fhirClient = new FHIRClient(config.fhir);
    this.hl7Client = new HL7Client(config.hl7);
  }

  async getPatient(patientId: string) {
    try {
      // Try FHIR first
      const fhirPatient = await this.fhirClient.getPatient(patientId);
      return this.mapFHIRPatient(fhirPatient);
    } catch (error) {
      logger.error('FHIR patient fetch failed, trying HL7', error);
      
      // Fallback to HL7
      const hl7Patient = await this.hl7Client.getPatient(patientId);
      return this.mapHL7Patient(hl7Patient);
    }
  }

  async syncReferral(referralData: any) {
    try {
      // Create FHIR ServiceRequest
      await this.fhirClient.createServiceRequest({
        subject: { reference: `Patient/${referralData.patientId}` },
        requester: { reference: `Practitioner/${referralData.requestingProviderId}` },
        performer: { reference: `Practitioner/${referralData.referredToProviderId}` },
        reasonCode: [{ text: referralData.reason }],
        status: 'active',
        intent: 'order',
        priority: referralData.priority,
        category: [{ text: referralData.specialty }]
      });

      // Send HL7 REF message
      await this.hl7Client.sendReferral({
        messageType: 'REF',
        patientId: referralData.patientId,
        referringProvider: referralData.requestingProviderId,
        receivingProvider: referralData.referredToProviderId,
        reason: referralData.reason,
        priority: referralData.priority,
        specialty: referralData.specialty
      });

    } catch (error) {
      logger.error('Failed to sync referral with EHR', error);
      throw new Error('EHR sync failed');
    }
  }

  private mapFHIRPatient(fhirPatient: any) {
    return {
      id: fhirPatient.id,
      firstName: fhirPatient.name[0]?.given[0],
      lastName: fhirPatient.name[0]?.family,
      dateOfBirth: fhirPatient.birthDate,
      gender: fhirPatient.gender,
      contact: {
        phone: fhirPatient.telecom?.find(t => t.system === 'phone')?.value,
        email: fhirPatient.telecom?.find(t => t.system === 'email')?.value,
        address: fhirPatient.address?.[0]
      }
    };
  }

  private mapHL7Patient(hl7Patient: any) {
    // Map HL7 patient data to common format
    return {
      id: hl7Patient.PID.patientId,
      firstName: hl7Patient.PID.patientName.givenName,
      lastName: hl7Patient.PID.patientName.familyName,
      dateOfBirth: hl7Patient.PID.dateOfBirth,
      gender: hl7Patient.PID.gender,
      contact: {
        phone: hl7Patient.PID.phoneNumber,
        email: hl7Patient.PID.emailAddress,
        address: hl7Patient.PID.address
      }
    };
  }
}