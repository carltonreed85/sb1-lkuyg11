import axios from 'axios';
import { logger } from '../../utils/logger';

export class FHIRClient {
  private baseUrl: string;
  private authToken: string;

  constructor(config: { baseUrl: string; authToken: string }) {
    this.baseUrl = config.baseUrl;
    this.authToken = config.authToken;
  }

  private async request(method: string, resource: string, data?: any) {
    try {
      const response = await axios({
        method,
        url: `${this.baseUrl}/${resource}`,
        data,
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
          'Content-Type': 'application/fhir+json'
        }
      });
      return response.data;
    } catch (error) {
      logger.error('FHIR request failed', { method, resource, error });
      throw error;
    }
  }

  async getPatient(patientId: string) {
    return this.request('GET', `Patient/${patientId}`);
  }

  async createServiceRequest(data: any) {
    return this.request('POST', 'ServiceRequest', data);
  }

  async updateServiceRequest(id: string, data: any) {
    return this.request('PUT', `ServiceRequest/${id}`, data);
  }

  async searchPatients(params: any) {
    const queryString = Object.entries(params)
      .map(([key, value]) => `${key}=${encodeURIComponent(value as string)}`)
      .join('&');
    return this.request('GET', `Patient?${queryString}`);
  }
}